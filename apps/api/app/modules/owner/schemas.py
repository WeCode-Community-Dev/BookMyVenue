from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class DashboardStats(BaseModel):
    active_venues: int
    pending_requests: int
    active_bookings: int
    completed_bookings: int
    cancelled_bookings: int
    # Financial (paise)
    gross_volume_paise: int
    net_revenue_paise: int
    available_balance_paise: int
    platform_fees_paise: int
    refunds_issued_paise: int
    payouts_completed_paise: int


class ChartDataPoint(BaseModel):
    month: str       # e.g. "Jan 26"
    enquiries: int
    completed: int
    cancelled: int


class UpcomingEventOut(BaseModel):
    booking_id: str
    event_type: Optional[str] = None
    venue_name: str
    status: str
    starts_at: Optional[str] = None   # ISO string
    guest_count: int



