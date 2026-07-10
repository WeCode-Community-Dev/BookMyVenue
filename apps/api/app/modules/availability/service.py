from datetime import UTC, date, datetime, time, timedelta
from uuid import UUID
from zoneinfo import ZoneInfo

from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.modules.availability.schemas import (
    AvailabilityResponse,
    BlockedRange,
    CalendarBlockedRange,
    CalendarBookingSummary,
    CalendarDay,
    CalendarResponse,
    OperatingWindow,
    ValidationResponse,
)
from app.modules.booking.models import Booking, BookingSlot
from app.modules.profile.models import Profile  # noqa: F401
from app.modules.venue.models import VenueAvailability, VenueBlockedDate
from app.modules.venue.service import (
    _assert_owner,
    _get_active_venue_or_404,
    _get_venue_or_404,
    get_pricing_quote_for_slot,
)


def _to_utc(value: datetime) -> datetime:
    if value.tzinfo is None:
        return value.replace(tzinfo=UTC)

    return value.astimezone(UTC)


def _localize(booking_date: date, value: time, tz: ZoneInfo) -> datetime:
    return datetime.combine(booking_date, value).replace(tzinfo=tz)


def _minute_of_day(value: datetime) -> int:
    return (value.hour * 60) + value.minute


def _local_day_bounds(venue, booking_date: date) -> tuple[datetime, datetime]:
    tz = ZoneInfo(venue.timezone)
    starts_at = datetime.combine(booking_date, datetime.min.time()).replace(tzinfo=tz)
    ends_at = starts_at + timedelta(days=1)

    return starts_at.astimezone(UTC), ends_at.astimezone(UTC)


def _date_range(start_date: date, end_date: date) -> list[date]:
    days = (end_date - start_date).days
    return [start_date + timedelta(days=offset) for offset in range(days + 1)]


def _has_overlap(
    starts_at: datetime,
    ends_at: datetime,
    range_starts_at: datetime,
    range_ends_at: datetime,
) -> bool:
    return _to_utc(starts_at) < _to_utc(range_ends_at) and _to_utc(ends_at) > _to_utc(range_starts_at)


def _covers_range(
    ranges: list[tuple[datetime, datetime]],
    starts_at: datetime,
    ends_at: datetime,
) -> bool:
    if not ranges:
        return False

    starts_at = _to_utc(starts_at)
    ends_at = _to_utc(ends_at)
    clipped = sorted(
        (
            (max(_to_utc(range_start), starts_at), min(_to_utc(range_end), ends_at))
            for range_start, range_end in ranges
            if _has_overlap(range_start, range_end, starts_at, ends_at)
        ),
        key=lambda item: item[0],
    )

    covered_until = starts_at
    for range_start, range_end in clipped:
        if range_start > covered_until:
            return False
        if range_end > covered_until:
            covered_until = range_end
        if covered_until >= ends_at:
            return True

    return False


def compute_effective_range(
    starts_at: datetime,
    ends_at: datetime,
    pre_buffer_minutes: int,
    post_buffer_minutes: int,
) -> tuple[datetime, datetime]:
    return (
        starts_at - timedelta(minutes=pre_buffer_minutes),
        ends_at + timedelta(minutes=post_buffer_minutes),
    )


def resolve_operating_window(
    venue,
    booking_date: date,
    db_override: VenueAvailability | None = None,
) -> OperatingWindow:
    if isinstance(booking_date, datetime):
        booking_date = booking_date.date()

    day = booking_date.weekday()

    availability = db_override
    if availability is None:
        availability = next(
            (
                a
                for a in getattr(venue, "availability", [])
                if a.day_of_week == day and a.deleted_at is None
            ),
            None,
        )

    if availability is not None:
        if not availability.is_available:
            return OperatingWindow(is_available=False)

        return OperatingWindow(
            is_available=True,
            opens_at=availability.opens_at,
            closes_at=availability.closes_at,
            spans_next_day=availability.spans_next_day,
        )

    return OperatingWindow(
        is_available=True,
        opens_at=venue.open_time,
        closes_at=venue.close_time,
        spans_next_day=venue.spans_next_day,
    )


def is_date_blocked(
    venue,
    starts_at: datetime,
    ends_at: datetime,
) -> bool:
    starts_at = _to_utc(starts_at)
    ends_at = _to_utc(ends_at)

    for blocked in getattr(venue, "blocked_dates", []):

        if blocked.deleted_at:
            continue

        overlap = starts_at < _to_utc(blocked.ends_at) and ends_at > _to_utc(
            blocked.starts_at,
        )

        if overlap:
            return True

    return False


