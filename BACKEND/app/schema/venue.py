from pydantic import BaseModel, Field
from typing import Literal

class VenueDetailsCreate(BaseModel):
    user_id: int = Field(..., gt=0) 
    venue_name: str = Field(..., min_length=1)
    venue_description: str = Field(..., min_length=1)
    location: str = Field(..., min_length=1)
    capacity: int = Field(..., gt=0)
    venue_price: int = Field(..., ge=0)
    venue_availabilty: Literal["hourly", "daily"]

class VenueAmenitiesCreate(BaseModel):
    wifi: bool = False
    kitchen: bool = False
    parking: bool = False
    ac: bool = False
    wheel_chair: bool = False
    av_equipements: bool = False