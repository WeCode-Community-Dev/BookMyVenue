from pydantic import BaseModel, Field
from datetime import date, time, datetime
from typing import Optional


class BookingCreate(BaseModel):
    venue_id: int
    booking_date: date
    time_slot: time
    notes: Optional[str] = None


class BookingOut(BaseModel):
    id: int
    venue_id: int
    booking_date: date
    time_slot: time
    notes: Optional[str] = None
    status: str
    amount: float
    created_at: datetime

    model_config = {"from_attributes": True}


class BookingListOut(BaseModel):
    id: int
    venue_id: int
    venue_name: Optional[str] = None
    venue_location: Optional[str] = None
    booking_date: date
    time_slot: time
    status: str
    amount: float
    payment_status: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class PaymentBrief(BaseModel):
    payment_id: str
    status: str
    paid_at: Optional[datetime] = None


class BookingDetailOut(BookingListOut):
    user_id: int
    notes: Optional[str] = None
    cancellation_reason: Optional[str] = None
    cancelled_at: Optional[datetime] = None
    payment: Optional[PaymentBrief] = None


class BookingCancelRequest(BaseModel):
    cancellation_reason: Optional[str] = None


class PaginatedBookings(BaseModel):
    data: list[BookingListOut]
    pagination: dict