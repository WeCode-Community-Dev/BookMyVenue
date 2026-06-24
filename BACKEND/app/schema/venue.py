from pydantic import BaseModel, Field
from typing import Literal, Optional

class VenueDetailsCreate(BaseModel):
    user_id: int = Field(..., gt=0) 
    venue_name: str = Field(..., min_length=1)
    venue_description: str = Field(..., min_length=1)
    location: str = Field(..., min_length=1)
    capacity: int = Field(..., gt=0)

class VenueAmenitiesCreate(BaseModel):
    wifi: bool = False
    kitchen: bool = False
    parking: bool = False
    ac: bool = False
    wheel_chair: bool = False
    av_equipements: bool = False


class VenueApprovalRequest(BaseModel):
    status: Literal["approved", "rejected"]
    reason: Optional[str] = None

class VenueActiveStatusRequest(BaseModel):
    status: Literal["active", "inactive"]
    reason: Optional[str] = None

class VenueDetailsUpdate(BaseModel):
    venue_name: Optional[str] = None
    venue_description: Optional[str] = None
    location: Optional[str] = None
    capacity: Optional[int] = None
    venue_price: Optional[int] = None

class VenueAmenitiesUpdate(BaseModel):
    wifi: bool = False
    kitchen: bool = False
    parking: bool = False
    ac: bool = False
    wheel_chair: bool = False
    av_equipements: bool = False

class VenueAvailabilityCreate(BaseModel):
    booking_types: Literal["hourly", "daily"]
    open_time: str
    closing_time: str
    minimum_hours: Optional[int] = None
    gap_between_bookings: Optional[int] = None
    venue_price: int