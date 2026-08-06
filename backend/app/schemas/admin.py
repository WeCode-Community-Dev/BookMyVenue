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
    venue_type_id: Optional[int] = None
    venue_type_name: Optional[str] = None
    capacity: Optional[int] = None
    image_url: Optional[str] = None
    google_maps_url: Optional[str] = None
    google_review_url: Optional[str] = None
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
    venue_type_id: int
    capacity: Optional[int] = None
    image_url: Optional[str] = None
    google_maps_url: Optional[str] = None
    google_review_url: Optional[str] = None
    description: Optional[str] = None
    approval_status: Literal["pending", "approved", "rejected"] = "pending"


class VenueAdminUpdate(BaseModel):
    name: str
    location: str
    price_per_day: float
    venue_type_id: Optional[int] = None
    owner_id: Optional[int] = None
    capacity: Optional[int] = None
    image_url: Optional[str] = None
    google_maps_url: Optional[str] = None
    google_review_url: Optional[str] = None
    description: Optional[str] = None
    approval_status: Optional[Literal["pending", "approved", "rejected"]] = None
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
    is_venue_owner: bool = False
    business_name: Optional[str] = None
    business_address: Optional[str] = None
    business_type: Optional[str] = None
    business_phone: Optional[str] = None
    business_email: Optional[str] = None
    gst_number: Optional[str] = None

    model_config = {"from_attributes": True}


class UserAdminCreate(BaseModel):
    name: str
    email: EmailStr
    phone_number: str
    password: str = Field(..., min_length=8, max_length=72)
    role: Literal["user", "owner", "host"] = "user"
    business_name: Optional[str] = None
    business_address: Optional[str] = None
    business_type: Optional[str] = None
    business_phone: Optional[str] = None
    business_email: Optional[str] = None
    gst_number: Optional[str] = None


class UserAdminUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
    role: Optional[Literal["user", "owner", "host"]] = None
    password: Optional[str] = Field(default=None, min_length=8, max_length=72)
    is_active: Optional[bool] = None
    business_name: Optional[str] = None
    business_address: Optional[str] = None
    business_type: Optional[str] = None
    business_phone: Optional[str] = None
    business_email: Optional[str] = None
    gst_number: Optional[str] = None


class BookingAdminOut(BaseModel):
    id: int
    user_id: int
    user_name: Optional[str] = None
    venue_id: int
    venue_name: Optional[str] = None
    booking_date: date
    time_slot: time
    check_in_date: Optional[date] = None
    check_in_time: Optional[time] = None
    check_out_date: Optional[date] = None
    check_out_time: Optional[time] = None
    num_days: Optional[int] = None
    status: str
    amount: float
    payment_status: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}
