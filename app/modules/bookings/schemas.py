from datetime import date
from pydantic import BaseModel
from datetime import datetime


class BookingCreate(BaseModel):
    venue_id: int
    booking_date: date 

# booking response schemas 
class BookingResponse(BaseModel):
    id: int
    user_id: int
    venue_id: int
    booking_date: date
    status: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }

