from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.modules.payments.model import PaymentStatus


class PaymentRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    booking_id: int
    amount: float
    status: PaymentStatus
    provider_txn_id: str
    created_at: datetime


class OverviewStats(BaseModel):
    total_users: int
    total_venues: int
    pending_venues: int
    total_bookings: int
    total_revenue: float
