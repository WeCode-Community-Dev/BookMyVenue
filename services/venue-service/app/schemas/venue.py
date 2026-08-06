from datetime import datetime
from decimal import Decimal
from typing import Any

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

from app.models.enums import BookingType
from app.schemas.catalog import DistrictOut, VenueCategoryOut


class CityOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    district: DistrictOut


class VenueImageCreate(BaseModel):
    image_url: str
    is_cover: bool = False
    sort_order: int | None = None


class VenueImageOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    image_url: str
    is_cover: bool
    sort_order: int
    uploaded_at: datetime


class VenueListItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    slug: str
    name: str
    address: str
    capacity: int
    status: str
    is_active: bool
    booking_type: str
    category: VenueCategoryOut
    city: CityOut
    min_price: Decimal | None = None
    has_slots: bool = False
    cover_image: str | None = None
    average_rating: Decimal
    review_count: int
    created_at: datetime


class VenueDetailOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    slug: str
    owner_id: int
    name: str
    description: str | None = None
    address: str
    google_maps_url: str | None = None
    capacity: int
    contact_name: str
    contact_phone: str
    contact_email: str
    status: str
    amenities: list[Any] = Field(default_factory=list)
    booking_type: str
    is_active: bool
    category: VenueCategoryOut
    city: CityOut
    images: list[VenueImageOut] = Field(default_factory=list)
    min_price: Decimal | None = None
    average_rating: Decimal
    review_count: int
    created_at: datetime
    updated_at: datetime


class VenueWriteIn(BaseModel):
    category_id: int
    city_id: int
    name: str = Field(min_length=1, max_length=200)
    description: str | None = None
    address: str = Field(min_length=1)
    google_maps_url: str | None = None
    capacity: int
    booking_type: BookingType
    contact_name: str = Field(min_length=1, max_length=100)
    contact_phone: str = Field(min_length=1, max_length=20)
    contact_email: str = Field(min_length=1, max_length=255)
    amenities: list[Any] = Field(default_factory=list)
    images: list[VenueImageCreate] = Field(default_factory=list)

    @field_validator("capacity")
    @classmethod
    def capacity_must_be_positive(cls, value: int) -> int:
        if value <= 0:
            raise ValueError("Capacity must be greater than 0.")
        return value

    @field_validator("google_maps_url")
    @classmethod
    def empty_maps_url_to_none(cls, value: str | None) -> str | None:
        if value == "":
            return None
        return value

    @model_validator(mode="after")
    def normalize_cover_image(self) -> "VenueWriteIn":
        if not self.images:
            return self
        cover_count = sum(1 for image in self.images if image.is_cover)
        if cover_count > 1:
            raise ValueError("Only one cover image is allowed.")
        if cover_count == 0:
            self.images[0].is_cover = True
        return self


class PaginatedVenueListOut(BaseModel):
    count: int
    next: str | None = None
    previous: str | None = None
    results: list[VenueListItemOut]
