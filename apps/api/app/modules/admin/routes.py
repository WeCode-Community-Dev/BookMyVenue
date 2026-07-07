from uuid import UUID
from fastapi import APIRouter, Depends, Query, UploadFile, File, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.modules.admin.schemas import (
    VenueActionRequest,
    AdminVenueListResponse,
    UserListResponse,
    UserSummary,
    SuspendUserRequest,
    ReactivateUserRequest,
    AdminActionListResponse,
    OwnerApprovalRequest,
    OwnerStatsResponse,
    AmenityCreateRequest,
    AmenityUpdateRequest,
    AdminAmenityResponse,
    AmenityListResponse,
    AmenityDeleteResponse,
    CategoryCreateRequest,
    CategoryUpdateRequest,
    AdminCategoryResponse,
    CategoryListResponse,
    CategoryDeleteResponse,
    CategoryBannerResponse,
    BookingStatsResponse,
    AdminBookingListResponse,
    VenueStatsResponse,
    GrowthStatsResponse,
    DeepResearchQueryDetail,
    DeepResearchQueryListResponse,
    DeepResearchStatsResponse,
    ExternalReservationListResponse,
    ContactOwnerRequest,
    MarkInterestedRequest,
    InviteOwnerRequest,
)
from app.modules.auth.dependencies import require_admin, AuthContext
from app.modules.admin import service
from app.modules.deep_research import service as reservation_service

router = APIRouter()


