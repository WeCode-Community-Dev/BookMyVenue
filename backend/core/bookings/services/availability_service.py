from dataclasses import dataclass
from datetime import date, datetime
from enum import Enum

from django.utils import timezone

from bookings.exceptions import (
    InvalidBookingDateError,
    ScheduleUnavailableError,
    VenueNotAvailableError,
    VenueScheduleNotFoundError,
)
from bookings.models import (
    Booking,
    BookingSession,
    BookingSessionStatus,
    BookingStatus,
)
from venues.availability import is_schedule_available_on_date, is_slot_time_in_past
from venues.models import Venue, VenueSchedule, VenueStatus


class SlotAvailabilityStatus(str, Enum):
    AVAILABLE = "AVAILABLE"
    BOOKING_IN_PROGRESS = "BOOKING_IN_PROGRESS"
    BOOKED = "BOOKED"


@dataclass(frozen=True)
class SlotAvailabilityResult:
    status: SlotAvailabilityStatus
    message: str
    booking_session_expires_at: datetime | None = None


class AvailabilityService:
    @staticmethod
    def get_slot_availability_for_venue(
        *,
        venue: Venue,
        venue_schedule_id: int,
        booking_date: date,
    ) -> SlotAvailabilityResult:
        schedule = AvailabilityService._get_schedule(venue_schedule_id)
        if schedule.group.venue_id != venue.id:
            raise VenueScheduleNotFoundError("Venue schedule not found.")

        return AvailabilityService.get_slot_availability(
            venue_schedule_id=venue_schedule_id,
            booking_date=booking_date,
        )

    @staticmethod
    def get_slot_availability(
        *,
        venue_schedule_id: int,
        booking_date: date,
    ) -> SlotAvailabilityResult:
        schedule = AvailabilityService._get_schedule(venue_schedule_id)
        venue = schedule.group.venue

        AvailabilityService._validate_booking_date(booking_date)
        AvailabilityService._validate_venue(venue)
        AvailabilityService._validate_schedule(schedule, booking_date)

        if AvailabilityService._has_confirmed_booking(schedule, booking_date):
            return SlotAvailabilityResult(
                status=SlotAvailabilityStatus.BOOKED,
                message="This slot has already been booked.",
            )

        active_session = AvailabilityService._get_active_session(schedule, booking_date)
        if active_session is not None:
            return SlotAvailabilityResult(
                status=SlotAvailabilityStatus.BOOKING_IN_PROGRESS,
                message="Someone is currently booking this slot.",
                booking_session_expires_at=active_session.expires_at,
            )

        return SlotAvailabilityResult(
            status=SlotAvailabilityStatus.AVAILABLE,
            message="Available",
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
            raise VenueNotAvailableError("This venue is not active.")
        if venue.status != VenueStatus.APPROVED:
            raise VenueNotAvailableError("This venue is not approved for booking.")

    @staticmethod
    def _validate_schedule(schedule: VenueSchedule, booking_date: date) -> None:
        if is_slot_time_in_past(schedule, booking_date):
            raise ScheduleUnavailableError("This slot's time has already passed.")
        if not is_schedule_available_on_date(schedule, booking_date):
            raise ScheduleUnavailableError(
                "This schedule is not available for the selected date.",
            )

    @staticmethod
    def _has_confirmed_booking(schedule: VenueSchedule, booking_date: date) -> bool:
        return Booking.objects.filter(
            venue_schedule=schedule,
            booking_date=booking_date,
            status=BookingStatus.CONFIRMED,
        ).exists()

    @staticmethod
    def _get_active_session(
        schedule: VenueSchedule,
        booking_date: date,
    ) -> BookingSession | None:
        return (
            BookingSession.objects.filter(
                venue_schedule=schedule,
                booking_date=booking_date,
                status=BookingSessionStatus.ACTIVE,
                expires_at__gt=timezone.now(),
            )
            .only("expires_at")
            .first()
        )
