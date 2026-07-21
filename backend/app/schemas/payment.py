from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class PaymentInitiate(BaseModel):
    booking_id: int


class PaymentConfirm(BaseModel):
    payment_id: str
    gateway_order_id: str
    gateway_payment_id: str
    gateway_signature: str


class PaymentOut(BaseModel):
    payment_id: str
    booking_id: int
    amount: float
    currency: str
    status: str
    gateway_order_id: Optional[str] = None
    key_id: Optional[str] = None
    paid_at: Optional[datetime] = None
    created_at: datetime
    expires_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