@router.get("/venues/stats", response_model=VenueStatsResponse)
def get_venue_stats(
    _: AuthContext = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return service.get_venue_stats(db)


@router.get("/venues", response_model=AdminVenueListResponse)
def list_venues(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: str | None = Query(None, pattern="^(draft|pending_approval|approved|rejected|suspended)$"),
    search: str | None = Query(None),
    _: AuthContext = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return service.list_admin_venues(db, status=status, search=search, page=page, page_size=page_size)


@router.patch("/venues/{venue_id}/approve", status_code=204)
def approve_venue(
    venue_id: UUID,
    body: VenueActionRequest,
    auth: AuthContext = Depends(require_admin),
    db: Session = Depends(get_db),
):
    service.approve_venue(db, admin_id=auth.user_id, venue_id=venue_id, reason=body.reason)


@router.patch("/venues/{venue_id}/reject", status_code=204)
def reject_venue(
    venue_id: UUID,
    body: VenueActionRequest,
    auth: AuthContext = Depends(require_admin),
    db: Session = Depends(get_db),
):
    service.reject_venue(db, admin_id=auth.user_id, venue_id=venue_id, reason=body.reason)


@router.patch("/venues/{venue_id}/suspend", status_code=204)
def suspend_venue(
    venue_id: UUID,
    body: VenueActionRequest,
    auth: AuthContext = Depends(require_admin),
    db: Session = Depends(get_db),
):
    service.suspend_venue(db, admin_id=auth.user_id, venue_id=venue_id, reason=body.reason)


@router.patch("/venues/{venue_id}/reactivate", status_code=204)
def reactivate_venue(
    venue_id: UUID,
    body: VenueActionRequest,
    auth: AuthContext = Depends(require_admin),
    db: Session = Depends(get_db),
):
    service.reactivate_venue(db, admin_id=auth.user_id, venue_id=venue_id, reason=body.reason)


@router.get("/users", response_model=UserListResponse)
def list_users(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: str | None = Query(None),
    status: str | None = Query(None, pattern="^(active|suspended|pending|rejected)$"),
    role: str | None = Query(None, pattern="^(customer|venue_owner|super_admin)$"),
    _: AuthContext = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return service.list_users(
        db,
        page=page,
        page_size=page_size,
        search=search,
        status=status,
        role=role,
    )


@router.get("/users/{user_id}", response_model=UserSummary)
def get_user(
    user_id: UUID,
    _: AuthContext = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return service.get_user(db, user_id)


@router.patch("/users/{user_id}/suspend", status_code=204)
def suspend_user(
    user_id: UUID,
    body: SuspendUserRequest,
    auth: AuthContext = Depends(require_admin),
    db: Session = Depends(get_db),
):
    service.suspend_user(db, admin_id=auth.user_id, user_id=user_id, reason=body.reason)


@router.patch("/users/{user_id}/reactivate", status_code=204)
def reactivate_user(
    user_id: UUID,
    body: ReactivateUserRequest,
    auth: AuthContext = Depends(require_admin),
    db: Session = Depends(get_db),
):
    service.reactivate_user(db, admin_id=auth.user_id, user_id=user_id, reason=body.reason)


@router.get("/venue-owners/stats", response_model=OwnerStatsResponse)
def get_owner_stats(
    _: AuthContext = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return service.get_owner_stats(db)


@router.patch("/venue-owners/{user_id}/approve", status_code=204)
def approve_owner(
    user_id: UUID,
    body: OwnerApprovalRequest,
    auth: AuthContext = Depends(require_admin),
    db: Session = Depends(get_db),
):
    service.approve_owner(db, admin_id=auth.user_id, user_id=user_id, reason=body.reason)


@router.patch("/venue-owners/{user_id}/reject", status_code=204)
def reject_owner(
    user_id: UUID,
    body: OwnerApprovalRequest,
    auth: AuthContext = Depends(require_admin),
    db: Session = Depends(get_db),
):
    service.reject_owner(db, admin_id=auth.user_id, user_id=user_id, reason=body.reason)


@router.get("/actions", response_model=AdminActionListResponse)
def list_actions(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    target_type: str | None = Query(None, pattern="^(user|venue|booking|amenity|external_reservation)$"),
    action_type: str | None = Query(None),
    # Legacy convenience: limit=N returns N items on page 1 (used by dashboard)
    limit: int | None = Query(None, ge=1, le=100),
    _: AuthContext = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return service.list_actions(
        db, page=page, page_size=page_size,
        target_type=target_type, action_type=action_type, limit=limit,
    )


@router.get("/amenities", response_model=AmenityListResponse)
def list_amenities(
    include_deleted: bool = Query(False),
    _: AuthContext = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return service.list_amenities(db, include_deleted=include_deleted)


@router.post("/amenities", response_model=AdminAmenityResponse, status_code=201)
def create_amenity(
    body: AmenityCreateRequest,
    auth: AuthContext = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return service.create_amenity(db, admin_id=auth.user_id, name=body.name, icon=body.icon)


@router.patch("/amenities/{amenity_id}", response_model=AdminAmenityResponse)
def update_amenity(
    amenity_id: UUID,
    body: AmenityUpdateRequest,
    auth: AuthContext = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return service.update_amenity(db, admin_id=auth.user_id, amenity_id=amenity_id, body=body)


@router.delete("/amenities/{amenity_id}", response_model=AmenityDeleteResponse)
def delete_amenity(
    amenity_id: UUID,
    auth: AuthContext = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return service.delete_amenity(db, admin_id=auth.user_id, amenity_id=amenity_id)


# ── Category routes ────────────────────────────────────────────────────────────

@router.get("/categories", response_model=CategoryListResponse)
def list_categories(
    include_deleted: bool = Query(False),
    _: AuthContext = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return service.list_categories(db, include_deleted=include_deleted)


@router.post("/categories", response_model=AdminCategoryResponse, status_code=201)
def create_category(
    body: CategoryCreateRequest,
    auth: AuthContext = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return service.create_category(
        db,
        admin_id=auth.user_id,
        slug=body.slug,
        label=body.label,
        icon=body.icon,
        sort_order=body.sort_order,
    )


@router.patch("/categories/{category_id}", response_model=AdminCategoryResponse)
def update_category(
    category_id: UUID,
    body: CategoryUpdateRequest,
    auth: AuthContext = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return service.update_category(db, admin_id=auth.user_id, category_id=category_id, body=body)


@router.post("/categories/{category_id}/banner-image", response_model=CategoryBannerResponse)
async def upload_category_banner(
    category_id: UUID,
    file: UploadFile = File(...),
    auth: AuthContext = Depends(require_admin),
    db: Session = Depends(get_db),
):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    file_bytes = await file.read()
    return service.upload_category_banner(db, admin_id=auth.user_id, category_id=category_id, file_bytes=file_bytes)


@router.delete("/categories/{category_id}/banner-image", response_model=CategoryBannerResponse)
def delete_category_banner(
    category_id: UUID,
    auth: AuthContext = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return service.delete_category_banner(db, admin_id=auth.user_id, category_id=category_id)


@router.delete("/categories/{category_id}", response_model=CategoryDeleteResponse)
def delete_category(
    category_id: UUID,
    auth: AuthContext = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return service.delete_category(db, admin_id=auth.user_id, category_id=category_id)


# ─── Booking routes ────────────────────────────────────────────────────────────

@router.get("/bookings/stats", response_model=BookingStatsResponse)
def get_booking_stats(
    _: AuthContext = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return service.get_booking_stats(db)


@router.get("/bookings", response_model=AdminBookingListResponse)
def list_bookings(
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=100),
    status: str | None = Query(None),
    search: str | None = Query(None),
    _: AuthContext = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return service.list_admin_bookings(db, status=status, search=search, page=page, page_size=page_size)


@router.get("/growth-stats", response_model=GrowthStatsResponse)
def get_growth_stats(
    period: str = Query("6m", pattern="^(7d|30d|3m|6m|12m)$"),
    _: AuthContext = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return service.get_growth_stats(db, period=period)


# ─── Deep Research observability ───────────────────────────────────────────────

@router.get("/deep-research/stats", response_model=DeepResearchStatsResponse)
def get_deep_research_stats(
    days: int = Query(30, ge=1, le=90),
    _: AuthContext = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return service.get_deep_research_stats(db, days=days)


@router.get("/deep-research/queries", response_model=DeepResearchQueryListResponse)
def list_deep_research_queries(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: str | None = Query(None),
    _: AuthContext = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return service.list_deep_research_queries(db, page=page, page_size=page_size, search=search)


@router.get("/deep-research/queries/{query_id}", response_model=DeepResearchQueryDetail)
def get_deep_research_query(
    query_id: UUID,
    _: AuthContext = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return service.get_deep_research_query(db, query_id)


# ─── External reservation admin workflow ───────────────────────────────────────
# See docs/Venue404_External_Reservation_Onboarding_PRD.md

@router.get("/external-reservations", response_model=ExternalReservationListResponse)
def list_external_reservations(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: str | None = Query(None),
    _: AuthContext = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return reservation_service.list_external_reservations(db, status=status, page=page, page_size=page_size)


@router.patch("/external-reservations/{reservation_id}/contact", status_code=204)
def contact_external_reservation(
    reservation_id: UUID,
    body: ContactOwnerRequest,
    auth: AuthContext = Depends(require_admin),
    db: Session = Depends(get_db),
):
    reservation_service.contact_reservation(
        db, admin_id=auth.user_id, reservation_id=reservation_id,
        contact_method=body.contact_method, notes=body.notes, follow_up_date=body.follow_up_date,
    )


@router.patch("/external-reservations/{reservation_id}/mark-interested", status_code=204)
def mark_external_reservation_interested(
    reservation_id: UUID,
    body: MarkInterestedRequest,
    auth: AuthContext = Depends(require_admin),
    db: Session = Depends(get_db),
):
    reservation_service.mark_owner_interested(db, admin_id=auth.user_id, reservation_id=reservation_id, reason=body.reason)


@router.post("/external-reservations/{reservation_id}/invite-owner", status_code=204)
def invite_owner_for_external_reservation(
    reservation_id: UUID,
    body: InviteOwnerRequest,
    auth: AuthContext = Depends(require_admin),
    db: Session = Depends(get_db),
):
    reservation_service.invite_owner_for_reservation(
        db, admin_id=auth.user_id, reservation_id=reservation_id,
        venue_name=body.venue_name, owner_name=body.owner_name, email=body.email, phone=body.phone,
        category_id=body.category_id,
    )


@router.post("/external-reservations/{reservation_id}/create-booking", status_code=204)
def create_booking_for_external_reservation(
    reservation_id: UUID,
    auth: AuthContext = Depends(require_admin),
    db: Session = Depends(get_db),
):
    reservation_service.create_booking_for_reservation(db, admin_id=auth.user_id, reservation_id=reservation_id)
