from datetime import date, datetime, time
from typing import Literal, Optional

from pydantic import BaseModel, EmailStr, Field


class VenueRejectRequest(BaseModel):
    rejection_reason: Optional[str] = None


class VenueAdminOut(BaseModel):
    id: int
    owner_id: int
    owner_name: Optional[str] = None
    name: str
    location: str
    price_per_day: float
    description: Optional[str] = None
    approval_status: str
    rejection_reason: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class VenueAdminCreate(BaseModel):
    owner_id: int
    name: str
    location: str
    price_per_day: float
    description: Optional[str] = None
    approval_status: Literal["pending", "approved", "rejected"] = "pending"


class VenueAdminUpdate(BaseModel):
    name: str
    location: str
    price_per_day: float
    description: Optional[str] = None
    approval_status: Optional[str] = None
    is_active: Optional[bool] = None


class TrendPoint(BaseModel):
    label: str
    date: str
    bookings: int
    revenue: float


class VenueBreakdown(BaseModel):
    approved: int
    pending: int
    rejected: int


class BookingStatusBreakdown(BaseModel):
    booked: int
    pending_payment: int
    cancelled: int


class MonthActivity(BaseModel):
    date: str
    bookings: int


class HealthMetric(BaseModel):
    label: str
    value: int
    total: int
    percent: int


class DashboardStats(BaseModel):
    total_users: int
    total_owners: int
    total_venues: int
    pending_venues: int
    total_bookings: int
    total_revenue: float
    active_users: int
    active_venues: int
    today_bookings: int
    today_revenue: float
    weekly_trend: list[TrendPoint]
    venue_breakdown: VenueBreakdown
    booking_status: BookingStatusBreakdown
    month_activity: list[MonthActivity]
    health_metrics: list[HealthMetric]


class UserAdminOut(BaseModel):
    id: int
    name: Optional[str] = None
    email: str
    phone_number: Optional[str] = None
    role: str
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class UserAdminCreate(BaseModel):
    name: str
    email: EmailStr
    phone_number: str
    password: str = Field(..., min_length=8, max_length=72)
    role: Literal["user", "host"] = "user"


class UserAdminUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
    role: Optional[Literal["user", "host"]] = None
    password: Optional[str] = Field(default=None, min_length=8, max_length=72)
    is_active: Optional[bool] = None


class BookingAdminOut(BaseModel):
    id: int
    user_id: int
    user_name: Optional[str] = None
    venue_id: int
    venue_name: Optional[str] = None
    booking_date: date
    time_slot: time
    status: str
    amount: float
    payment_status: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}
