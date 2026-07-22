from pydantic import BaseModel
from typing import Optional

class CreateOrderRequest(BaseModel):
    user_id: int
    venue_id: int
    amount: int  # amount in rupees


class VerifyPaymentRequest(BaseModel):
    user_id: int
    venue_id: int
    order_id: int
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    booking_date: str
    start_time: Optional[str] = None
    end_time: Optional[str] = None