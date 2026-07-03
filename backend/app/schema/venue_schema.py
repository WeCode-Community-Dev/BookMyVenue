import re

from decimal import Decimal
from datetime import datetime, time
from enum import Enum
from typing import Optional, List
from uuid import UUID

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    HttpUrl,
    field_validator,
    model_validator,
)

from app.model.venue_model import VerificationStatus


class VenueCategory(str, Enum):
    MARRIAGE_HALL = "marriage_hall"
    AUDITORIUM = "auditorium"
    PARTY_HALL = "party_hall"
    CONFERENCE_ROOM = "conference_room"
    SPORTS_ARENA = "sports_arena"
    PHOTOGRAPHY_STUDIO = "photography_studio"


class VenueStatus(str, Enum):
    DRAFT = "draft"
    SUBMITTED = "submitted"
    APPROVED = "approved"
    REJECTED = "rejected"
    SUSPENDED = "suspended"


class PriceType(str, Enum):
    FIXED = "fixed"
    SLOT_BASED = "slot_based"


# --------------------------------------------------
# Constants
# --------------------------------------------------

VENUE_NAME_REGEX = re.compile(r"^[A-Za-z0-9\s&().,'-]+$")
PINCODE_REGEX = re.compile(r"^\d{6}$")


# --------------------------------------------------
# Location
# --------------------------------------------------


class VenueLocation(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid",
    )

    address: str = Field(
        ...,
        min_length=5,
        max_length=500,
        examples=["MG Road, Near Lulu Mall"],
    )

    city: str = Field(
        ...,
        min_length=2,
        max_length=100,
    )

    state: str = Field(
        ...,
        min_length=2,
        max_length=100,
    )

    country: str = Field(
        default="India",
        max_length=100,
    )

    pincode: str = Field(
        ...,
        examples=["682024"],
    )

    latitude: Optional[float] = Field(
        default=None,
        ge=-90,
        le=90,
    )

    longitude: Optional[float] = Field(
        default=None,
        ge=-180,
        le=180,
    )

    @field_validator("pincode")
    @classmethod
    def validate_pincode(cls, value: str) -> str:
        value = value.strip()

        if not PINCODE_REGEX.match(value):
            raise ValueError("Pincode must be a valid 6-digit Indian pincode.")

        return value


# --------------------------------------------------
# Slot
# --------------------------------------------------


class VenueSlotCreate(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid",
    )

    slot_name: str = Field(
        ...,
        min_length=2,
        max_length=100,
        examples=["Morning Session"],
    )

    start_time: time

    end_time: time

    capacity: Optional[int] = Field(
        default=None,
        ge=1,
        le=100000,
    )

    price: Decimal = Field(
        ...,
        gt=0,
        decimal_places=2,
        max_digits=12,
    )

    @model_validator(mode="after")
    def validate_slot_time(self):
        if self.start_time >= self.end_time:
            raise ValueError("end_time must be greater than start_time.")

        return self


# --------------------------------------------------
# Service
# --------------------------------------------------


class VenueServiceCreate(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid",
    )

    service_name: str = Field(
        ...,
        min_length=2,
        max_length=100,
        examples=["Cleaning Fee"],
    )

    price: Decimal = Field(
        ...,
        ge=0,
        decimal_places=2,
        max_digits=12,
    )


# --------------------------------------------------
# Venue Create Request
# --------------------------------------------------


class CreateVenueRequest(BaseModel):
    """
    Create New Venue
    """

    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid",
    )

    venue_name: str = Field(
        ...,
        min_length=3,
        max_length=200,
        examples=["Royal Grand Auditorium"],
    )

    category: str = Field(
        ...,
        examples=["marriage_hall"],
    )

    description: Optional[str] = Field(
        default=None,
        max_length=3000,
    )

    location: VenueLocation

    venue_size: int = Field(
        ...,
        ge=1,
        le=100000,
    )

    max_capacity: int = Field(
        ...,
        ge=1,
        le=100000,
    )

    amenity_ids: list[UUID] = Field(
        default_factory=list,
        max_length=50,
    )

    cover_image_url: HttpUrl

    gallery_images: list[HttpUrl] = Field(
        default_factory=list,
        max_length=20,
    )

    virtual_tour_url: Optional[HttpUrl] = None

    slots: list[VenueSlotCreate] = Field(
        ...,
        min_length=1,
        max_length=20,
    )

    services: list[VenueServiceCreate] = Field(
        default_factory=list,
        max_length=30,
    )

    instant_booking: bool = False

    # --------------------------
    # Validators
    # --------------------------

    @field_validator("venue_name")
    @classmethod
    def validate_venue_name(cls, value: str) -> str:
        value = " ".join(value.split())

        if not VENUE_NAME_REGEX.match(value):
            raise ValueError("Venue name contains invalid characters.")

        return value

    @field_validator("description")
    @classmethod
    def validate_description(
        cls,
        value: Optional[str],
    ) -> Optional[str]:

        if value:
            value = value.strip()

        return value

    @field_validator("category")
    @classmethod
    def normalize_category(cls, value: str) -> str:
        return value.strip().lower()

    @model_validator(mode="after")
    def validate_cover_gallery(self):
        if len(self.gallery_images) > 20:
            raise ValueError("Maximum 20 gallery images allowed.")

        return self


