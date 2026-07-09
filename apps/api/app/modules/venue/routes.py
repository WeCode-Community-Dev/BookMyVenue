from uuid import UUID
from datetime import datetime
from fastapi import APIRouter, Depends, Query, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.modules.auth.dependencies import (
    require_owner,
    require_auth,
    get_current_user_optional,
    AuthContext,
)
from app.modules.venue.schemas import (
    VenueResponse,
    VenueListResponse,
    VenueStatsResponse,
    VenueCategoryResponse,
    CreateVenueRequest,
    UpdateVenueRequest,
    PricingPreviewResponse,
    DeleteResponse,
    VenueAvailabilityResponse,
    BulkUpdateAvailabilityRequest,
    VenueBlockedDateResponse,
    CreateBlockedDateRequest,
    CancellationPolicyResponse,
    UpdateCancellationPolicyRequest,
    AmenityResponse,
    UpdateVenueAmenitiesRequest,
    BookingType,
    PublicVenueBlockedDateResponse,
    VenuePhotoResponse,
    BulkUpdateVenuePhotosRequest,
    VenuePricingRuleResponse,
    CreatePricingRuleRequest,
    UpdatePricingRuleRequest,
)
from app.modules.venue import service
from app.modules.booking import service as booking_service
from app.modules.booking.schemas import BookingOut
from app.shared.utils import parse_timezone_datetime

router = APIRouter()


#  Owner routes


@router.get("/my/venues", response_model=list[VenueListResponse])
def list_my_venues(
    auth: AuthContext = Depends(require_owner),
    db: Session = Depends(get_db),
):

    return service.list_owner_venues(db, owner_id=auth.user_id)


@router.get("/my/venues/{venue_id}", response_model=VenueResponse)
def get_my_venue(
    venue_id: UUID,
    auth: AuthContext = Depends(require_owner),
    db: Session = Depends(get_db),
):
    venue = service.get_owner_venue(db, venue_id=venue_id, owner_id=auth.user_id)
    return service._enrich_venue_with_ratings(db, venue)


@router.get("/my/venues/{venue_id}/stats", response_model=VenueStatsResponse)
def get_my_venue_stats(
    venue_id: UUID,
    auth: AuthContext = Depends(require_owner),
    db: Session = Depends(get_db),
):
    return service.get_venue_stats_this_month(
        db, venue_id=venue_id, owner_id=auth.user_id
    )


@router.post("/", response_model=VenueResponse, status_code=201)
def create_venue(
    body: CreateVenueRequest,
    auth: AuthContext = Depends(require_owner),
    db: Session = Depends(get_db),
):

    return service.create_venue(db, owner_id=auth.user_id, body=body)


@router.patch("/{venue_id}", response_model=VenueResponse)
def update_venue(
    venue_id: UUID,
    body: UpdateVenueRequest,
    auth: AuthContext = Depends(require_owner),
    db: Session = Depends(get_db),
):

    return service.update_venue(db, venue_id=venue_id, owner_id=auth.user_id, body=body)


@router.delete("/{venue_id}", response_model=DeleteResponse, status_code=200)
def delete_venue(
    venue_id: UUID,
    auth: AuthContext = Depends(require_owner),
    db: Session = Depends(get_db),
):

    service.delete_venue(db, venue_id=venue_id, owner_id=auth.user_id)
    return DeleteResponse(id=venue_id)


@router.post("/{venue_id}/submit", response_model=VenueResponse)
def submit_venue(
    venue_id: UUID,
    auth: AuthContext = Depends(require_owner),
    db: Session = Depends(get_db),
):
    return service.submit_venue(db, venue_id=venue_id, owner_id=auth.user_id)


@router.put("/{venue_id}/availability", response_model=list[VenueAvailabilityResponse])
def bulk_update_availability(
    venue_id: UUID,
    body: BulkUpdateAvailabilityRequest,
    auth: AuthContext = Depends(require_owner),
    db: Session = Depends(get_db),
):
    return service.bulk_update_availability(
        db, venue_id, auth.user_id, body.availabilities
    )


@router.post(
    "/{venue_id}/blocked-dates",
    response_model=VenueBlockedDateResponse,
    status_code=201,
)
def create_blocked_date(
    venue_id: UUID,
    body: CreateBlockedDateRequest,
    auth: AuthContext = Depends(require_owner),
    db: Session = Depends(get_db),
):
    return service.create_blocked_date(db, venue_id, auth.user_id, body)


