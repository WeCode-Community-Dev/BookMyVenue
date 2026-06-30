from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field

from app.modules.venues.model import VenueStatus, VenueType


class VenueBase(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    type: VenueType
    description: Optional[str] = None
    address: str = Field(min_length=1, max_length=500)
    lat: Optional[float] = None
    lng: Optional[float] = None
    price_per_hour: float = Field(ge=0)
    capacity: int = Field(ge=1)
    photos: List[str] = Field(default_factory=list)
    amenities: List[str] = Field(default_factory=list)


class VenueCreate(VenueBase):
    pass


class VenueUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    address: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    price_per_hour: Optional[float] = None
    capacity: Optional[int] = None
    photos: Optional[List[str]] = None
    amenities: Optional[List[str]] = None


class VenueRead(VenueBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    owner_id: int
    status: VenueStatus
    created_at: datetime
    distance_km: Optional[float] = None


class VenueSearchParams(BaseModel):
    lat: Optional[float] = None
    lng: Optional[float] = None
    radius_km: Optional[float] = None
    type: Optional[VenueType] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    min_capacity: Optional[int] = None
    date: Optional[datetime] = None
    q: Optional[str] = None
    skip: int = 0
    limit: int = 20


class VenueStatusUpdate(BaseModel):
    status: VenueStatus
