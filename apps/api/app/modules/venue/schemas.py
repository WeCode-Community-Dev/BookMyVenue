from pydantic import BaseModel, field_validator, Field
from uuid import UUID
from datetime import datetime, date, time
from typing import Optional
from decimal import Decimal
from enum import Enum



class BookingType(str, Enum):
    full_day = "full_day"
    time_slot = "time_slot"


class PricingMode(str, Enum):
    flat = "flat"
    hourly = "hourly"
    mixed = "mixed"


class VenueStatus(str, Enum):
    draft = "draft"
    pending_approval = "pending_approval"
    approved = "approved"
    rejected = "rejected"
    suspended = "suspended"


class VenueCategoryResponse(BaseModel):
    id: UUID
    slug: str
    label: str
    icon: Optional[str] = None
    banner_image: Optional[str] = None
    is_active: bool
    sort_order: int

    model_config = {"from_attributes": True}


class VenuePhotoResponse(BaseModel):
    id: UUID
    venue_id: UUID
    image_url: str
    sort_order: int
    is_cover: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class AmenityResponse(BaseModel):
    id: UUID
    name: str
    icon: Optional[str] = None

    model_config = {"from_attributes": True}


class CancellationPolicyResponse(BaseModel):
    tier_1_hours: Optional[int] = None
    tier_1_refund_pct: Optional[Decimal] = None
    tier_2_hours: Optional[int] = None
    tier_2_refund_pct: Optional[Decimal] = None
    tier_3_hours: Optional[int] = None
    tier_3_refund_pct: Optional[Decimal] = None
    no_show_refund_pct: Decimal
    platform_fee_refundable: bool
    notes: Optional[str] = None

    model_config = {"from_attributes": True}

class UpdateCancellationPolicyRequest(BaseModel):
    tier_1_hours: Optional[int] = Field(default=None, gt=0)
    tier_1_refund_pct: Optional[Decimal] = Field(default=None, ge=0, le=100)
    tier_2_hours: Optional[int] = Field(default=None, gt=0)
    tier_2_refund_pct: Optional[Decimal] = Field(default=None, ge=0, le=100)
    tier_3_hours: Optional[int] = Field(default=None, gt=0)
    tier_3_refund_pct: Optional[Decimal] = Field(default=None, ge=0, le=100)
    no_show_refund_pct: Decimal = Field(default=Decimal("0.00"), ge=0, le=100)
    platform_fee_refundable: bool = False
    notes: Optional[str] = None

    def model_post_init(self, __context) -> None:
        if (self.tier_1_hours is None) != (self.tier_1_refund_pct is None):
            raise ValueError("tier_1_hours and tier_1_refund_pct must be both set or both null")
        if (self.tier_2_hours is None) != (self.tier_2_refund_pct is None):
            raise ValueError("tier_2_hours and tier_2_refund_pct must be both set or both null")
        if (self.tier_3_hours is None) != (self.tier_3_refund_pct is None):
            raise ValueError("tier_3_hours and tier_3_refund_pct must be both set or both null")

        if self.tier_1_hours is not None and self.tier_2_hours is not None:
            if self.tier_1_hours <= self.tier_2_hours:
                raise ValueError("tier_1_hours must be strictly greater than tier_2_hours")
        if self.tier_2_hours is not None and self.tier_3_hours is not None:
            if self.tier_2_hours <= self.tier_3_hours:
                raise ValueError("tier_2_hours must be strictly greater than tier_3_hours")


class UpdateVenueAmenitiesRequest(BaseModel):
    amenity_ids: list[UUID]


class UpdateVenuePhotoItem(BaseModel):
    photo_id: UUID
    sort_order: int
    is_cover: bool

class BulkUpdateVenuePhotosRequest(BaseModel):
    photos: list[UpdateVenuePhotoItem]


from typing import Any
from pydantic import model_validator

class VenueListResponse(BaseModel):
    id: UUID
    name: str
    slug: Optional[str] = None
    city: str
    max_capacity: int
    status: VenueStatus
    is_active: bool
    category_name: str
    cover_photo_url: Optional[str] = None
    last_completed_step: Optional[int] = Field(default=0, ge=0)

    @model_validator(mode="before")
    @classmethod
    def flatten_nested(cls, data: Any) -> Any:
        if isinstance(data, dict):
            return data
        
        result = {
            "id": data.id,
            "name": data.name,
            "slug": data.slug,
            "city": data.city,
            "max_capacity": data.max_capacity,
            "status": data.status,
            "is_active": data.is_active,
            "last_completed_step": data.last_completed_step,
        }

        category = getattr(data, 'category', None)
        result["category_name"] = category.label if category else "Uncategorized"

        photos = getattr(data, 'photos', [])
        if photos:
            cover = next((p for p in photos if p.is_cover), photos[0])
            result["cover_photo_url"] = cover.image_url
        else:
            result["cover_photo_url"] = None

        return result

