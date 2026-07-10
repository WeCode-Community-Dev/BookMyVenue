import uuid
from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, Field


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
    icon: str | None = None


class AmenityUpdateRequest(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=100)
    icon: str | None = None


class AdminAmenityResponse(BaseModel):
    id: uuid.UUID
    name: str
    icon: str | None
    created_at: datetime
    deleted_at: datetime | None
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
    slug: str = Field(..., min_length=1, max_length=100, pattern=r"^[a-z0-9_]+$")
    label: str = Field(..., min_length=1, max_length=100)
    icon: str | None = None
    sort_order: int = Field(default=0, ge=0)


class CategoryUpdateRequest(BaseModel):
    label: str | None = Field(None, min_length=1, max_length=100)
    icon: str | None = None
    sort_order: int | None = Field(None, ge=0)
    is_active: bool | None = None


class AdminCategoryResponse(BaseModel):
    id: uuid.UUID
    slug: str
    label: str
    icon: str | None
    banner_image: str | None
    is_active: bool
    sort_order: int
    created_at: datetime
    deleted_at: datetime | None
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
    match_source: str | None = None
    match_score: float | None = None


class DeepResearchQuerySummary(BaseModel):
    model_config = {"from_attributes": True}

    id: uuid.UUID
    user_id: uuid.UUID
    query_text: str
    city_filter: str | None = None
    result_count: int
    avg_match_score: float | None = None
    created_at: datetime


class DeepResearchQueryDetail(DeepResearchQuerySummary):
    understanding_json: dict | None = None
    top_results_json: list[DeepResearchTopResult] | None = None


class DeepResearchQueryListResponse(BaseModel):
    items: list[DeepResearchQuerySummary]
    total: int
    page: int
    page_size: int


class DeepResearchStatsResponse(BaseModel):
    labels: list[str]
    query_counts: list[int]
    avg_match_scores: list[float | None]
    total_queries: int
    avg_result_count: float
    avg_match_score_overall: float | None = None


# ─── External reservation admin workflow ──────────────────────────────────────
# Converts a customer's external-venue reservation into an onboarded owner +
# venue + normal Venue404 booking. See docs/Venue404_External_Reservation_Onboarding_PRD.md


class ExternalReservationSummary(BaseModel):
    id: uuid.UUID
    status: str
    lead_name: str
    lead_city: str | None = None
    lead_formatted_address: str | None = None
    lead_category_guess: str | None = None
    lead_cover_photo_url: str | None = None
    lead_phone: str | None = None
    lead_website: str | None = None
    lead_rating: float | None = None
    lead_google_maps_uri: str | None = None
    customer_name: str | None = None
    customer_email: str | None = None
    customer_phone: str | None = None
    customer_notes: str | None = None
    category_id: uuid.UUID | None = None
    category_label: str | None = None
    guest_count: int | None = None
    event_date: str | None = None
    owner_id: uuid.UUID | None = None
    venue_id: uuid.UUID | None = None
    booking_id: uuid.UUID | None = None
    contact_method: str | None = None
    contact_notes: str | None = None
    follow_up_date: str | None = None
    owner_invited_at: datetime | None = None
    booking_created_at: datetime | None = None
    created_at: datetime


class ExternalReservationStats(BaseModel):
    total: int
    new: int
    in_progress: int
    booking_created: int


class ExternalReservationListResponse(BaseModel):
    items: list[ExternalReservationSummary]
    total: int
    page: int
    page_size: int
    total_pages: int
    stats: ExternalReservationStats


class ContactOwnerRequest(BaseModel):
    contact_method: str = Field(..., min_length=1, max_length=100)
    notes: str = ""
    follow_up_date: date | None = None


class MarkInterestedRequest(BaseModel):
    reason: str = ""


class InviteOwnerRequest(BaseModel):
    venue_name: str = Field(..., min_length=1, max_length=200)
    owner_name: str | None = None
    email: str
    phone: str | None = None
    # Fallback only — normally the reservation already has one, picked by the
    # customer at reservation time. Lets an admin fill it in for older
    # reservations created before that field existed.
    category_id: uuid.UUID | None = None


class InviteOwnerResponse(BaseModel):
    # Always populated so the admin can share it manually (WhatsApp, etc.) if
    # email delivery to the owner failed or isn't configured yet.
    action_link: str


class ReservationActionRequest(BaseModel):
    reason: str = ""
