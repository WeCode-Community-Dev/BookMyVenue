from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class NotificationOut(BaseModel):
    id: int
    type: str
    message: str
    venue_name: Optional[str] = None
    booking_ref: Optional[str] = None
    is_read: bool
    created_at: datetime

    model_config = {"from_attributes": True}