def is_slot_blocked(
    db: Session,
    venue_id,
    effective_starts_at: datetime,
    effective_ends_at: datetime,
) -> bool:
    return (
        db.query(BookingSlot)
        .filter(
            BookingSlot.venue_id == venue_id,
            BookingSlot.is_blocking.is_(True),
            BookingSlot.deleted_at.is_(None),
            BookingSlot.effective_starts_at < effective_ends_at,
            BookingSlot.effective_ends_at > effective_starts_at,
        )
        .first()
        is not None
    )


def expand_full_day_slot(
    venue,
    booking_date: date,
    db_override: VenueAvailability | None = None,
) -> tuple[datetime, datetime]:
    operating_window = resolve_operating_window(
        venue=venue,
        booking_date=booking_date,
        db_override=db_override,
    )

    if not operating_window.is_available:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Venue closed on selected date",
        )

    tz = ZoneInfo(venue.timezone)

    starts_at = _localize(
        booking_date,
        operating_window.opens_at,
        tz,
    )

    ends_at = _localize(
        booking_date,
        operating_window.closes_at,
        tz,
    )

    if operating_window.spans_next_day:
        ends_at += timedelta(days=1)

    return (
        starts_at.astimezone(UTC),
        ends_at.astimezone(UTC),
    )


def validate_booking_request(
    db: Session,
    venue,
    starts_at: datetime | None,
    ends_at: datetime | None,
    booking_type: str,
    booking_date: date | None = None,
    guest_count: int | None = None,
) -> ValidationResponse:
    venue_tz = ZoneInfo(venue.timezone)

    if booking_type not in venue.allowed_booking_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Booking type not allowed",
        )

    if booking_type == "full_day":
        if starts_at is None or ends_at is None:
            # Original single-day full_day logic
            if booking_date is None:
                if starts_at is None:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="booking_date is required for single-day full day bookings",
                    )
                booking_date = _to_utc(starts_at).astimezone(venue_tz).date()

            starts_at, ends_at = expand_full_day_slot(
                venue=venue,
                booking_date=booking_date,
            )
        else:
            # Multi-day full_day support
            starts_at = _to_utc(starts_at)
            ends_at = _to_utc(ends_at)
    elif starts_at is None or ends_at is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="starts_at and ends_at are required for time slot bookings",
        )
    else:
        starts_at = _to_utc(starts_at)
        ends_at = _to_utc(ends_at)

    if ends_at <= starts_at:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="End time must be after start time",
        )

    if starts_at <= datetime.now(UTC):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Booking must be in the future",
        )

    if guest_count is not None and guest_count > venue.max_capacity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Guest count exceeds venue capacity",
        )

    duration_minutes = int((ends_at - starts_at).total_seconds() / 60)

    if duration_minutes < venue.min_booking_duration_minutes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Booking duration too short",
        )

    # Duration limit - relaxed for full_day multi-day
    if booking_type == "full_day":
        max_multi_day_minutes = (
            getattr(venue, "max_multi_day_duration_days", 7) * 24 * 60
        )
        if duration_minutes > max_multi_day_minutes:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Multi-day booking cannot exceed {getattr(venue, 'max_multi_day_duration_days', 7)} days",
            )
    elif duration_minutes > venue.max_booking_duration_minutes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Booking duration exceeds limit",
        )

    local_starts_at = starts_at.astimezone(venue_tz)
    local_ends_at = ends_at.astimezone(venue_tz)

    # Original time_slot interval validation
    if booking_type == "time_slot" and (
        _minute_of_day(local_starts_at) % venue.slot_interval_minutes != 0
        or _minute_of_day(local_ends_at) % venue.slot_interval_minutes != 0
        or duration_minutes % venue.slot_interval_minutes != 0
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Booking times must align with slot interval",
        )


    # === Multi-day Operating Window Validation ===
    current_date = local_starts_at.date()
    end_date = local_ends_at.date()

    while current_date <= end_date:
        operating_window = resolve_operating_window(venue, current_date)

        if not operating_window.is_available:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Venue unavailable on {current_date}",
            )

        window_starts_at = _localize(current_date, operating_window.opens_at, venue_tz)
        window_ends_at = _localize(current_date, operating_window.closes_at, venue_tz)

        if operating_window.spans_next_day:
            window_ends_at += timedelta(days=1)

        if current_date == local_starts_at.date():
            if local_starts_at < window_starts_at:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Booking start must be within operating window",
                )
        elif current_date == local_ends_at.date():
            # Relaxed: Accept whatever end time the frontend sends on the last day
            # (No strict check on end time for last day)
            pass
        # Middle days: only require availability

        current_date += timedelta(days=1)

    # Original effective range + conflict checks
    effective_starts_at, effective_ends_at = compute_effective_range(
        starts_at,
        ends_at,
        venue.pre_buffer_minutes,
        venue.post_buffer_minutes,
    )

    if is_date_blocked(venue, starts_at, ends_at):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Venue blocked for selected period",
        )

    conflict_exists = is_slot_blocked(
        db=db,
        venue_id=venue.id,
        effective_starts_at=starts_at,
        effective_ends_at=ends_at,
    )

    if conflict_exists:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Selected slot unavailable",
        )

    return ValidationResponse(
        valid=True,
        effective_starts_at=effective_starts_at,
        effective_ends_at=effective_ends_at,
    )