class VenueStatsResponse(BaseModel):
    active_bookings: int
    revenue_this_month_paise: int

class VenueResponse(BaseModel):
    id: UUID
    owner_id: UUID

    
    name: str
    slug: Optional[str] = None
    description: Optional[str] = None
    category: VenueCategoryResponse


    address_line1: str
    address_line2: Optional[str] = None
    city: str
    state: str
    country: str
    postal_code: Optional[str] = None
    latitude: Optional[Decimal] = None
    longitude: Optional[Decimal] = None
    timezone: str

    
    min_capacity: Optional[int] = None
    max_capacity: int

    
    open_time: time
    close_time: time
    spans_next_day: bool

    
    allowed_booking_types: list[BookingType]
    min_booking_duration_minutes: int
    max_booking_duration_minutes: int
    slot_interval_minutes: int

    
    pre_buffer_minutes: int
    post_buffer_minutes: int

    
    pricing_mode: PricingMode
    starting_price_paise: Optional[int] = None     
    hourly_rate_paise: Optional[int] = None   

    
    platform_commission_pct: Decimal

    
    advance_pct: Decimal
    balance_due_days_before_event: int
    owner_action_window_hours: int
    overdue_advance_refund_pct: Decimal

    min_price_pct: Decimal
    max_price_pct: Decimal
    display_price_min_paise: Optional[int] = None
    display_price_max_paise: Optional[int] = None


    status: VenueStatus
    is_active: bool

    
    created_at: datetime
    updated_at: datetime

    last_completed_step: int

    
    photos: list[VenuePhotoResponse] = Field(default_factory=list)
    amenities: list[AmenityResponse] = Field(default_factory=list)
    cancellation_policy: Optional[CancellationPolicyResponse] = None

    model_config = {"from_attributes": True}


class DeleteResponse(BaseModel):
    id: UUID
    deleted: bool = True
    message: str = "Venue deleted successfully"


class CreateVenueRequest(BaseModel):

    name: str
    description: Optional[str] = None
    category_id: UUID

    
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    state: str
    country: str = "India"
    postal_code: Optional[str] = None
    latitude: Optional[Decimal] = None
    longitude: Optional[Decimal] = None
    timezone: str = "Asia/Kolkata"

    
    min_capacity: Optional[int] = Field(default=None, gt=0)
    max_capacity: int = Field(gt=0)

    
    open_time: time
    close_time: time
    spans_next_day: bool = False

    
    allowed_booking_types: list[BookingType] = Field(default_factory=lambda: [BookingType.full_day, BookingType.time_slot])
    min_booking_duration_minutes: int = Field(default=60, gt=0)
    max_booking_duration_minutes: int = Field(default=1440, gt=0)
    slot_interval_minutes: int = Field(default=30, gt=0)

    
    pre_buffer_minutes: int = Field(default=0, ge=0)
    post_buffer_minutes: int = Field(default=0, ge=0)

    
    pricing_mode: PricingMode = PricingMode.flat
    starting_price_paise: Optional[int] = Field(default=None, ge=0)
    hourly_rate_paise: Optional[int] = Field(default=None, ge=0)

    
    advance_pct: Decimal = Field(default=Decimal("30.00"), gt=0, le=100)
    balance_due_days_before_event: int = Field(default=7, gt=0)
    owner_action_window_hours: int = Field(default=48, ge=24, le=72)
    overdue_advance_refund_pct: Decimal = Field(default=Decimal("0.00"), ge=0, le=100)

    min_price_pct: Decimal = Field(default=Decimal("50.00"), gt=0, le=100)
    max_price_pct: Decimal = Field(default=Decimal("200.00"), ge=100, le=500)

    cancellation_policy: Optional[UpdateCancellationPolicyRequest] = None
    amenity_ids: Optional[list[UUID]] = None

    last_completed_step: Optional[int] = Field(default=0, ge=0)

    @field_validator("allowed_booking_types")
    @classmethod
    def validate_booking_types(cls, v: list[BookingType]) -> list[BookingType]:
        if not v:
            raise ValueError("allowed_booking_types cannot be empty")
        if len(v) != len(set(v)):
            raise ValueError("Duplicate booking types are not allowed")
        return v

    def model_post_init(self, __context) -> None:
        has_full_day = BookingType.full_day in self.allowed_booking_types
        has_time_slot = BookingType.time_slot in self.allowed_booking_types

        if has_full_day and has_time_slot:
            if self.pricing_mode != PricingMode.mixed:
                raise ValueError("pricing_mode must be 'mixed' when both full_day and time_slot are allowed")
        elif has_full_day:
            if self.pricing_mode != PricingMode.flat:
                raise ValueError("pricing_mode must be 'flat' when only full_day is allowed")
        elif has_time_slot:
            if self.pricing_mode != PricingMode.hourly:
                raise ValueError("pricing_mode must be 'hourly' when only time_slot is allowed")

        if self.pricing_mode == PricingMode.flat:
            if self.starting_price_paise is None:
                raise ValueError("starting_price_paise is required when pricing_mode is 'flat'")
            if self.hourly_rate_paise is not None:
                raise ValueError("hourly_rate_paise must be null when pricing_mode is 'flat'")
        elif self.pricing_mode == PricingMode.hourly:
            if self.hourly_rate_paise is None:
                raise ValueError("hourly_rate_paise is required when pricing_mode is 'hourly'")
            if self.starting_price_paise is not None:
                raise ValueError("starting_price_paise must be null when pricing_mode is 'hourly'")
        elif self.pricing_mode == PricingMode.mixed:
            if self.starting_price_paise is None or self.hourly_rate_paise is None:
                raise ValueError("Both starting_price_paise and hourly_rate_paise are required when pricing_mode is 'mixed'")

        
        if (
            self.min_capacity is not None
            and self.min_capacity > self.max_capacity
        ):
            raise ValueError("min_capacity cannot exceed max_capacity")

        
        if self.min_booking_duration_minutes > self.max_booking_duration_minutes:
            raise ValueError(
                "min_booking_duration_minutes cannot exceed max_booking_duration_minutes"
            )

        if not self.spans_next_day and self.close_time <= self.open_time:
            raise ValueError("close_time must be after open_time unless spans_next_day is true")

        if self.min_price_pct > self.max_price_pct:
            raise ValueError("min_price_pct cannot exceed max_price_pct")


class UpdateVenueRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[UUID] = None

    address_line1: Optional[str] = None
    address_line2: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    postal_code: Optional[str] = None
    latitude: Optional[Decimal] = None
    longitude: Optional[Decimal] = None
    timezone: Optional[str] = None

    min_capacity: Optional[int] = Field(default=None, gt=0)
    max_capacity: Optional[int] = Field(default=None, gt=0)

    open_time: Optional[time] = None
    close_time: Optional[time] = None
    spans_next_day: Optional[bool] = None

    allowed_booking_types: Optional[list[BookingType]] = None
    min_booking_duration_minutes: Optional[int] = Field(default=None, gt=0)
    max_booking_duration_minutes: Optional[int] = Field(default=None, gt=0)
    slot_interval_minutes: Optional[int] = Field(default=None, gt=0)

    pre_buffer_minutes: Optional[int] = Field(default=None, ge=0)
    post_buffer_minutes: Optional[int] = Field(default=None, ge=0)

    pricing_mode: Optional[PricingMode] = None
    starting_price_paise: Optional[int] = Field(default=None, ge=0)
    hourly_rate_paise: Optional[int] = Field(default=None, ge=0)

    advance_pct: Optional[Decimal] = Field(default=None, gt=0, le=100)
    balance_due_days_before_event: Optional[int] = Field(default=None, gt=0)
    owner_action_window_hours: Optional[int] = Field(default=None, ge=24, le=72)
    overdue_advance_refund_pct: Optional[Decimal] = Field(default=None, ge=0, le=100)

    min_price_pct: Optional[Decimal] = Field(default=None, gt=0, le=100)
    max_price_pct: Optional[Decimal] = Field(default=None, ge=100, le=500)

    last_completed_step: Optional[int] = None

    @field_validator("allowed_booking_types")
    @classmethod
    def validate_booking_types(cls, v: Optional[list[BookingType]]) -> Optional[list[BookingType]]:
        if v is not None:
            if not v:
                raise ValueError("allowed_booking_types cannot be empty if provided")
            if len(v) != len(set(v)):
                raise ValueError("Duplicate booking types are not allowed")
        return v

    def model_post_init(self, __context) -> None:
        if self.allowed_booking_types is not None and self.pricing_mode is not None:
            has_full_day = BookingType.full_day in self.allowed_booking_types
            has_time_slot = BookingType.time_slot in self.allowed_booking_types

            if has_full_day and has_time_slot:
                if self.pricing_mode != PricingMode.mixed:
                    raise ValueError("pricing_mode must be 'mixed' when both full_day and time_slot are allowed")
            elif has_full_day:
                if self.pricing_mode != PricingMode.flat:
                    raise ValueError("pricing_mode must be 'flat' when only full_day is allowed")
            elif has_time_slot:
                if self.pricing_mode != PricingMode.hourly:
                    raise ValueError("pricing_mode must be 'hourly' when only time_slot is allowed")

        if self.pricing_mode == PricingMode.flat and self.hourly_rate_paise is not None:
             raise ValueError("hourly_rate_paise must be null when pricing_mode is 'flat'")
        if self.pricing_mode == PricingMode.hourly and self.starting_price_paise is not None:
             raise ValueError("starting_price_paise must be null when pricing_mode is 'hourly'")

        if (
            self.min_capacity is not None
            and self.max_capacity is not None
            and self.min_capacity > self.max_capacity
        ):
            raise ValueError("min_capacity cannot exceed max_capacity")

        if (
            self.min_booking_duration_minutes is not None
            and self.max_booking_duration_minutes is not None
            and self.min_booking_duration_minutes > self.max_booking_duration_minutes
        ):
            raise ValueError(
                "min_booking_duration_minutes cannot exceed max_booking_duration_minutes"
            )

        if self.open_time is not None and self.close_time is not None:
            spans_next = self.spans_next_day if self.spans_next_day is not None else False
            if not spans_next and self.close_time <= self.open_time:
                raise ValueError("close_time must be after open_time unless spans_next_day is true")

        if (
            self.min_price_pct is not None
            and self.max_price_pct is not None
            and self.min_price_pct > self.max_price_pct
        ):
            raise ValueError("min_price_pct cannot exceed max_price_pct")


