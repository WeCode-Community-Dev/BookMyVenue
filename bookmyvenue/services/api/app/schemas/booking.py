from datetime import datetime
from pydantic import BaseModel, Field
from typing import List
from enum import Enum

from models.booking import BookingTypeEnum, BookingStatusEnum, PaymentEnum


class BookingCreate(BaseModel):
    venue_id: int
    availability_ids: List[int] = Field(min_length=1)


class BookingStatusUpdate(BaseModel):
    status: BookingStatusEnum


class BookingSlotOut(BaseModel):
    id: int
    availabily_id: int

    model_config = {"from_attributes": True}


class BookingOut(BaseModel):
    id: int
    venu_id: int
    booker_id: int
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
