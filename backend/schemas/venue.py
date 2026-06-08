from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional
import enum


class InventoryType(str, enum.Enum):
    CAPACITY_BASED = "capacity_based"
    ENTIRE_VENUE = "entire_venue"


class VenueBase(BaseModel):
    name: str
    location: str
    capacity: int
    price_per_hour: float | None = None
    latitude: float | None = None
    longitude: float | None = None
    photos: list[str] | None = None
    features: dict | None = None
    inventory_type: InventoryType = InventoryType.CAPACITY_BASED

    model_config = ConfigDict(use_enum_values=True)


class VenueCreate(VenueBase):
    pass


class VenueUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    capacity: Optional[int] = None
    price_per_hour: Optional[float] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    photos: Optional[list[str]] = None
    features: Optional[dict] = None
    inventory_type: Optional[InventoryType] = None

    model_config = ConfigDict(use_enum_values=True)


class VenueResponse(VenueBase):
    id: int
    owner_id: int
    dynamic_price: float | None = None
    dynamic_multiplier: float = 1.0

    model_config = ConfigDict(from_attributes=True, use_enum_values=True)


class BookingRequest(BaseModel):
    venue_id: int
    start_time: datetime
    end_time: datetime
    tickets_count: int = 1


class BookingResponse(BaseModel):
    id: int
    venue_id: int
    user_id: int
    status: str
    start_time: datetime
    end_time: datetime
    tickets_count: int
    expires_at: Optional[datetime]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True, strict=True)


class BookingStatusUpdate(BaseModel):
    status: str

