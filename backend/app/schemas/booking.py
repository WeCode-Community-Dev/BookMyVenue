from pydantic import BaseModel, Field
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
    created_at: datetime
    model_config = {"from_attributes": True}


class BookingCancelRequest(BaseModel):
    cancellation_reason: Optional[str] = None


class PaginatedBookingsOut(BaseModel):
    items: list[BookingOut]
    total: int
    page: int
    limit: int


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
    created_at: datetime

    model_config = {"from_attributes": True}


class PaginatedOwnerBookingsOut(BaseModel):
    items: list[OwnerBookingOut]
    total: int
    page: int
    limit: int
