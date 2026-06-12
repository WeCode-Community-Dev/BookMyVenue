from pydantic import BaseModel, Field
from typing import Literal

class BasicRequest(BaseModel):
    user_id: int = Field(..., gt=0) 
    venue_name: str = Field(..., min_length=1)
    venue_description: str = Field(..., min_length=1)
    location: str = Field(..., min_length=1)
    capacity: int = Field(..., gt=0)
    venue_price: int = Field(..., ge=0)
    venue_availabilty: Literal["hourly", "daily"]

