from pydantic import BaseModel, Field
from typing import Literal, Optional

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
    venue_availabilty: Optional[str] = None

class VenueAmenitiesUpdate(BaseModel):
    wifi: bool = False
    kitchen: bool = False
    parking: bool = False
    ac: bool = False
    wheel_chair: bool = False
    av_equipements: bool = False
