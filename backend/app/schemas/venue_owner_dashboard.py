from pydantic import BaseModel
from datetime import date, datetime, time
from typing import Optional, Any


class DashboardSummaryOut(BaseModel):
    total_venues: int
    active_venues: int
    pending_venues: int
    booking_requests_total: int
    booking_requests_new: int
    booking_requests_pending: int
    upcoming_events_count: int
    next_event_date: Optional[date] = None
    monthly_revenue: float
    monthly_revenue_change_pct: float


class BookingRequestOut(BaseModel):

    id: int
    venue_name: str
    event_type: Optional[str] = None
    event_date: date
    event_time: time
    guest_count: Optional[int] = None
    price: float
    owner_status: str

    model_config = {"from_attributes": True}


class AvailabilityCalendarOut(BaseModel):
    month: str  
    days: dict[str, Any]  


class RevenuePointOut(BaseModel):
    date: date
    revenue: float


class RevenueOverviewOut(BaseModel):
    range: str
    total_revenue: float
    change_pct: float
    previous_total: float
    series: list[RevenuePointOut]


class CheckInVerifyRequest(BaseModel):
    check_in_token: str


class CheckInVerifyOut(BaseModel):
    booking_id: int
    venue_name: str
    guest_name: str
    guest_count: Optional[int] = None
    event_type: Optional[str] = None
    check_in_date: date
    checked_in_at: datetime
    already_checked_in: bool = False
    message: str
