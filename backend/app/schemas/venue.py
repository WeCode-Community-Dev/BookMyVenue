from pydantic import BaseModel
from app.schemas.amenity import AmenityOut

class VenueCreate(BaseModel):
    name: str
    location: str
    price_per_day: float


class VenueUpdate(BaseModel):
    name: str
    location: str
    price_per_day: float

class VenueOut(BaseModel):
    id: int
    name: str
    location: str
    price_per_day: float
    approval_status: str
    amenities: list[AmenityOut] = []

    model_config = {"from_attributes": True}