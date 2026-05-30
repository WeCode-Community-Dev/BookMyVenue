from decimal import Decimal
from pydantic import BaseModel
from datetime import datetime


class VenueCreate(BaseModel):
    name: str
    location: str
    price_per_day: Decimal
    description: str | None = None

class VenueImageResponse(BaseModel):
    id: int
    image_url: str

    model_config = {
        "from_attributes": True
    }

class AmenityResponse(BaseModel):
    id: int
    name: str

    model_config = {
        "from_attributes": True
    }

# venue response schemas
class VenueResponse(BaseModel):
    id: int
    name: str
    location: str
    price_per_day: Decimal
    description: str | None
    is_approved: bool
    created_at: datetime


    # without model_config = {"from_attributes": True} get validation errors when returning model objects 
    # Pydantic needs permission to read attributes from SQLAlchemy models 
    model_config = {
        "from_attributes": True
    }

