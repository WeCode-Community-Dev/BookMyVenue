from pydantic import BaseModel
from datetime import date, time, datetime
from typing import Optional


class BookingCreate(BaseModel):
    venue_id: int
    check_in_date: date
    check_in_time: time
    check_out_date: date
    check_out_time: time
    notes: Optional[str] = None
    event_type: Optional[str] = None
    guest_count: Optional[int] = None


class BookingOut(BaseModel):
    id: int
    venue_id: int
    booking_date: date
    time_slot: time
    check_in_date: date
    check_in_time: time
    check_out_date: date
    check_out_time: time
    num_days: int
    notes: Optional[str] = None
    event_type: Optional[str] = None
    guest_count: Optional[int] = None
    status: str
    owner_status: str
    amount: float
    payment_option: Optional[str] = None
    amount_paid: float = 0
    balance_due: Optional[float] = None
    created_at: datetime
    model_config = {"from_attributes": True}


class BookingCancelRequest(BaseModel):
    cancellation_reason: Optional[str] = None


class CancellationPolicyOut(BaseModel):
    refund_50_deadline: Optional[date] = None
    refund_25_deadline: Optional[date] = None
    last_cancel_date: Optional[date] = None


class BookingCancelOut(BookingOut):
    cancellation_reason: Optional[str] = None
    cancelled_at: Optional[datetime] = None
    refund_status: Optional[str] = None
    refund_percent: Optional[int] = None
    refund_amount: Optional[float] = None


class PaginatedBookingsOut(BaseModel):
    items: list["BookingListItemOut"]
    total: int
    page: int
    limit: int


class BookingListItemOut(BaseModel):
    id: int
    venue_id: int
    venue_name: Optional[str] = None
    venue_location: Optional[str] = None
    booking_date: date
    time_slot: time
    check_in_date: date
    check_in_time: time
    check_out_date: date
    check_out_time: time
    num_days: int
    status: str
    owner_status: str
    amount: float
    payment_option: Optional[str] = None
    amount_paid: float = 0
    balance_due: Optional[float] = None
    payment_status: Optional[str] = None
    can_review: bool = False
    has_review: bool = False
    created_at: datetime


class BookingDetailOut(BookingOut):
    venue_name: Optional[str] = None
    venue_location: Optional[str] = None
    google_maps_url: Optional[str] = None
    google_review_url: Optional[str] = None
    advance_percent: int = 30
    allow_pay_at_venue: bool = True
    payment_status: Optional[str] = None
    can_review: bool = False
    has_review: bool = False
    can_cancel: bool = False
    refund_percent_if_cancelled: int = 0
    refund_amount_if_cancelled: float = 0.0
    refund_status: Optional[str] = None
    cancellation_policy: Optional[CancellationPolicyOut] = None
    cancellation_reason: Optional[str] = None
    cancelled_at: Optional[datetime] = None
    check_in_token: Optional[str] = None
    checked_in_at: Optional[datetime] = None
    show_check_in_qr: bool = False


class VenueSnippet(BaseModel):
    id: int
    name: str
    location: str

    model_config = {"from_attributes": True}


class CustomerSnippet(BaseModel):
    id: int
    name: str

    model_config = {"from_attributes": True}


class OwnerBookingOut(BaseModel):
    id: int
    venue: VenueSnippet
    user: CustomerSnippet
    booking_date: date
    time_slot: time
    check_in_date: date
    check_in_time: time
    check_out_date: date
    check_out_time: time
    num_days: int
    event_type: Optional[str] = None
    guest_count: Optional[int] = None
    notes: Optional[str] = None
    status: str
    owner_status: str
    amount: float
    payment_option: Optional[str] = None
    amount_paid: float = 0
    balance_due: Optional[float] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class PaginatedOwnerBookingsOut(BaseModel):
    items: list[OwnerBookingOut]
    total: int
    page: int
    limit: int