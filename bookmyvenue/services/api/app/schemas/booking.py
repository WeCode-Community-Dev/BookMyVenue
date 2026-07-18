from datetime import date, datetime, time
from pydantic import BaseModel, Field, model_validator
from typing import List, Optional
from enum import Enum

from models.booking import BookingTypeEnum, BookingStatusEnum, PaymentEnum


class BookingCreate(BaseModel):
    venue_id: int
    availability_ids: List[int] = Field(min_length=1)


class BookingStatusUpdate(BaseModel):
    status: BookingStatusEnum


class BookingSlotOut(BaseModel):
    id: int
    availability_id: int
    date: date
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    booking_type: BookingTypeEnum
    is_booked: bool

    model_config = {"from_attributes": True}

    @model_validator(mode="before")
    @classmethod
    def populate_from_availability(cls, data):
        if hasattr(data, "availability") and data.availability is not None:
            avail = data.availability
            cls_dict = {
                "id": data.id,
                "availability_id": data.availability_id,
                "date": avail.date,
                "start_time": avail.start_time,
                "end_time": avail.end_time,
                "booking_type": avail.booking_type,
                "is_booked": avail.is_booked,
            }
            return cls_dict
        return data


class BookingOut(BaseModel):
    id: int
    venue_id: int
    venue_name: str = ""
    booker_id: int
    booker_name: str = ""
    booking_type: BookingTypeEnum
    base_price: float
    tax_amount: float
    platform_fee: float
    total_amount: float
    status: BookingStatusEnum
    payment_status: PaymentEnum
    created_at: datetime
    slots: List[BookingSlotOut]

    model_config = {"from_attributes": True}

    @model_validator(mode="before")
    @classmethod
    def populate_names(cls, data):
        if hasattr(data, "venue") and data.venue is not None:
            data.venue_name = data.venue.name
        if hasattr(data, "booker") and data.booker is not None:
            data.booker_name = data.booker.name or ""
        return data