class VenueSlotResponse(BaseModel):
    id: UUID
    slot_name: str
    start_time: time
    end_time: time
    capacity: Optional[int]
    price: float

    model_config = ConfigDict(from_attributes=True)


class AmenityResponse(BaseModel):
    id: UUID
    name: str

    model_config = ConfigDict(from_attributes=True)


class DeleteAmenityResponse(BaseModel):
    id: UUID
    message: str

    model_config = ConfigDict(from_attributes=True)


class AmenityRequest(BaseModel):
    name: str

    model_config = ConfigDict(from_attributes=True)


class VenueServiceResponse(BaseModel):
    id: UUID
    service_name: str
    price: float

    model_config = ConfigDict(from_attributes=True)


class VenueImageResponse(BaseModel):
    id: UUID
    image_url: str
    sort_order: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class VenueResponse(BaseModel):
    id: UUID
    owner_id: UUID
    venue_name: str
    slug: str
    category: VenueCategory
    description: Optional[str]
    location: VenueLocation
    venue_size: int
    max_capacity: int
    amenities: List[AmenityResponse]
    cover_image_url: str
    gallery_images: List[VenueImageResponse]
    virtual_tour_url: Optional[str]
    slots: List[VenueSlotResponse]
    services: List[VenueServiceResponse]
    instant_booking: bool
    status: VenueStatus
    average_rating: float
    total_reviews: int
    view_count: int
    booking_count: int
    is_featured: bool
    verification_status: str
    approved_by: Optional[UUID]
    approved_at: Optional[datetime]
    rejection_reason: Optional[str]
    published_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CreateVenueResponse(BaseModel):
    id: UUID
    venue_name: str
    slug: str
    status: str
    verification_status: str

    model_config = ConfigDict(from_attributes=True)


class UpdateVenueStatusRequest(BaseModel):
    """
    Request to update a venue's verification status.
    """

    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid",
    )

    venue_id: UUID = Field(
        ...,
        description="Unique identifier of the venue.",
        examples=["550e8400-e29b-41d4-a716-446655440000"],
    )

    status: VerificationStatus = Field(
        ...,
        description="New verification status for the venue.",
        examples=["approved"],
    )

    rejection_reason: Optional[str] = Field(
        default=None,
        min_length=5,
        max_length=500,
        description="Reason for rejection or suspension.",
        examples=["Venue ownership documents are invalid."],
    )

    @model_validator(mode="after")
    def validate_rejection_reason(self):
        if (
            self.status
            in (
                VerificationStatus.REJECTED,
                VerificationStatus.SUSPENDED,
            )
            and not self.rejection_reason
        ):
            raise ValueError(
                "Rejection reason is required when rejecting or suspending a venue."
            )

        return self


class UpdateVenueStatusResponse(BaseModel):
    """
    Response returned after updating venue verification status.
    """

    model_config = ConfigDict(
        from_attributes=True,
        extra="forbid",
    )

    venue_id: UUID = Field(
        ...,
        description="Unique identifier of the venue.",
        examples=["550e8400-e29b-41d4-a716-446655440000"],
    )

    verification_status: VerificationStatus = Field(
        ...,
        description="Current verification status of the venue.",
        examples=["approved"],
    )

    approved_by: Optional[UUID] = Field(
        default=None,
        description="Admin ID who approved the venue. Null if not approved.",
        examples=["6a4c4f4d-4f5b-47f0-8b17-18d7d6d9f7c1"],
    )

    approved_at: Optional[datetime] = Field(
        default=None,
        description="Timestamp when the venue was approved.",
        examples=["2026-06-29T10:30:00Z"],
    )

    rejection_reason: Optional[str] = Field(
        default=None,
        description="Reason for rejection or suspension, if applicable.",
        examples=["Venue documents are incomplete."],
    )
