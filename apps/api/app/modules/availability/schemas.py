from datetime import date, datetime, time
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, Field


class OperatingWindow(BaseModel):
    is_available: bool
    opens_at: time | None = None
    closes_at: time | None = None
    spans_next_day: bool = False


class BlockedRange(BaseModel):
    starts_at: datetime
    ends_at: datetime


class AvailabilityResponse(BaseModel):
    date: date
    operating_window: OperatingWindow
    blocked_slots: list[BlockedRange] = Field(default_factory=list)


class ValidationResponse(BaseModel):
    valid: bool
    starts_at: datetime
    ends_at: datetime
    effective_starts_at: datetime
    effective_ends_at: datetime


CalendarDayStatus = Literal[
    "available",
    "partially_booked",
    "fully_booked",
    "blocked",
    "closed",
]


class CalendarBlockedRange(BaseModel):
    starts_at: datetime
    ends_at: datetime
    source: Literal["booking", "venue_block"]
    reason: str | None = None


class CalendarBookingSummary(BaseModel):
    id: UUID
    booking_type: str
    status: str
    starts_at: datetime
    ends_at: datetime
    effective_starts_at: datetime
    effective_ends_at: datetime
    is_blocking: bool
    guest_count: int
    event_type: str | None = None
    user_id: UUID | None = None


class CalendarDay(BaseModel):
    date: date
    operating_window: OperatingWindow
    status: CalendarDayStatus
    is_bookable: bool
    available_for_full_day: bool
    blocked_ranges: list[CalendarBlockedRange] = Field(default_factory=list)
    bookings: list[CalendarBookingSummary] = Field(default_factory=list)


class CalendarResponse(BaseModel):
    venue_id: UUID
    timezone: str
    start_date: date
    end_date: date
    days: list[CalendarDay]
