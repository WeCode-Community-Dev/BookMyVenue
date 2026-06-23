from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class PaymentInitiate(BaseModel):
    booking_id: int


class PaymentConfirm(BaseModel):
    payment_id: str
    # mock flag: let frontend simulate success or failure
    success: bool = True


class PaymentOut(BaseModel):
    payment_id: str
    booking_id: int
    amount: float
    currency: str
    status: str
    paid_at: Optional[datetime] = None
    created_at: datetime

    model_config = {"from_attributes": True}