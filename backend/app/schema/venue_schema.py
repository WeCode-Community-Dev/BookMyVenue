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

def validate_slot_duration(category: str, start_time: time, end_time: time) -> None:
    from datetime import datetime, time as dt_time

    start_dt = datetime.combine(datetime.min, start_time)
    end_dt = datetime.combine(datetime.min, end_time)
    duration_hours = (end_dt - start_dt).total_seconds() / 3600.0

    cat = category.lower().strip()

    # 1. Marriage Hall or Auditorium
    if cat in ["marriage_hall", "auditorium"]:
        valid_slots = [
            (dt_time(9, 0), dt_time(15, 0)),  # Morning Session (09:00 AM - 03:00 PM)
            (dt_time(17, 0), dt_time(23, 0)), # Evening Session (05:00 PM - 11:00 PM)
            (dt_time(9, 0), dt_time(23, 0)),  # Full Day (09:00 AM - 11:00 PM)
        ]
        if (start_time, end_time) not in valid_slots:
            raise ValueError(
                f"For {category}, slots must be Morning Session (09:00 AM - 03:00 PM), "
                "Evening Session (05:00 PM - 11:00 PM), or Full Day (09:00 AM - 11:00 PM)."
            )

    # 2. Party Hall -> 2, 4, 6, 8 hours
    elif cat == "party_hall":
        if duration_hours not in [2.0, 4.0, 6.0, 8.0]:
            raise ValueError(f"For Party Hall, slot duration must be exactly 2, 4, 6, or 8 hours (got {duration_hours} hours).")

    # 3. Conference Room -> 2, 4, 6, 8 hours or Full Day (9 AM - 9 PM)
    elif cat == "conference_room":
        is_full_day = (start_time == dt_time(9, 0) and end_time == dt_time(21, 0))
        if duration_hours not in [2.0, 4.0, 6.0, 8.0] and not is_full_day:
            raise ValueError(f"For Conference Room, slot duration must be exactly 2, 4, 6, or 8 hours, or Full Day (09:00 AM - 09:00 PM).")

    # 4. Sports Ground / Arena -> 1, 2, 3 hours
    elif cat in ["sports_arena", "sports_ground"]:
        if duration_hours not in [1.0, 2.0, 3.0]:
            raise ValueError(f"For Sports Ground, slot duration must be exactly 1, 2, or 3 hours (got {duration_hours} hours).")

    # 5. Photography Studio -> 1, 2, 4, 8 hours
    elif cat == "photography_studio":
        if duration_hours not in [1.0, 2.0, 4.0, 8.0]:
            raise ValueError(f"For Photography Studio, slot duration must be exactly 1, 2, 4, or 8 hours (got {duration_hours} hours).")


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
    def validate_venue_data(self) -> "CreateVenueRequest":
        if len(self.gallery_images) > 20:
            raise ValueError("Maximum 20 gallery images allowed.")
        for slot in self.slots:
            validate_slot_duration(self.category, slot.start_time, slot.end_time)
        return self


class VenueSlotResponse(BaseModel):
    id: UUID
    slot_name: str
    start_time: time
    end_time: time
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
    approved_by: Optional[str]
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

    approved_by: Optional[str] = Field(
        default=None,
        description="Admin ID who approved the venue. Null if not approved.",
        examples=["Admin"],
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
