from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.schemas.amenity import AmenityOut
from app.schemas.venue_type import VenueTypeOut


class VenueCreate(BaseModel):
    name: str
    location: str
    price_per_day: float
    venue_type_id: int
    description: Optional[str] = None
    capacity: Optional[int] = None
    image_url: Optional[str] = None


class VenueUpdate(BaseModel):
    name: str
    location: str
    price_per_day: float
    venue_type_id: int
    description: Optional[str] = None
    capacity: Optional[int] = None
    image_url: Optional[str] = None


class VenueOut(BaseModel):
    id: int
    name: str
    location: str
    price_per_day: float
    approval_status: str
    venue_type: Optional[VenueTypeOut] = None
    amenities: list[AmenityOut] = []
    description: Optional[str] = None
    capacity: Optional[int] = None
    image_url: Optional[str] = None
    average_rating: Optional[float] = None
    total_reviews: int = 0
    created_at: datetime

    model_config = {"from_attributes": True}