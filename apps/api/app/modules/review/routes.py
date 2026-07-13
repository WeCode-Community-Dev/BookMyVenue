from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.modules.auth.dependencies import AuthContext, require_admin, require_auth
from app.modules.review.schemas import (
    AdminReviewActionRequest,
    EligibleBookingsResponse,
    ReviewCreate,
    ReviewListResponse,
    ReviewResponse,
    ReviewSummaryResponse,
    ReviewUpdate,
)
from app.modules.review.service import ReviewService

router = APIRouter()


# ────────────────────────────────────────────────────────────────
# CUSTOMER ENDPOINTS
# ────────────────────────────────────────────────────────────────


@router.post("/venues/{venue_id}/reviews", response_model=ReviewResponse, status_code=201)
def create_review(
    venue_id: UUID,
    body: ReviewCreate,
    auth: AuthContext = Depends(require_auth),
    db: Session = Depends(get_db),
):
    """Create a new review for a venue (requires completed booking)."""
    return ReviewService.create_review(db, auth.user_id, venue_id, body)


@router.get("/venues/{venue_id}/reviews", response_model=ReviewListResponse)
def list_venue_reviews(
    venue_id: UUID,
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """List public reviews for a venue (paginated)."""
    return ReviewService.list_venue_reviews(db, venue_id, page, per_page)


@router.get("/reviews/{review_id}", response_model=ReviewResponse)
def get_review(
    review_id: UUID,
    db: Session = Depends(get_db),
):
    """Get a single public review."""
    return ReviewService.get_review(db, review_id)


@router.patch("/reviews/{review_id}", response_model=ReviewResponse)
def update_review(
    review_id: UUID,
    body: ReviewUpdate,
    auth: AuthContext = Depends(require_auth),
    db: Session = Depends(get_db),
):
    """Update your own review (rating, title, comment only)."""
    return ReviewService.update_review(db, auth.user_id, review_id, body)


@router.delete("/reviews/{review_id}", status_code=204)
def delete_review(
    review_id: UUID,
    auth: AuthContext = Depends(require_auth),
    db: Session = Depends(get_db),
):
    """Soft delete your own review."""
    ReviewService.delete_review(db, auth.user_id, review_id)


@router.get(
    "/venues/{venue_id}/reviews/eligible-bookings",
    response_model=EligibleBookingsResponse,
)
def get_eligible_booking_ids(
    venue_id: UUID,
    auth: AuthContext = Depends(require_auth),
    db: Session = Depends(get_db),
):
    """Get booking IDs eligible for review at a venue."""
    return ReviewService.get_eligible_booking_ids(db, auth.user_id, venue_id)


# ────────────────────────────────────────────────────────────────
# OWNER ENDPOINTS
# ────────────────────────────────────────────────────────────────


@router.get("/owner/reviews", response_model=ReviewListResponse)
def list_owner_reviews(
    venue_id: str | None = None,
    rating: int | None = None,
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    auth: AuthContext = Depends(require_auth),
    db: Session = Depends(get_db),
):
    """
    Get paginated and filtered reviews across all venues for the authenticated owner.
    """
    if not auth.is_owner():
        from app.core.exceptions import ForbiddenError

        raise ForbiddenError("Only venue owners can access owner reviews")

    return ReviewService.list_owner_reviews(db, auth.user_id, venue_id, rating, page, per_page)


# ────────────────────────────────────────────────────────────────
# ADMIN ENDPOINTS
# ────────────────────────────────────────────────────────────────


@router.get("/admin/reviews", response_model=ReviewListResponse)
def list_all_reviews(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    venue_id: UUID | None = Query(None),
    user_id: UUID | None = Query(None),
    rating: int | None = Query(None, ge=1, le=5),
    is_hidden: bool | None = Query(None),
    include_deleted: bool = Query(False),
    auth: AuthContext = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """List all reviews with filters (admin only)."""
    return ReviewService.list_all_reviews(
        db,
        page=page,
        per_page=per_page,
        venue_id=venue_id,
        user_id=user_id,
        rating=rating,
        is_hidden=is_hidden,
        include_deleted=include_deleted,
    )


@router.get("/admin/reviews/{review_id}", response_model=ReviewResponse)
def get_admin_review(
    review_id: UUID,
    auth: AuthContext = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Get a review (admin can see hidden/deleted reviews)."""
    from app.core.exceptions import APIException
    from app.modules.review.models import VenueReview

    review = db.query(VenueReview).filter(VenueReview.id == review_id).first()
    if not review:
        raise APIException(status_code=404, detail="Review not found.")

    return ReviewService._to_response(db, review)


@router.patch("/admin/reviews/{review_id}/hide", response_model=ReviewResponse)
def hide_review(
    review_id: UUID,
    body: AdminReviewActionRequest,
    auth: AuthContext = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Hide a review (admin only)."""
    return ReviewService.hide_review(db, auth.user_id, review_id, body.hidden_reason)


@router.patch("/admin/reviews/{review_id}/restore", response_model=ReviewResponse)
def restore_review(
    review_id: UUID,
    auth: AuthContext = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Restore a hidden review (admin only)."""
    return ReviewService.restore_review(db, auth.user_id, review_id)


@router.delete("/admin/reviews/{review_id}", status_code=204)
def delete_review_admin(
    review_id: UUID,
    auth: AuthContext = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Hard delete a review (admin only, permanent)."""
    ReviewService.delete_review_admin(db, auth.user_id, review_id)


# ────────────────────────────────────────────────────────────────
# SUMMARY ENDPOINT
# ────────────────────────────────────────────────────────────────


@router.get("/venues/{venue_id}/reviews/summary", response_model=ReviewSummaryResponse)
def get_rating_summary(
    venue_id: UUID,
    db: Session = Depends(get_db),
):
    """Get rating summary (average, count, distribution) for a venue."""
    return ReviewService.get_rating_summary(db, venue_id)
