import uuid
from datetime import datetime
from pydantic import BaseModel, Field
from typing import Literal, Optional


class VenueApprovalRequest(BaseModel):
    action: Literal["approve", "reject"]
    reason: str = ""


class UserSummary(BaseModel):
    id: uuid.UUID
    full_name: str | None
    email: str | None
    phone: str | None
    status: str
    roles: list[str]
    created_at: datetime
    is_super_admin: bool

    model_config = {"from_attributes": True}


class UserStats(BaseModel):
    total: int
    active: int
    suspended: int
    pending: int
    rejected: int


class UserListResponse(BaseModel):
    items: list[UserSummary]
    total: int
    page: int
    page_size: int
    total_pages: int
    stats: UserStats


class SuspendUserRequest(BaseModel):
    reason: str


class ReactivateUserRequest(BaseModel):
    reason: str = ""


class AdminActionResponse(BaseModel):
    id: uuid.UUID
    admin_id: uuid.UUID
    admin_name: str | None
    action_type: str
    target_type: str
    target_id: uuid.UUID
    target_name: str | None
    reason: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


class AdminActionListResponse(BaseModel):
    items: list[AdminActionResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class OwnerApprovalRequest(BaseModel):
    reason: str = ""


class OwnerStatsResponse(BaseModel):
    total: int
    pending: int
    active: int
    rejected: int
    suspended: int


class AmenityCreateRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    icon: Optional[str] = None


class AmenityUpdateRequest(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    icon: Optional[str] = None


class AdminAmenityResponse(BaseModel):
    id: uuid.UUID
    name: str
    icon: Optional[str]
    created_at: datetime
    deleted_at: Optional[datetime]
    active_venue_count: int

    model_config = {"from_attributes": True}


class AmenityListResponse(BaseModel):
    items: list[AdminAmenityResponse]
    total: int


class AmenityDeleteResponse(BaseModel):
    deleted: bool
    active_venue_count: int


# ─── Venue category admin schemas ─────────────────────────────────────────────

class CategoryCreateRequest(BaseModel):
    slug: str = Field(..., min_length=1, max_length=100, pattern=r'^[a-z0-9_]+$')
    label: str = Field(..., min_length=1, max_length=100)
    icon: Optional[str] = None
    sort_order: int = Field(default=0, ge=0)


class CategoryUpdateRequest(BaseModel):
    label: Optional[str] = Field(None, min_length=1, max_length=100)
    icon: Optional[str] = None
    sort_order: Optional[int] = Field(None, ge=0)
    is_active: Optional[bool] = None


class AdminCategoryResponse(BaseModel):
    id: uuid.UUID
    slug: str
    label: str
    icon: Optional[str]
    banner_image: Optional[str]
    is_active: bool
    sort_order: int
    created_at: datetime
    deleted_at: Optional[datetime]
    venue_count: int

    model_config = {"from_attributes": True}


class CategoryListResponse(BaseModel):
    items: list[AdminCategoryResponse]
    total: int


class CategoryDeleteResponse(BaseModel):
    deleted: bool
    venue_count: int


class CategoryBannerResponse(BaseModel):
    banner_image: str


# ─── Booking admin schemas ─────────────────────────────────────────────────────

class BookingStatsResponse(BaseModel):
    total: int
    requested: int
    confirmed: int
    completed: int
    cancelled: int


class AdminBookingSummary(BaseModel):
    id: uuid.UUID
    venue_id: uuid.UUID
    venue_name: str
    customer_name: str | None
    customer_email: str | None
    customer_phone: str | None
    owner_id: uuid.UUID
    owner_name: str | None
    owner_email: str | None
    owner_phone: str | None
    status: str
    payment_status: str
    event_date: str
    guest_count: int
    created_at: datetime

    model_config = {"from_attributes": True}


class AdminBookingListResponse(BaseModel):
    items: list[AdminBookingSummary]
    total: int
    page: int
    page_size: int
    total_pages: int
    stats: BookingStatsResponse


# ─── Venue admin schemas ───────────────────────────────────────────────────────

class GrowthStatsResponse(BaseModel):
    labels: list[str]
    users: list[int]
    owners: list[int]
    venues: list[int]
    bookings: list[int]
    totals: dict[str, int]


class VenueStatsResponse(BaseModel):
    total: int
    pending_approval: int
    approved: int
    rejected: int
    suspended: int
    draft: int


class VenueActionRequest(BaseModel):
    reason: str = ""


class AdminVenueOwner(BaseModel):
    id: uuid.UUID
    full_name: str | None
    email: str | None


class AdminVenueItem(BaseModel):
    id: uuid.UUID
    name: str
    slug: str | None
    description: str | None
    category_slug: str
    address_line1: str
    city: str
    state: str
    country: str
    min_capacity: int | None
    max_capacity: int
    open_time: str
    close_time: str
    pricing_mode: str
    starting_price_paise: int | None
    hourly_rate_paise: int | None
    advance_pct: float
    platform_commission_pct: float
    status: str
    is_active: bool
    cover_photo_url: str | None
    amenities: list[str]
    owner: AdminVenueOwner
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class AdminVenueStats(BaseModel):
    total: int
    pending_approval: int
    approved: int
    rejected: int
    suspended: int
    draft: int


class AdminVenueListResponse(BaseModel):
    items: list[AdminVenueItem]
    total: int
    page: int
    page_size: int
    total_pages: int
    stats: AdminVenueStats


# ── Deep Research observability ────────────────────────────────────────────────
# Read-only reporting over app.modules.deep_research.models.DeepResearchQuery.
# No admin_actions audit entries needed here (nothing mutates) — contrast with
# the Phase 3 lead/reservation admin endpoints, which will need audit logging.


class DeepResearchTopResult(BaseModel):
    id: str
    name: str
    match_source: Optional[str] = None
    match_score: Optional[float] = None


class DeepResearchQuerySummary(BaseModel):
    model_config = {"from_attributes": True}

    id: uuid.UUID
    user_id: uuid.UUID
    query_text: str
    city_filter: Optional[str] = None
    result_count: int
    avg_match_score: Optional[float] = None
    created_at: datetime


class DeepResearchQueryDetail(DeepResearchQuerySummary):
    understanding_json: Optional[dict] = None
    top_results_json: Optional[list[DeepResearchTopResult]] = None


class DeepResearchQueryListResponse(BaseModel):
    items: list[DeepResearchQuerySummary]
    total: int
    page: int
    page_size: int


class DeepResearchStatsResponse(BaseModel):
    labels: list[str]
    query_counts: list[int]
    avg_match_scores: list[Optional[float]]
    total_queries: int
    avg_result_count: float
    avg_match_score_overall: Optional[float] = None