@router.delete(
    "/{venue_id}/blocked-dates/{blocked_id}",
    response_model=DeleteResponse,
    status_code=200,
)
def delete_blocked_date(
    venue_id: UUID,
    blocked_id: UUID,
    auth: AuthContext = Depends(require_owner),
    db: Session = Depends(get_db),
):
    service.delete_blocked_date(db, venue_id, blocked_id, auth.user_id)
    return DeleteResponse(id=blocked_id, message="Blocked date removed successfully")


@router.get("/{venue_id}/pricing-rules", response_model=list[VenuePricingRuleResponse])
def list_pricing_rules(
    venue_id: UUID,
    auth: AuthContext = Depends(require_owner),
    db: Session = Depends(get_db),
):
    return service.list_pricing_rules(db, venue_id, auth.user_id)


@router.post(
    "/{venue_id}/pricing-rules",
    response_model=VenuePricingRuleResponse,
    status_code=201,
)
def create_pricing_rule(
    venue_id: UUID,
    body: CreatePricingRuleRequest,
    auth: AuthContext = Depends(require_owner),
    db: Session = Depends(get_db),
):
    return service.create_pricing_rule(db, venue_id, auth.user_id, body)


@router.patch(
    "/{venue_id}/pricing-rules/{rule_id}", response_model=VenuePricingRuleResponse
)
def update_pricing_rule(
    venue_id: UUID,
    rule_id: UUID,
    body: UpdatePricingRuleRequest,
    auth: AuthContext = Depends(require_owner),
    db: Session = Depends(get_db),
):
    return service.update_pricing_rule(db, venue_id, rule_id, auth.user_id, body)


@router.delete(
    "/{venue_id}/pricing-rules/{rule_id}",
    response_model=DeleteResponse,
    status_code=200,
)
def delete_pricing_rule(
    venue_id: UUID,
    rule_id: UUID,
    auth: AuthContext = Depends(require_owner),
    db: Session = Depends(get_db),
):
    service.delete_pricing_rule(db, venue_id, rule_id, auth.user_id)
    return DeleteResponse(id=rule_id, message="Pricing rule removed successfully")


@router.get("/{venue_id}/pricing-preview", response_model=PricingPreviewResponse)
def get_owner_pricing_preview(
    venue_id: UUID,
    starts_at: str = Query(..., description="ISO 8601 datetime with timezone offset"),
    ends_at: str = Query(..., description="ISO 8601 datetime with timezone offset"),
    booking_type: BookingType = Query(..., description="full_day or time_slot"),
    auth: AuthContext = Depends(require_owner),
    db: Session = Depends(get_db),
):
    starts_dt = parse_timezone_datetime(starts_at, "starts_at")
    ends_dt = parse_timezone_datetime(ends_at, "ends_at")
    return service.get_owner_pricing_preview(
        db, venue_id, auth.user_id, starts_dt, ends_dt, booking_type
    )


@router.put(
    "/{venue_id}/cancellation-policy", response_model=CancellationPolicyResponse
)
def put_venue_cancellation_policy(
    venue_id: UUID,
    body: UpdateCancellationPolicyRequest,
    auth: AuthContext = Depends(require_owner),
    db: Session = Depends(get_db),
):
    return service.put_venue_cancellation_policy(db, venue_id, auth.user_id, body)


@router.put("/{venue_id}/amenities", response_model=list[AmenityResponse])
def update_venue_amenities(
    venue_id: UUID,
    body: UpdateVenueAmenitiesRequest,
    auth: AuthContext = Depends(require_owner),
    db: Session = Depends(get_db),
):
    return service.update_venue_amenities(db, venue_id, auth.user_id, body)


