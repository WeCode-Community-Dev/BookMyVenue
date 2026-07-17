import logging
import uuid
from datetime import date, timedelta
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import and_, func, or_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload

from app.modules.admin import settings_store
from app.modules.availability.service import validate_booking_request

# Re-expose functions from cancellation module
from app.modules.booking.cancellation import (
    get_cancellation_preview as get_cancellation_preview,
)
from app.modules.booking.cancellation import (
    owner_cancel_forfeit as owner_cancel_forfeit,
)
from app.modules.booking.cancellation import (
    owner_cancel_goodwill as owner_cancel_goodwill,
)
from app.modules.booking.cancellation import (
    user_cancel_booking as user_cancel_booking,
)
from app.modules.booking.helpers import (
    _assert_booking_owner,
    _booking_or_404,
    _booking_out,
    _history,
    _now,
    _slot_for_update,
)
from app.modules.booking.models import (
    Booking,
    BookingSlot,
    BookingStatus,
    BookingType,
    PaymentStatus,
)
from app.modules.booking.schemas import (
    BookingListResponse,
    BookingOut,
    BookingRequestIn,
    ExtendDeadlineIn,
)
from app.modules.notification import service as notifications
from app.modules.notification.types import NotificationType
from app.modules.profile.models import Profile
from app.modules.venue.models import Venue
from app.modules.venue.service import _get_active_venue_or_404, get_pricing_quote_for_slot

logger = logging.getLogger(__name__)


def create_booking_request(
    db: Session,
    user_id: UUID,
    payload: BookingRequestIn,
) -> BookingOut:
    # Acquire exclusive write lock on Venue to serialize slot check and creation
    venue = _get_active_venue_or_404(
        db,
        payload.venue_id,
        for_update=True,
    )

    validation = validate_booking_request(
        db=db,
        venue=venue,
        starts_at=payload.starts_at,
        ends_at=payload.ends_at,
        booking_type=payload.booking_type,
        booking_date=payload.booking_date,
        guest_count=payload.guest_count,
    )
    starts_at = validation.starts_at
    ends_at = validation.ends_at

    quote = get_pricing_quote_for_slot(
        db=db,
        venue_id=venue.id,
        starts_at=starts_at,
        ends_at=ends_at,
        booking_type=payload.booking_type,
    )

    if (
        payload.expected_total_paise is not None
        and payload.expected_total_paise != quote.quoted_price_paise
    ):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "error": "PRICE_CHANGED",
                "message": "Pricing has changed since you last viewed this booking.",
                "quoted_price_paise": quote.quoted_price_paise,
                "breakdown": [item.model_dump(mode="json") for item in quote.breakdown],
            },
        )

    is_instant = venue.booking_mode == "INSTANT"
    initial_status = BookingStatus.payment_pending if is_instant else BookingStatus.requested
    payment_expires_at = (
        _now()
        + timedelta(
            minutes=settings_store.get_setting(db, "instant_booking_payment_timeout_minutes")
        )
        if is_instant
        else None
    )

    booking = Booking(
        id=uuid.uuid4(),
        venue_id=venue.id,
        user_id=user_id,
        booking_type=BookingType(payload.booking_type),
        event_type=payload.event_type,
        guest_count=payload.guest_count,
        user_notes=payload.user_notes,
        status=initial_status,
        payment_expires_at=payment_expires_at,
        balance_due_date=starts_at.date() - timedelta(days=venue.balance_due_days_before_event),
        pricing_mode=quote.pricing_mode,
        quoted_price_paise=quote.quoted_price_paise,
        pricing_breakdown=[item.model_dump(mode="json") for item in quote.breakdown] or None,
        platform_commission_pct=quote.platform_commission_pct,
        platform_fee_paise=quote.platform_fee_paise,
        owner_payout_paise=quote.owner_payout_paise,
        advance_pct=quote.advance_pct,
        advance_due_paise=quote.advance_due_paise,
        balance_due_paise=quote.balance_due_paise,
        overdue_advance_refund_pct=venue.overdue_advance_refund_pct,
        payment_status=PaymentStatus.unpaid,
    )
    db.add(booking)
    db.flush()

    slot = BookingSlot(
        id=uuid.uuid4(),
        booking_id=booking.id,
        venue_id=venue.id,
        starts_at=starts_at,
        ends_at=ends_at,
        effective_starts_at=validation.effective_starts_at,
        effective_ends_at=validation.effective_ends_at,
        is_blocking=is_instant,
    )
    db.add(slot)
    db.add(_history(booking, None, initial_status, changed_by=user_id))
    db.flush()

    if is_instant:
        from app.modules.payment.service import create_payment_intent

        try:
            create_payment_intent(db, user_id, booking.id, payment_type="advance")
        except Exception as e:
            logger.exception(
                "Failed to create initial payment intent for instant booking %s", booking.id
            )
            db.rollback()
            if isinstance(e, HTTPException):
                raise e
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to initialize payment for instant booking",
            ) from e
    else:
        notifications.notify(
            db,
            venue.owner_id,
            NotificationType.NEW_REQUEST_OWNER,
            context={"venue_name": venue.name},
            booking_id=booking.id,
        )
        notifications.notify(
            db,
            user_id,
            NotificationType.REQUEST_RECEIVED,
            context={"venue_name": venue.name},
            booking_id=booking.id,
        )

    db.refresh(booking)
    return _booking_out(db, booking)


