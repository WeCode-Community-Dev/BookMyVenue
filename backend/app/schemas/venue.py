from pydantic import BaseModel, computed_field, field_validator
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
    google_maps_url: Optional[str] = None
    refund_50_days_before: Optional[int] = None
    refund_25_days_before: Optional[int] = None
    cancel_cutoff_days_before: Optional[int] = None
    advance_percent: int = 30
    allow_pay_at_venue: bool = True

    @field_validator(
        "refund_50_days_before",
        "refund_25_days_before",
        "cancel_cutoff_days_before",
        mode="before",
    )
    @classmethod
    def empty_str_to_none(cls, v):
        if v == "" or v is None:
            return None
        return v

    @field_validator("advance_percent")
    @classmethod
    def validate_advance_percent(cls, v):
        if v < 1 or v > 100:
            raise ValueError("advance_percent must be between 1 and 100")
        return v


class VenueUpdate(BaseModel):
    name: str
    location: str
    price_per_day: float
    venue_type_id: int
    description: Optional[str] = None
    capacity: Optional[int] = None
    image_url: Optional[str] = None
    google_maps_url: Optional[str] = None
    refund_50_days_before: Optional[int] = None
    refund_25_days_before: Optional[int] = None
    cancel_cutoff_days_before: Optional[int] = None
    advance_percent: int = 30
    allow_pay_at_venue: bool = True

    @field_validator(
        "refund_50_days_before",
        "refund_25_days_before",
        "cancel_cutoff_days_before",
        mode="before",
    )
    @classmethod
    def empty_str_to_none(cls, v):
        if v == "" or v is None:
            return None
        return v

    @field_validator("advance_percent")
    @classmethod
    def validate_advance_percent(cls, v):
        if v < 1 or v > 100:
            raise ValueError("advance_percent must be between 1 and 100")
        return v


class VenueOut(BaseModel):
    id: int
    name: str
    location: str
    google_maps_url: Optional[str] = None
    price_per_day: float
    approval_status: str
    venue_type: Optional[VenueTypeOut] = None
    amenities: list[AmenityOut] = []
    description: Optional[str] = None
    capacity: Optional[int] = None
    image_url: Optional[str] = None
    average_rating: Optional[float] = None
    total_reviews: int = 0
    refund_50_days_before: Optional[int] = None
    refund_25_days_before: Optional[int] = None
    cancel_cutoff_days_before: Optional[int] = None
    advance_percent: int = 30
    allow_pay_at_venue: bool = True
    created_at: datetime

    model_config = {"from_attributes": True}

    @computed_field
    @property
    def images(self) -> list[str]:
        return [self.image_url] if self.image_url else []
