from pydantic import BaseModel, Field
from datetime import date, time, datetime
from typing import Optional 

class BookingCreate(BaseModel):
    venue_id: int
    booking_date: date          # "YYYY-MM-DD"
    time_slot: time             # "HH:MM"
    notes: Optional[str] = None 

class BookingOut(BaseModel):
    id: int
    venue_id: int
    booking_date: date
    time_slot: time
    notes: Optional[str] = None
    status: str
    amount: float
    created_at: datetime
    model_config = {"from_attributes": True} 