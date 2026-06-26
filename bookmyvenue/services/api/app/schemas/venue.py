from typing_extensions import Self
from datetime import datetime
from pydantic import BaseModel, Field, PositiveInt, model_validator, ValidationError
from typing import Optional, List
from .venue_image import VenueImageOut


class VenueCreate(BaseModel):
    name: str = Field(max_length=100, description="required field")
    description: str = Field(max_length=1000, description="required field")
    category_id: int = Field(description="required field")
    address_line: str = Field(max_length=500, description="required field")
    city: str = Field(max_length=100, description="required field")
    pincode: str = Field(min_length=6, max_length=6,
                         description="required field")
    capacity: PositiveInt = Field(le=200000)
    supports_hourly: bool = Field(default=False)
    supports_daily: bool = Field(default=False)
    hourly_price: Optional[float] = Field(default=None)
    daily_price: Optional[float] = Field(default=None)
    amenities: str = Field(max_length=500, description="required field")
    cancellation_policy: Optional[str] = Field(default=None)
    image_urls: List[str] = Field(default_factory=list)

    @model_validator(mode='after')
    def pay_type_validator(self) -> Self:

        if self.supports_hourly is None and self.supports_daily is None:
            raise ValueError(
                "Both supports_hourly and supports_daily can't be False at same time")
        if self.supports_hourly and not self.hourly_price:
            raise ValueError(
                "hourly_price required when supports_hourly is True")
        if self.supports_daily and not self.daily_price:
            raise ValueError(
                "daily_price required when supports_daily is True")
        return self


class VenueUpdate(BaseModel):
    name: Optional[str] = Field(default=None, max_length=100)
    description: Optional[str] = Field(default=None, max_length=1000)
    category_id: Optional[int] = None
    address_line: Optional[str] = Field(default=None, max_length=500)
    city: Optional[str] = Field(default=None, max_length=100)
    pincode: Optional[str] = Field(default=None, min_length=6, max_length=6)
    capacity: Optional[PositiveInt] = Field(default=None, le=200000)
    supports_hourly: Optional[bool] = None
    supports_daily: Optional[bool] = None
    hourly_price: Optional[float] = None
    daily_price: Optional[float] = None
    amenities: Optional[str] = Field(default=None, max_length=500)
    cancellation_policy: Optional[str] = None


class VenueOut(BaseModel):
    id: int
    owner_id: int
    category_id: int
    name: str
    description: str
    address_line: str
    city: str
    pincode: str
    capacity: PositiveInt
    supports_hourly: bool
    supports_daily: bool
    hourly_price: Optional[float] = None
    daily_price: Optional[float] = None
    amenities: str
    cancellation_policy: Optional[str] = None
    images: list[VenueImageOut] = Field(default_factory=list)

    model_config = {"from_attributes": True}