def get_booking(db: Session, booking_id: UUID, user_id: UUID | None = None) -> BookingOut:
    booking = _booking_or_404(db, booking_id)
    if user_id is not None and booking.user_id != user_id and booking.venue.owner_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Booking access denied")

    return _booking_out(db, booking)


def list_user_bookings(
    db: Session, user_id: UUID, page: int = 1, per_page: int = 100
) -> BookingListResponse:
    query = (
        db.query(Booking)
        .options(
            joinedload(Booking.slot),
            joinedload(Booking.venue),
        )
        .filter(Booking.user_id == user_id, Booking.deleted_at.is_(None))
    )
    total = query.count()
    total_pages = (total + per_page - 1) // per_page
    bookings = (
        query.order_by(Booking.created_at.desc())
        .offset((page - 1) * per_page)
        .limit(per_page)
        .all()
    )
    return BookingListResponse(
        items=[_booking_out(db, booking) for booking in bookings],
        total=total,
        page=page,
        page_size=per_page,
        total_pages=total_pages,
    )


def list_all_owner_bookings(
    db: Session,
    owner_id: UUID,
    tab: str | None = None,
    venue_id: str | None = None,
    search: str | None = None,
    page: int = 1,
    per_page: int = 20,
) -> BookingListResponse:
    query = (
        db.query(Booking)
        .options(
            joinedload(Booking.slot),
            joinedload(Booking.user),
            joinedload(Booking.venue).selectinload(Venue.photos),
        )
        .join(Venue, Booking.venue_id == Venue.id)
        .join(Profile, Booking.user_id == Profile.id)
        .filter(Venue.owner_id == owner_id, Booking.deleted_at.is_(None))
    )

    if venue_id and venue_id != "all":
        query = query.filter(Booking.venue_id == venue_id)

    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(Venue.name.ilike(search_term), Profile.full_name.ilike(search_term))
        )

    if tab and tab != "all":
        if tab == "requested":
            query = query.filter(Booking.status == BookingStatus.requested)
        elif tab == "owner_accepted":
            query = query.filter(Booking.status == BookingStatus.owner_accepted)
        elif tab == "confirmed":
            query = query.filter(Booking.status == BookingStatus.confirmed)
        elif tab == "completed":
            query = query.filter(Booking.status == BookingStatus.completed)
        elif tab == "cancelled":
            query = query.filter(
                Booking.status.in_(
                    [
                        BookingStatus.conflict_cancelled,
                        BookingStatus.user_cancelled,
                        BookingStatus.admin_cancelled,
                        BookingStatus.owner_rejected,
                        BookingStatus.balance_overdue_cancelled,
                        BookingStatus.hold_expired,
                        BookingStatus.request_expired,
                    ]
                )
            )
        elif tab == "overdue":
            query = query.filter(
                or_(
                    and_(
                        Booking.status == BookingStatus.confirmed,
                        Booking.balance_overdue_at is not None,
                        Booking.balance_overdue_at < func.now(),
                    ),
                    and_(
                        Booking.status == BookingStatus.owner_accepted,
                        Booking.hold_expires_at is not None,
                        Booking.hold_expires_at < func.now(),
                    ),
                )
            )

    total = query.count()
    total_pages = (total + per_page - 1) // per_page
    bookings = (
        query.order_by(Booking.created_at.desc())
        .offset((page - 1) * per_page)
        .limit(per_page)
        .all()
    )

    return BookingListResponse(
        items=[_booking_out(db, booking) for booking in bookings],
        total=total,
        page=page,
        page_size=per_page,
        total_pages=total_pages,
    )


def list_venue_bookings(
    db: Session,
    venue_id: UUID,
    owner_id: UUID,
    pending_only: bool = False,
) -> list[BookingOut]:
    from app.modules.venue.service import _get_active_venue_or_404

    venue = _get_active_venue_or_404(db, venue_id)
    if venue.owner_id != owner_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Venue owner access denied"
        )

    query = (
        db.query(Booking)
        .options(
            joinedload(Booking.slot),
            joinedload(Booking.user),
            joinedload(Booking.venue).selectinload(Venue.photos),
        )
        .filter(
            Booking.venue_id == venue_id,
            Booking.deleted_at.is_(None),
        )
    )
    if pending_only:
        query = query.filter(Booking.status == BookingStatus.requested)

    return [
        _booking_out(db, booking) for booking in query.order_by(Booking.requested_at.asc()).all()
    ]


