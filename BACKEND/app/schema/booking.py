from pydantic import BaseModel
from typing import Optional

class OfflineBookingRequest(BaseModel):
    venue_id: int
    booking_date: str
    start_time: Optional[str] = None
    end_time: Optional[str] = None