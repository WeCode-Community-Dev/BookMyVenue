from pydantic import BaseModel, Field
from uuid import UUID
from datetime import date, datetime, time
from typing import List, Optional

class CheckoutRequest(BaseModel):
    venue_id: UUID
    booking_date: date
    slot_ids: List[UUID] = Field(..., min_length=1)

class CheckoutResponse(BaseModel):
    booking_id: UUID
    amount: float
    razorpay_order_id: str
    razorpay_key_id: str
    lock_expires_at: datetime

class PaymentVerificationRequest(BaseModel):
    booking_id: UUID
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str

class BookingSlotDetail(BaseModel):
    id: UUID
    slot_name: str
    start_time: time
    end_time: time
    price: float

    class Config:
        from_attributes = True

class BookingUserDetail(BaseModel):
    id: UUID
    full_name: Optional[str] = None
    mobile_number: str
    email: Optional[str] = None

    class Config:
        from_attributes = True

class BookingDetailResponse(BaseModel):
    id: UUID
    venue_id: UUID
    venue_name: str
    booking_date: date
    status: str
    amount: float
    venue_amount: float
    cleaning_fee: float
    commission_percent: float
    commission_amount: float
    security_amount: float
    total_amount: float
    lock_expires_at: datetime
    created_at: datetime
    slots: List[BookingSlotDetail]
    user: Optional[BookingUserDetail] = None

    class Config:
        from_attributes = True