class PricingDisplay(BaseModel):
    quoted_price: str
    advance_due: str
    balance_due: str
    platform_fee: str
    owner_payout: str


class PricingBreakdownItem(BaseModel):
    period_date: date
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    base_paise: int
    applied_rule_id: Optional[UUID] = None
    applied_rule_name: Optional[str] = None
    clamped: bool
    final_paise: int


class PricingPreviewResponse(BaseModel):
    pricing_mode: PricingMode
    quoted_price_paise: int
    platform_commission_pct: float
    platform_fee_paise: int
    owner_payout_paise: int
    advance_pct: float
    advance_due_paise: int
    balance_due_paise: int
    display: PricingDisplay
    breakdown: list[PricingBreakdownItem] = Field(default_factory=list)
    clamped: bool = False


# ─── Search Result (used by search module) ────────────────────────────────────

class VenueSearchResult(BaseModel):
    id: UUID
    name: str
    slug: Optional[str] = None
    category: VenueCategoryResponse
    city: str
    state: str
    max_capacity: int
    pricing_mode: PricingMode
    starting_price_paise: Optional[int] = None
    hourly_rate_paise: Optional[int] = None
    cover_photo_url: Optional[str] = None
    status: VenueStatus

    model_config = {"from_attributes": True}


class VenueAvailabilityResponse(BaseModel):
    day_of_week: int = Field(ge=0, le=6)
    is_available: bool
    opens_at: Optional[time] = None
    closes_at: Optional[time] = None
    spans_next_day: bool

    model_config = {"from_attributes": True}

class VenueAvailabilityUpdate(BaseModel):
    day_of_week: int = Field(ge=0, le=6)
    is_available: bool
    opens_at: Optional[time] = None
    closes_at: Optional[time] = None
    spans_next_day: bool = False

    def model_post_init(self, __context) -> None:
        if self.is_available:
            if self.opens_at is None or self.closes_at is None:
                raise ValueError("opens_at and closes_at are required when is_available is true")
            if not self.spans_next_day and self.closes_at <= self.opens_at:
                raise ValueError("closes_at must be after opens_at unless spans_next_day is true")

class BulkUpdateAvailabilityRequest(BaseModel):
    availabilities: list[VenueAvailabilityUpdate]

    @field_validator("availabilities")
    @classmethod
    def validate_unique_days(cls, v: list[VenueAvailabilityUpdate]) -> list[VenueAvailabilityUpdate]:
        days = [item.day_of_week for item in v]
        if len(days) != len(set(days)):
            raise ValueError("Duplicate day_of_week entries are not allowed")
        return v


