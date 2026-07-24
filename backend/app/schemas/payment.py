from pydantic import BaseModel
from datetime import datetime
from typing import Literal, Optional

PaymentOption = Literal["full", "advance", "pay_at_venue"]
PaymentType = Literal["full", "advance", "balance", "pay_at_venue"]


class PaymentInitiate(BaseModel):
    booking_id: int
    payment_option: PaymentOption


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
    payment_type: str = "full"
    payment_option: Optional[str] = None
    booking_total: Optional[float] = None
    amount_paid: Optional[float] = None
    balance_due: Optional[float] = None
    gateway_order_id: Optional[str] = None
    key_id: Optional[str] = None
    paid_at: Optional[datetime] = None
    created_at: datetime
    expires_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class CollectBalanceOut(BaseModel):
    booking_id: int
    amount_collected: float
    amount_paid: float
    balance_due: float
    payment_id: str
    message: str