def get_availability_for_date(
    db: Session,
    venue_id,
    booking_date: date,
    booking_type: str = "time_slot",
) -> AvailabilityResponse:
    venue = _get_active_venue_or_404(db, venue_id)

    operating_window = resolve_operating_window(venue, booking_date)

    if not operating_window.is_available:
        return AvailabilityResponse(
            date=booking_date,
            operating_window=operating_window,
            blocked_slots=[],
        )

    window_start, window_end = expand_full_day_slot(venue, booking_date)

    # Get blocking slots for the day
    blocked_slots_db = (
        db.query(BookingSlot)
        .filter(
            BookingSlot.venue_id == venue.id,
            BookingSlot.is_blocking.is_(True),
            BookingSlot.deleted_at.is_(None),
            BookingSlot.effective_starts_at < window_end,
            BookingSlot.effective_ends_at > window_start,
        )
        .all()
    )

    if booking_type == "full_day":
        # Full day is blocked if there's ANY existing booking
        if blocked_slots_db:
            return AvailabilityResponse(
                date=booking_date,
                operating_window=operating_window,
                blocked_slots=[
                    BlockedRange(starts_at=window_start, ends_at=window_end)
                ],
            )
        else:
            return AvailabilityResponse(
                date=booking_date,
                operating_window=operating_window,
                blocked_slots=[],
            )

    # TIME SLOT: Allow multiple slots per day (partial availability)
    return AvailabilityResponse(
        date=booking_date,
        operating_window=operating_window,
        blocked_slots=[
            BlockedRange(starts_at=slot.effective_starts_at, ends_at=slot.effective_ends_at)
            for slot in blocked_slots_db
        ],
    )


