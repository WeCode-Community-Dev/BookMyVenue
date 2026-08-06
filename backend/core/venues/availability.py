from datetime import date, time
from typing import TypedDict

from django.utils import timezone

from bookings.models import Booking, BookingSession, BookingSessionStatus, BookingStatus
from venues.models import Venue, VenueSchedule, VenueScheduleGroup, VenueScheduleOverride


class AvailableSlot(TypedDict):
    id: int
    name: str | None
    start_time: time
    end_time: time
    price: str


class AvailabilityResult(TypedDict):
    venue_slug: str
    date: str
    day_of_week: int
    schedule_group: dict | None
    slots: list[AvailableSlot]


def _times_overlap(start_a: time, end_a: time, start_b: time, end_b: time) -> bool:
    return start_a < end_b and start_b < end_a


def _is_full_day_block(start: time | None, end: time | None) -> bool:
    return start is None and end is None


def _slot_blocked_by_override(
    schedule: VenueSchedule,
    override: VenueScheduleOverride,
) -> bool:
    if override.is_available:
        return False
    if _is_full_day_block(override.start_time, override.end_time):
        return True
    return _times_overlap(
        schedule.start_time,
        schedule.end_time,
        override.start_time,
        override.end_time,
    )


def _slot_blocked_by_confirmed_booking(
    schedule: VenueSchedule,
    target_date: date,
) -> bool:
    return Booking.objects.filter(
        venue_schedule=schedule,
        booking_date=target_date,
        status=BookingStatus.CONFIRMED,
    ).exists()


def _slot_blocked_by_active_session(
    schedule: VenueSchedule,
    target_date: date,
) -> bool:
    return BookingSession.objects.filter(
        venue_schedule=schedule,
        booking_date=target_date,
        status=BookingSessionStatus.ACTIVE,
        expires_at__gt=timezone.now(),
    ).exists()


def _get_matching_schedule_group(
    venue: Venue,
    day_of_week: int,
) -> VenueScheduleGroup | None:
    return (
        venue.schedule_groups.filter(
            is_active=True,
            days__day_of_week=day_of_week,
        )
        .distinct()
        .first()
    )


def _serialize_slot(schedule: VenueSchedule) -> AvailableSlot:
    return {
        "id": schedule.id,
        "name": schedule.name,
        "start_time": schedule.start_time,
        "end_time": schedule.end_time,
        "price": str(schedule.price),
    }


def is_slot_time_in_past(schedule: VenueSchedule, target_date: date) -> bool:
    today = timezone.localdate()
    if target_date < today:
        return True
    if target_date > today:
        return False
    return schedule.end_time <= timezone.localtime().time()


def is_schedule_available_on_date(
    schedule: VenueSchedule,
    target_date: date,
) -> bool:
    if is_slot_time_in_past(schedule, target_date):
        return False

    group = schedule.group
    day_of_week = target_date.weekday()

    if not schedule.is_available:
        return False
    if not group.is_active:
        return False
    if not group.days.filter(day_of_week=day_of_week).exists():
        return False

    overrides = group.venue.schedule_overrides.filter(
        override_date=target_date,
        is_available=False,
    )
    return not any(
        _slot_blocked_by_override(schedule, override) for override in overrides
    )


def get_available_slots(venue: Venue, target_date: date) -> AvailabilityResult:
    day_of_week = target_date.weekday()
    schedule_group = _get_matching_schedule_group(venue, day_of_week)

    if schedule_group is None:
        return {
            "venue_slug": venue.slug,
            "date": target_date.isoformat(),
            "day_of_week": day_of_week,
            "schedule_group": None,
            "slots": [],
        }

    base_slots = list(
        schedule_group.schedules.filter(is_available=True).order_by("start_time"),
    )

    overrides = list(
        venue.schedule_overrides.filter(
            override_date=target_date,
            is_available=False,
        ),
    )

    available_slots = []
    for slot in base_slots:
        if is_slot_time_in_past(slot, target_date):
            continue
        if any(_slot_blocked_by_override(slot, override) for override in overrides):
            continue
        if _slot_blocked_by_confirmed_booking(slot, target_date):
            continue
        if _slot_blocked_by_active_session(slot, target_date):
            continue
        available_slots.append(_serialize_slot(slot))

    return {
        "venue_slug": venue.slug,
        "date": target_date.isoformat(),
        "day_of_week": day_of_week,
        "schedule_group": {
            "id": schedule_group.id,
            "name": schedule_group.name,
        },
        "slots": available_slots,
    }