def owner_accept_booking(db: Session, booking_id: UUID, owner_id: UUID) -> BookingOut:
    booking = _booking_or_404(db, booking_id, for_update=True)
    _assert_booking_owner(booking, owner_id)

    # Idempotency: If already accepted, return current state
    if booking.status == BookingStatus.owner_accepted:
        db.refresh(booking)
        return _booking_out(db, booking)

    if booking.status != BookingStatus.requested:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Booking is not pending")

    slot = _slot_for_update(db, booking.id)
    old_status = booking.status
    slot.is_blocking = True
    booking.status = BookingStatus.owner_accepted
    booking.owner_responded_at = _now()
    hold_hours = settings_store.get_setting(db, "token_payment_hold_hours")
    booking.hold_expires_at = booking.owner_responded_at + timedelta(hours=hold_hours)

    try:
        db.flush()
    except IntegrityError as exc:
        db.rollback()
        if "booking_slots_no_overlap" in str(exc.orig):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT, detail="Slot already blocked"
            ) from exc
        raise

    # The real advance PaymentIntent (and stripe_advance_payment_intent_id) is created
    # by payment.service.create_payment_intent when the customer pays the advance.
    db.add(_history(booking, old_status, BookingStatus.owner_accepted, changed_by=owner_id))
    db.flush()
    db.refresh(booking)

    notifications.notify(
        db,
        booking.user_id,
        NotificationType.REQUEST_ACCEPTED,
        context={"venue_name": booking.venue.name},
        booking_id=booking.id,
    )
    return _booking_out(db, booking)


def owner_reject_booking(
    db: Session,
    booking_id: UUID,
    owner_id: UUID,
    reason: str,
) -> BookingOut:
    booking = _booking_or_404(db, booking_id, for_update=True)
    _assert_booking_owner(booking, owner_id)
    if booking.status != BookingStatus.requested:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Booking is not pending")

    old_status = booking.status
    booking.status = BookingStatus.owner_rejected
    booking.owner_responded_at = _now()
    db.add(
        _history(
            booking, old_status, BookingStatus.owner_rejected, changed_by=owner_id, reason=reason
        )
    )
    db.flush()
    db.refresh(booking)

    notifications.notify(
        db,
        booking.user_id,
        NotificationType.BOOKING_REJECTED,
        context={"venue_name": booking.venue.name},
        booking_id=booking.id,
    )
    return _booking_out(db, booking)


def owner_extend_deadline(
    db: Session,
    booking_id: UUID,
    owner_id: UUID,
    body: ExtendDeadlineIn,
) -> BookingOut:
    booking = _booking_or_404(db, booking_id, for_update=True)
    _assert_booking_owner(booking, owner_id)
    if (
        booking.status != BookingStatus.confirmed
        or booking.payment_status != PaymentStatus.advance_paid
        or booking.balance_overdue_at is None
    ):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Booking is not balance overdue"
        )
    max_extensions = settings_store.get_setting(db, "max_deadline_extensions")
    if booking.deadline_extension_count >= max_extensions:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Deadline extension limit reached",
        )

    # Ensure event has not already started
    if booking.slot.starts_at <= _now():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot extend deadline for a past or ongoing event",
        )

    # Ensure new due date is in the future and before the event date
    if body.new_due_date <= date.today():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="New due date must be in the future"
        )
    if body.new_due_date >= booking.slot.starts_at.date():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New due date must be before the event date",
        )

    booking.balance_due_date = body.new_due_date
    booking.deadline_extension_count += 1
    booking.balance_overdue_at = None
    booking.owner_action_deadline = None
    # No status change — skip history insert (DB constraint disallows same-status transitions)

    db.flush()
    db.refresh(booking)
    notifications.notify(
        db,
        booking.user_id,
        NotificationType.BALANCE_DEADLINE_EXTENDED,
        context={"venue_name": booking.venue.name},
        booking_id=booking.id,
    )
    return _booking_out(db, booking)


def update_owner_notes(
    db: Session, booking_id: UUID, owner_id: UUID, notes: str | None
) -> BookingOut:
    booking = _booking_or_404(db, booking_id, for_update=True)
    _assert_booking_owner(booking, owner_id)
    booking.owner_notes = notes
    db.flush()
    db.refresh(booking)
    return _booking_out(db, booking)


def create_booking(user_id: UUID, body: BookingRequestIn, db: Session) -> BookingOut:
    return create_booking_request(db, user_id, body)