def _build_calendar_for_venue(
    db: Session,
    venue,
    start_date: date,
    end_date: date,
    booking_type: str = "time_slot",
    include_owner_details: bool = False,
) -> CalendarResponse:
    if end_date < start_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="end_date must be on or after start_date",
        )

    if (end_date - start_date).days > 370:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Calendar range cannot exceed 370 days",
        )

    # Load data for the entire range
    range_start, _ = _local_day_bounds(venue, start_date)
    _, range_end = _local_day_bounds(venue, end_date)
    range_start -= timedelta(minutes=venue.pre_buffer_minutes)
    range_end += timedelta(days=1, minutes=venue.post_buffer_minutes)

    blocking_slots = (
        db.query(BookingSlot)
        .filter(
            BookingSlot.venue_id == venue.id,
            BookingSlot.is_blocking.is_(True),
            BookingSlot.deleted_at.is_(None),
            BookingSlot.effective_starts_at < range_end,
            BookingSlot.effective_ends_at > range_start,
        )
        .all()
    )

    owner_bookings = []
    if include_owner_details:
        owner_bookings = (
            db.query(Booking)
            .options(joinedload(Booking.slot))
            .join(BookingSlot, BookingSlot.booking_id == Booking.id)
            .filter(
                Booking.venue_id == venue.id,
                Booking.deleted_at.is_(None),
                BookingSlot.deleted_at.is_(None),
                BookingSlot.effective_starts_at < range_end,
                BookingSlot.effective_ends_at > range_start,
            )
            .order_by(BookingSlot.starts_at.asc())
            .all()
        )

    venue_blocks = (
        db.query(VenueBlockedDate)
        .filter(
            VenueBlockedDate.venue_id == venue.id,
            VenueBlockedDate.deleted_at.is_(None),
            VenueBlockedDate.starts_at < range_end,
            VenueBlockedDate.ends_at > range_start,
        )
        .all()
    )

    now = datetime.now(UTC)
    days: list[CalendarDay] = []

    for calendar_date in _date_range(start_date, end_date):
        operating_window = resolve_operating_window(venue, calendar_date)

        if operating_window.is_available:
            window_start, window_end = expand_full_day_slot(venue, calendar_date)
        else:
            window_start, window_end = _local_day_bounds(venue, calendar_date)

        effective_window_start, effective_window_end = compute_effective_range(
            window_start,
            window_end,
            venue.pre_buffer_minutes,
            venue.post_buffer_minutes,
        )

        # Day-specific blocks
        day_venue_blocks = [
            block
            for block in venue_blocks
            if _has_overlap(
                block.starts_at,
                block.ends_at,
                effective_window_start,
                effective_window_end,
            )
        ]

        day_blocking_slots = [
            slot
            for slot in blocking_slots
            if _has_overlap(
                slot.effective_starts_at,
                slot.effective_ends_at,
                effective_window_start,
                effective_window_end,
            )
        ]

        blocked_ranges = [
            CalendarBlockedRange(
                starts_at=block.starts_at,
                ends_at=block.ends_at,
                source="venue_block",
                reason=block.reason,
            )
            for block in day_venue_blocks
        ]
        blocked_ranges.extend(
            CalendarBlockedRange(
                starts_at=slot.starts_at,
                ends_at=slot.ends_at,
                source="booking",
            )
            for slot in day_blocking_slots
        )
        blocked_ranges.sort(key=lambda item: item.starts_at)

        # Owner bookings for this day
        day_bookings = []
        if include_owner_details:
            day_bookings = [
                CalendarBookingSummary(
                    id=booking.id,
                    booking_type=booking.booking_type.value,
                    status=booking.status.value,
                    starts_at=booking.slot.starts_at,
                    ends_at=booking.slot.ends_at,
                    effective_starts_at=booking.slot.effective_starts_at,
                    effective_ends_at=booking.slot.effective_ends_at,
                    is_blocking=booking.slot.is_blocking,
                    guest_count=booking.guest_count,
                    event_type=booking.event_type,
                    user_id=booking.user_id,
                )
                for booking in owner_bookings
                if booking.slot
                and _has_overlap(
                    booking.slot.effective_starts_at,
                    booking.slot.effective_ends_at,
                    effective_window_start,
                    effective_window_end,
                )
            ]

        has_conflict = bool(day_venue_blocks or day_blocking_slots)
        is_future_window = window_end > now
        supports_full_day = "full_day" in venue.allowed_booking_types

        # Simplified status logic
        if not operating_window.is_available:
            day_status = "closed"
        elif _covers_range(
            [(b.starts_at, b.ends_at) for b in day_venue_blocks],
            window_start,
            window_end,
        ):
            day_status = "blocked"
        elif has_conflict and booking_type == "full_day":
            day_status = "fully_booked"
        elif has_conflict:
            day_status = "partially_booked"
        else:
            day_status = "available"

        # Bookable logic
        is_bookable = False
        if is_future_window and operating_window.is_available:
            if booking_type == "full_day":
                is_bookable = not has_conflict and supports_full_day
            else:  # time_slot
                is_bookable = not _covers_range(
                    [(s.starts_at, s.ends_at) for s in day_blocking_slots],
                    window_start,
                    window_end,
                )

        days.append(
            CalendarDay(
                date=calendar_date,
                operating_window=operating_window,
                status=day_status,
                is_bookable=is_bookable,
                available_for_full_day=is_bookable and booking_type == "full_day",
                blocked_ranges=blocked_ranges,
                bookings=day_bookings,
            )
        )

    return CalendarResponse(
        venue_id=venue.id,
        timezone=venue.timezone,
        start_date=start_date,
        end_date=end_date,
        days=days,
    )


def get_calendar(
    db: Session,
    venue_id: UUID,
    start_date: date,
    end_date: date,
    booking_type: str = "time_slot",
) -> CalendarResponse:
    venue = _get_active_venue_or_404(
        db,
        venue_id,
    )

    return _build_calendar_for_venue(
        db=db,
        venue=venue,
        start_date=start_date,
        end_date=end_date,
        booking_type=booking_type,
    )


def get_owner_calendar(
    db: Session,
    venue_id: UUID,
    owner_id: UUID,
    start_date: date,
    end_date: date,
    allow_admin: bool = False,
) -> CalendarResponse:
    venue = _get_venue_or_404(
        db,
        venue_id,
    )
    if not allow_admin:
        _assert_owner(venue, owner_id)

    return _build_calendar_for_venue(
        db=db,
        venue=venue,
        start_date=start_date,
        end_date=end_date,
        include_owner_details=True,
    )


def validate_slot(
    db: Session,
    venue_id,
    booking_type,
    starts_at,
    ends_at,
    booking_date: date | None = None,
    guest_count: int | None = None,
):
    venue = _get_active_venue_or_404(
        db,
        venue_id,
    )

    return validate_booking_request(
        db=db,
        venue=venue,
        starts_at=starts_at,
        ends_at=ends_at,
        booking_type=booking_type,
        booking_date=booking_date,
        guest_count=guest_count,
    )


def get_pricing_quote(
    db: Session,
    venue_id: UUID,
    starts_at: datetime,
    ends_at: datetime,
    booking_type: str,
):
    _get_active_venue_or_404(db, venue_id)
    return get_pricing_quote_for_slot(
        db=db,
        venue_id=venue_id,
        starts_at=_to_utc(starts_at),
        ends_at=_to_utc(ends_at),
        booking_type=booking_type,
    )