@router.post("/{venue_id}/photos", response_model=VenuePhotoResponse, status_code=201)
async def add_venue_photo(
    venue_id: UUID,
    file: UploadFile = File(...),
    auth: AuthContext = Depends(require_owner),
    db: Session = Depends(get_db),
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    file_bytes = await file.read()
    return service.add_venue_photo(db, venue_id, auth.user_id, file_bytes)


@router.put("/{venue_id}/photos/bulk-update", response_model=list[VenuePhotoResponse])
def bulk_update_venue_photos(
    venue_id: UUID,
    body: BulkUpdateVenuePhotosRequest,
    auth: AuthContext = Depends(require_owner),
    db: Session = Depends(get_db),
):
    return service.bulk_update_venue_photos(db, venue_id, auth.user_id, body)


@router.delete(
    "/{venue_id}/photos/{photo_id}", response_model=DeleteResponse, status_code=200
)
def delete_venue_photo(
    venue_id: UUID,
    photo_id: UUID,
    auth: AuthContext = Depends(require_owner),
    db: Session = Depends(get_db),
):
    service.delete_venue_photo(db, venue_id, photo_id, auth.user_id)
    return DeleteResponse(id=photo_id, message="Photo deleted successfully")


@router.get("/{venue_id}/bookings", response_model=list[BookingOut])
def list_venue_bookings(
    venue_id: UUID,
    auth: AuthContext = Depends(require_owner),
    db: Session = Depends(get_db),
):
    return booking_service.list_venue_bookings(db, venue_id, auth.user_id)


@router.get("/{venue_id}/bookings/pending", response_model=list[BookingOut])
def list_pending_venue_bookings(
    venue_id: UUID,
    auth: AuthContext = Depends(require_owner),
    db: Session = Depends(get_db),
):
    return booking_service.list_venue_bookings(
        db,
        venue_id,
        auth.user_id,
        pending_only=True,
    )


# User routes


@router.get("/likes", response_model=list[UUID])
def get_liked_venue_ids(
    auth: AuthContext = Depends(require_auth),
    db: Session = Depends(get_db),
):
    return service.get_liked_venue_ids(db, auth.user_id)


@router.post("/{venue_id}/like", response_model=dict)
def toggle_venue_like(
    venue_id: UUID,
    auth: AuthContext = Depends(require_auth),
    db: Session = Depends(get_db),
):
    is_liked = service.toggle_venue_like(db, venue_id, auth.user_id)
    return {"is_liked": is_liked}


# Public routes


@router.get("/categories", response_model=list[VenueCategoryResponse])
def get_venue_categories(db: Session = Depends(get_db)):
    return service.get_venue_categories(db)


@router.get("/amenities", response_model=list[AmenityResponse])
def get_platform_amenities(db: Session = Depends(get_db)):
    return service.get_platform_amenities(db)


@router.get("/{identifier}", response_model=VenueResponse)
def get_venue(
    identifier: str,
    auth: AuthContext | None = Depends(get_current_user_optional),
    db: Session = Depends(get_db),
):

    venue = service.get_venue(db, identifier, user_id=auth.user_id if auth else None)
    return service._enrich_venue_with_ratings(db, venue)


@router.get("/{venue_id}/pricing", response_model=PricingPreviewResponse)
def get_pricing_preview(
    venue_id: UUID,
    starts_at: str = Query(..., description="ISO 8601 datetime with timezone offset"),
    ends_at: str = Query(..., description="ISO 8601 datetime with timezone offset"),
    booking_type: BookingType = Query(..., description="full_day or time_slot"),
    db: Session = Depends(get_db),
):
    starts_dt = parse_timezone_datetime(starts_at, "starts_at")
    ends_dt = parse_timezone_datetime(ends_at, "ends_at")
    return service.get_pricing_preview(db, venue_id, starts_dt, ends_dt, booking_type)


@router.get("/{venue_id}/availability", response_model=list[VenueAvailabilityResponse])
def get_venue_availability(
    venue_id: UUID,
    db: Session = Depends(get_db),
):
    return service.get_venue_availability(db, venue_id)


@router.get(
    "/{venue_id}/blocked-dates", response_model=list[PublicVenueBlockedDateResponse]
)
def get_venue_blocked_dates(
    venue_id: UUID,
    db: Session = Depends(get_db),
):
    return service.get_venue_blocked_dates(db, venue_id)


@router.get(
    "/{venue_id}/cancellation-policy", response_model=CancellationPolicyResponse
)
def get_venue_cancellation_policy(
    venue_id: UUID,
    db: Session = Depends(get_db),
):
    return service.get_venue_cancellation_policy(db, venue_id)
