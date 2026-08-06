from dataclasses import dataclass
from datetime import date
from decimal import Decimal, ROUND_HALF_UP
from uuid import UUID

from django.conf import settings
from django.db import IntegrityError, transaction
from django.utils import timezone

from accounts.models import UserRole
from rest_framework.exceptions import PermissionDenied

from bookings.exceptions import (
    BookingNotFoundError,
    BookingSessionExpiredError,
    BookingSessionNotActiveError,
    BookingSessionNotFoundError,
    InvalidBookingDateError,
    PaymentNotFoundError,
    PaymentNotSuccessfulError,
    RazorpayOrderCreationError,
    ScheduleUnavailableError,
    SlotAlreadyBookedError,
    SlotLockedError,
    VenueNotAvailableError,
    VenueScheduleNotFoundError,
)
from bookings.models import (
    Booking,
    BookingAuditEvent,
    BookingAuditLog,
    BookingSession,
    BookingSessionStatus,
    BookingStatus,
    Payment,
    PaymentProvider,
    PaymentStatus,
)
from bookings.services.razorpay_service import RazorpayService
from venues.availability import is_schedule_available_on_date, is_slot_time_in_past
from venues.models import Venue, VenueSchedule, VenueStatus


@dataclass(frozen=True)
class BookingStartResult:
    booking_session: BookingSession
    payment: Payment
    amount_paise: int
    currency: str
    key: str