class PublicVenueBlockedDateResponse(BaseModel):
    id: UUID
    venue_id: UUID
    starts_at: datetime
    ends_at: datetime

    model_config = {"from_attributes": True}


class VenueBlockedDateResponse(BaseModel):
    id: UUID
    venue_id: UUID
    starts_at: datetime
    ends_at: datetime
    reason: Optional[str] = None
    blocked_by: UUID
    created_at: datetime

    model_config = {"from_attributes": True}

class CreateBlockedDateRequest(BaseModel):
    starts_at: datetime
    ends_at: datetime
    reason: Optional[str] = None

    def model_post_init(self, __context) -> None:
        if self.ends_at <= self.starts_at:
            raise ValueError("ends_at must be strictly after starts_at")


class PricingRuleAdjustmentType(str, Enum):
    multiplier = "multiplier"
    fixed_delta = "fixed_delta"
    override = "override"


class PricingRuleAppliesTo(str, Enum):
    full_day = "full_day"
    time_slot = "time_slot"
    both = "both"


MAX_ACTIVE_PRICING_RULES_PER_VENUE = 20


class VenuePricingRuleResponse(BaseModel):
    id: UUID
    venue_id: UUID
    name: str
    days_of_week: Optional[list[int]] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    adjustment_type: PricingRuleAdjustmentType
    multiplier: Optional[Decimal] = None
    amount_paise: Optional[int] = None
    applies_to: PricingRuleAppliesTo
    priority: int
    source: str
    is_active: bool
    created_at: datetime
    updated_at: datetime
    exceeds_bounds: bool = False

    model_config = {"from_attributes": True}


class CreatePricingRuleRequest(BaseModel):
    name: str = Field(min_length=1)
    days_of_week: Optional[list[int]] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    adjustment_type: PricingRuleAdjustmentType = PricingRuleAdjustmentType.multiplier
    multiplier: Optional[Decimal] = Field(default=None, gt=0)
    amount_paise: Optional[int] = None
    applies_to: PricingRuleAppliesTo = PricingRuleAppliesTo.both
    priority: int = 0
    is_active: bool = True

    def model_post_init(self, __context) -> None:
        if self.days_of_week is not None:
            if not self.days_of_week:
                raise ValueError("days_of_week cannot be empty if provided")
            if any(d < 0 or d > 6 for d in self.days_of_week):
                raise ValueError("days_of_week values must be between 0 (Mon) and 6 (Sun)")

        if self.start_date is not None and self.end_date is not None and self.start_date > self.end_date:
            raise ValueError("start_date cannot be after end_date")

        if self.adjustment_type == PricingRuleAdjustmentType.multiplier:
            if self.multiplier is None:
                raise ValueError("multiplier is required when adjustment_type is 'multiplier'")
            if self.amount_paise is not None:
                raise ValueError("amount_paise must be null when adjustment_type is 'multiplier'")
        else:
            if self.amount_paise is None:
                raise ValueError("amount_paise is required when adjustment_type is 'fixed_delta' or 'override'")
            if self.multiplier is not None:
                raise ValueError("multiplier must be null when adjustment_type is not 'multiplier'")
            if self.adjustment_type == PricingRuleAdjustmentType.override and self.amount_paise < 0:
                raise ValueError("amount_paise must be >= 0 when adjustment_type is 'override'")


class UpdatePricingRuleRequest(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1)
    days_of_week: Optional[list[int]] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    adjustment_type: Optional[PricingRuleAdjustmentType] = None
    multiplier: Optional[Decimal] = Field(default=None, gt=0)
    amount_paise: Optional[int] = None
    applies_to: Optional[PricingRuleAppliesTo] = None
    priority: Optional[int] = None
    is_active: Optional[bool] = None

    def model_post_init(self, __context) -> None:
        if self.days_of_week is not None:
            if not self.days_of_week:
                raise ValueError("days_of_week cannot be empty if provided")
            if any(d < 0 or d > 6 for d in self.days_of_week):
                raise ValueError("days_of_week values must be between 0 (Mon) and 6 (Sun)")

        if self.start_date is not None and self.end_date is not None and self.start_date > self.end_date:
            raise ValueError("start_date cannot be after end_date")


class PricingQuote(BaseModel):
    quoted_price_paise: int

    platform_commission_pct: float
    platform_fee_paise: int

    owner_payout_paise: int

    advance_pct: float
    advance_due_paise: int
    balance_due_paise: int

    pricing_mode: str

    breakdown: list[PricingBreakdownItem] = Field(default_factory=list)
    clamped: bool = False
