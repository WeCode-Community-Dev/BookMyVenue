from pydantic import BaseModel
from typing import Optional

class OfflineBookingRequest(BaseModel):
    venue_id: int
    booking_date: str
    start_time: Optional[str] = None
    end_time: Optional[str] = None

class CancelBookingRequest(BaseModel):
    booking_id: int
    order_id: int
    cancel_reason: Optional[str] = None