class BookingService:
    @staticmethod
    def get_user_bookings(user):
        return (
            Booking.objects.filter(user=user)
            .select_related(
                "payment",
                "venue_schedule",
                "venue_schedule__group",
                "venue_schedule__group__venue",
                "venue_schedule__group__venue__city",
                "venue_schedule__group__venue__city__district",
            )
            .order_by("-booking_date", "-confirmed_at")
        )

    @staticmethod
    def get_owner_bookings(user, *, venue_slug: str | None = None):
        queryset = (
            Booking.objects.filter(venue_schedule__group__venue__owner=user)
            .select_related(
                "user",
                "payment",
                "venue_schedule",
                "venue_schedule__group",
                "venue_schedule__group__venue",
                "venue_schedule__group__venue__city",
                "venue_schedule__group__venue__city__district",
            )
            .order_by("-booking_date", "-confirmed_at")
        )
        if venue_slug:
            queryset = queryset.filter(
                venue_schedule__group__venue__slug=venue_slug,
            )
        return queryset

    @staticmethod
    def get_booking_detail(*, booking_id: UUID, user) -> Booking:
        booking = (
            Booking.objects.select_related(
                "payment",
                "user",
                "venue_schedule",
                "venue_schedule__group",
                "venue_schedule__group__venue",
                "venue_schedule__group__venue__city",
            )
            .prefetch_related("venue_schedule__group__venue__images")
            .filter(pk=booking_id)
            .first()
        )
        if booking is None:
            raise BookingNotFoundError("Booking not found.")
        if not BookingService._can_access_booking(user, booking):
            raise PermissionDenied(
                "You do not have permission to access this booking.",
            )
        return booking

    @staticmethod
    def _can_access_booking(user, booking: Booking) -> bool:
        if booking.user_id == user.id:
            return True
        if user.role == UserRole.ADMIN:
            return True
        if user.role == UserRole.VENUE:
            return booking.venue_schedule.group.venue.owner_id == user.id
        return False

    @staticmethod
    def start_booking(
        *,
        user,
        venue_schedule_id: int,
        booking_date: date,
    ) -> BookingStartResult:
        schedule = BookingService._get_schedule(venue_schedule_id)
        venue = schedule.group.venue

        BookingService._validate_booking_date(booking_date)
        BookingService._validate_venue(venue)
        BookingService._validate_schedule(schedule, booking_date)
        BookingService._ensure_slot_not_booked(schedule, booking_date)
        BookingService._ensure_slot_not_locked(schedule, booking_date)

        locked_price = schedule.price
        expires_at = timezone.now() + settings.BOOKING_LOCK_DURATION

        try:
            with transaction.atomic():
                BookingService._ensure_slot_not_booked(schedule, booking_date)
                BookingService._ensure_slot_not_locked(schedule, booking_date)
                session = BookingSession.objects.create(
                    user=user,
                    venue_schedule=schedule,
                    booking_date=booking_date,
                    status=BookingSessionStatus.ACTIVE,
                    expires_at=expires_at,
                    locked_price=locked_price,
                )
        except IntegrityError as exc:
            raise SlotLockedError(
                "Someone else is currently booking this slot. "
                "Please try again in a few minutes.",
            ) from exc

        amount_paise = BookingService._to_paise(locked_price)

        try:
            order = RazorpayService().create_order(
                amount_paise=amount_paise,
                currency="INR",
                receipt=str(session.id),
            )
        except RazorpayOrderCreationError:
            BookingService._release_session(session)
            raise

        with transaction.atomic():
            payment = Payment.objects.create(
                booking_session=session,
                provider=PaymentProvider.RAZORPAY,
                razorpay_order_id=order["id"],
                amount=locked_price,
                currency="INR",
                status=PaymentStatus.ORDER_CREATED,
                gateway_response=order,
            )

        return BookingStartResult(
            booking_session=session,
            payment=payment,
            amount_paise=amount_paise,
            currency="INR",
            key=settings.RAZORPAY_KEY_ID,
        )

    @staticmethod
    def abandon_booking_session(*, booking_session_id: UUID, user) -> None:
        with transaction.atomic():
            session = (
                BookingSession.objects.select_for_update()
                .filter(pk=booking_session_id, user=user)
                .first()
            )
            if session is None:
                raise BookingSessionNotFoundError("Booking session not found.")

            if session.status != BookingSessionStatus.ACTIVE:
                return

            now = timezone.now()
            session.status = BookingSessionStatus.FAILED
            session.lock_released_at = now
            session.remarks = "Payment cancelled or failed"
            session.save(
                update_fields=["status", "lock_released_at", "remarks", "updated_at"],
            )

            payment = (
                Payment.objects.select_for_update()
                .filter(booking_session=session)
                .first()
            )
            if payment is not None and payment.status == PaymentStatus.ORDER_CREATED:
                payment.status = PaymentStatus.FAILED
                payment.save(update_fields=["status", "updated_at"])

            BookingAuditLog.objects.create(
                booking_session=session,
                payment=payment,
                event=BookingAuditEvent.PAYMENT_FAILED,
                description=(
                    f"Booking lock released after payment was cancelled or failed "
                    f"for {session.booking_date} on schedule "
                    f"{session.venue_schedule_id}."
                ),
            )

    @staticmethod
    def complete_booking(booking_session_id: UUID) -> Booking:
        with transaction.atomic():
            session = (
                BookingSession.objects.select_for_update()
                .filter(pk=booking_session_id)
                .first()
            )
            if session is None:
                raise BookingSessionNotFoundError("Booking session not found.")

            BookingService._validate_booking_session(session)

            payment = (
                Payment.objects.select_for_update()
                .filter(booking_session=session)
                .first()
            )
            if payment is None:
                raise PaymentNotFoundError("Payment not found for this booking session.")

            if payment.status != PaymentStatus.SUCCESS:
                raise PaymentNotSuccessfulError(
                    "Payment has not been completed successfully.",
                )

            BookingService._ensure_slot_not_booked(
                session.venue_schedule,
                session.booking_date,
            )

            now = timezone.now()

            try:
                booking = Booking.objects.create(
                    booking_session=session,
                    payment=payment,
                    user=session.user,
                    venue_schedule=session.venue_schedule,
                    booking_date=session.booking_date,
                    booking_amount=session.locked_price,
                    status=BookingStatus.CONFIRMED,
                    confirmed_at=now,
                )
            except IntegrityError as exc:
                raise SlotAlreadyBookedError("This slot is already booked.") from exc

            session.status = BookingSessionStatus.COMPLETED
            session.lock_released_at = now
            session.save(
                update_fields=["status", "lock_released_at", "updated_at"],
            )

            BookingAuditLog.objects.create(
                booking_session=session,
                booking=booking,
                payment=payment,
                event=BookingAuditEvent.BOOKING_CONFIRMED,
                description=(
                    f"Booking confirmed for {session.booking_date} "
                    f"on schedule {session.venue_schedule_id}."
                ),
            )

            return booking

    @staticmethod
    def _validate_booking_session(session: BookingSession) -> None:
        if session.status != BookingSessionStatus.ACTIVE:
            raise BookingSessionNotActiveError(
                "Booking session is not active.",
            )
        if session.is_expired:
            raise BookingSessionExpiredError(
                "Booking session has expired.",
            )

    @staticmethod
    def _get_schedule(venue_schedule_id: int) -> VenueSchedule:
        schedule = (
            VenueSchedule.objects.select_related("group__venue")
            .filter(pk=venue_schedule_id)
            .first()
        )
        if schedule is None:
            raise VenueScheduleNotFoundError("Venue schedule not found.")
        return schedule

    @staticmethod
    def _validate_booking_date(booking_date: date) -> None:
        if booking_date < timezone.localdate():
            raise InvalidBookingDateError("Booking date cannot be in the past.")

    @staticmethod
    def _validate_venue(venue: Venue) -> None:
        if not venue.is_active:
            raise VenueNotAvailableError("This venue is not available for booking.")
        if venue.status != VenueStatus.APPROVED:
            raise VenueNotAvailableError("This venue is not available for booking.")

    @staticmethod
    def _validate_schedule(schedule: VenueSchedule, booking_date: date) -> None:
        if is_slot_time_in_past(schedule, booking_date):
            raise ScheduleUnavailableError("This slot's time has already passed.")
        if not is_schedule_available_on_date(schedule, booking_date):
            raise ScheduleUnavailableError(
                "This schedule is not available for the selected date.",
            )

    @staticmethod
    def _ensure_slot_not_booked(schedule: VenueSchedule, booking_date: date) -> None:
        if Booking.objects.filter(
            venue_schedule=schedule,
            booking_date=booking_date,
            status=BookingStatus.CONFIRMED,
        ).exists():
            raise SlotAlreadyBookedError("This slot is already booked.")

    @staticmethod
    def _ensure_slot_not_locked(schedule: VenueSchedule, booking_date: date) -> None:
        if BookingSession.objects.filter(
            venue_schedule=schedule,
            booking_date=booking_date,
            status=BookingSessionStatus.ACTIVE,
            expires_at__gt=timezone.now(),
        ).exists():
            raise SlotLockedError(
                "Someone else is currently booking this slot. "
                "Please try again in a few minutes.",
            )

    @staticmethod
    def _release_session(session: BookingSession) -> None:
        session.status = BookingSessionStatus.FAILED
        session.lock_released_at = timezone.now()
        session.remarks = "Razorpay order creation failed"
        session.save(
            update_fields=["status", "lock_released_at", "remarks", "updated_at"],
        )

    @staticmethod
    def _to_paise(amount: Decimal) -> int:
        paise = (amount * Decimal("100")).quantize(Decimal("1"), rounding=ROUND_HALF_UP)
        return int(paise)
