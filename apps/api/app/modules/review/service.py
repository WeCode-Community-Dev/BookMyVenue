from datetime import datetime
from uuid import UUID

from sqlalchemy import case, desc, func
from sqlalchemy.orm import Session, joinedload

from app.core.exceptions import APIException
from app.modules.admin.models import AdminAction
from app.modules.booking.models import Booking, BookingStatus
from app.modules.review.models import VenueReview
from app.modules.venue.models import Venue
from app.modules.review.schemas import (
    EligibleBookingsResponse,
    ReviewCreate,
    ReviewListResponse,
    ReviewResponse,
    ReviewStats,
    ReviewSummaryResponse,
    ReviewUpdate,
)


class ReviewService:
    """Service layer for review operations."""

    # ────────────────────────────────────────────────────────────────
    # CUSTOMER METHODS
    # ────────────────────────────────────────────────────────────────

    @staticmethod
    def create_review(
        db: Session,
        user_id: UUID,
        venue_id: UUID,
        payload: ReviewCreate,
    ) -> ReviewResponse:
        """
        Create a new review for a venue.

        Validates:
        - Booking exists for user and venue
        - Booking status is "completed"
        - No existing review for the booking
        """
        # Get the user's completed booking for this venue
        booking = (
            db.query(Booking)
            .filter(
                Booking.user_id == user_id,
                Booking.venue_id == venue_id,
                Booking.status == BookingStatus.completed,
            )
            .first()
        )

        if not booking:
            raise APIException(
                status_code=422,
                detail="You don't have a completed booking for this venue.",
            )

        # Check if booking already has a review
        existing_review = db.query(VenueReview).filter(VenueReview.booking_id == booking.id).first()
        if existing_review:
            raise APIException(
                status_code=422,
                detail="You have already reviewed this booking.",
            )

        # Create review
        review = VenueReview(
            venue_id=venue_id,
            booking_id=booking.id,
            user_id=user_id,
            rating=payload.rating,
            title=payload.title,
            comment=payload.comment,
        )

        db.add(review)
        db.flush()

        return ReviewService._to_response(db, review)

    @staticmethod
    def update_review(
        db: Session,
        user_id: UUID,
        review_id: UUID,
        payload: ReviewUpdate,
    ) -> ReviewResponse:
        """
        Update a review. Only the owner can update.

        Allowed fields: rating, title, comment
        """
        review = (
            db.query(VenueReview)
            .filter(VenueReview.id == review_id, VenueReview.deleted_at.is_(None))
            .first()
        )

        if not review:
            raise APIException(status_code=404, detail="Review not found.")

        if review.user_id != user_id:
            raise APIException(status_code=403, detail="You can only edit your own reviews.")

        # Update allowed fields
        if payload.rating is not None:
            review.rating = payload.rating
        if payload.title is not None:
            review.title = payload.title
        if payload.comment is not None:
            review.comment = payload.comment

        review.updated_at = datetime.utcnow()
        db.flush()

        return ReviewService._to_response(db, review)

    @staticmethod
    def delete_review(
        db: Session,
        user_id: UUID,
        review_id: UUID,
    ) -> None:
        """
        Soft delete a review. Only the owner can delete.
        """
        review = (
            db.query(VenueReview)
            .filter(VenueReview.id == review_id, VenueReview.deleted_at.is_(None))
            .first()
        )

        if not review:
            raise APIException(status_code=404, detail="Review not found.")

        if review.user_id != user_id:
            raise APIException(status_code=403, detail="You can only delete your own reviews.")

        review.deleted_at = datetime.utcnow()
        db.flush()

    @staticmethod
    def get_review(db: Session, review_id: UUID) -> ReviewResponse:
        """
        Get a single review by ID. Excludes deleted and hidden reviews.
        """
        review = (
            db.query(VenueReview)
            .filter(
                VenueReview.id == review_id,
                VenueReview.deleted_at.is_(None),
                VenueReview.is_hidden.is_(False),
            )
            .first()
        )

        if not review:
            raise APIException(status_code=404, detail="Review not found.")

        return ReviewService._to_response(db, review)

    @staticmethod
    def list_venue_reviews(
        db: Session,
        venue_id: UUID,
        page: int = 1,
        per_page: int = 10,
    ) -> ReviewListResponse:
        """
        List public reviews for a venue (paginated).
        Excludes deleted and hidden reviews.
        """
        query = (
            db.query(VenueReview)
            .options(joinedload(VenueReview.author), joinedload(VenueReview.venue))
            .filter(
                VenueReview.venue_id == venue_id,
                VenueReview.deleted_at.is_(None),
                VenueReview.is_hidden.is_(False),
            )
            .order_by(desc(VenueReview.created_at))
        )

        total = query.count()
        offset = (page - 1) * per_page
        reviews = query.offset(offset).limit(per_page).all()

        return ReviewListResponse(
            items=[ReviewService._to_response(db, r) for r in reviews],
            total=total,
            page=page,
            per_page=per_page,
        )

    @staticmethod
    def list_owner_reviews(
        db: Session,
        owner_id: UUID,
        venue_id: str | None = None,
        rating: int | None = None,
        page: int = 1,
        per_page: int = 10,
    ) -> ReviewListResponse:
        """
        List all public reviews across all venues owned by a specific owner (paginated and filtered).
        """
        query = (
            db.query(VenueReview)
            .join(Venue, Venue.id == VenueReview.venue_id)
            .options(joinedload(VenueReview.author), joinedload(VenueReview.venue))
            .filter(
                Venue.owner_id == owner_id,
                VenueReview.deleted_at.is_(None),
                VenueReview.is_hidden.is_(False),
            )
        )

        if venue_id and venue_id != "all":
            query = query.filter(VenueReview.venue_id == venue_id)

        if rating:
            query = query.filter(VenueReview.rating == rating)

        query = query.order_by(desc(VenueReview.created_at))

        total = query.count()
        offset = (page - 1) * per_page
        reviews = query.offset(offset).limit(per_page).all()

        return ReviewListResponse(
            items=[ReviewService._to_response(db, r) for r in reviews],
            total=total,
            page=page,
            per_page=per_page,
        )

    @staticmethod
    def get_eligible_booking_ids(
        db: Session,
        user_id: UUID,
        venue_id: UUID,
    ) -> EligibleBookingsResponse:
        """
        Get booking IDs eligible for review at a venue.

        Returns completed bookings that:
        - Belong to the user
        - Are for the specified venue
        - Do not already have a review
        """
        # Get completed bookings for user at venue that don't have reviews yet
        eligible_bookings = (
            db.query(Booking.id)
            .filter(
                Booking.user_id == user_id,
                Booking.venue_id == venue_id,
                Booking.status == BookingStatus.completed,
            )
            .all()
        )

        # Filter out bookings that already have reviews (single batched query)
        candidate_ids = [booking_id for (booking_id,) in eligible_bookings]
        reviewed_ids = set()
        if candidate_ids:
            reviewed_ids = {
                row.booking_id
                for row in db.query(VenueReview.booking_id).filter(
                    VenueReview.booking_id.in_(candidate_ids)
                )
            }

        booking_ids = [str(bid) for bid in candidate_ids if bid not in reviewed_ids]

        return EligibleBookingsResponse(booking_ids=booking_ids)

    # ────────────────────────────────────────────────────────────────
    # ADMIN METHODS
    # ────────────────────────────────────────────────────────────────

    @staticmethod
    def list_all_reviews(
        db: Session,
        page: int = 1,
        per_page: int = 10,
        venue_id: UUID | None = None,
        user_id: UUID | None = None,
        rating: int | None = None,
        is_hidden: bool | None = None,
        include_deleted: bool = False,
    ) -> ReviewListResponse:
        """
        List all reviews with optional filters (admin only).
        """
        query = db.query(VenueReview).options(
            joinedload(VenueReview.author), joinedload(VenueReview.venue)
        )

        if venue_id:
            query = query.filter(VenueReview.venue_id == venue_id)
        if user_id:
            query = query.filter(VenueReview.user_id == user_id)
        if rating is not None:
            query = query.filter(VenueReview.rating == rating)
        if is_hidden is not None:
            query = query.filter(VenueReview.is_hidden == is_hidden)
        if not include_deleted:
            query = query.filter(VenueReview.deleted_at.is_(None))

        total = query.count()
        offset = (page - 1) * per_page
        reviews = query.order_by(desc(VenueReview.created_at)).offset(offset).limit(per_page).all()

        return ReviewListResponse(
            items=[ReviewService._to_response(db, r) for r in reviews],
            total=total,
            page=page,
            per_page=per_page,
            stats=ReviewService.get_review_stats(db),
        )

    @staticmethod
    def get_review_stats(db: Session) -> ReviewStats:
        """
        Platform-wide review counts for the admin dashboard.
        Always reflects all non-deleted reviews, regardless of active filters.
        """
        row = (
            db.query(VenueReview)
            .filter(VenueReview.deleted_at.is_(None))
            .with_entities(
                func.count(VenueReview.id).label("total"),
                func.count(case((VenueReview.is_hidden.is_(False), 1))).label("visible"),
                func.count(case((VenueReview.is_hidden.is_(True), 1))).label("hidden"),
                func.coalesce(func.avg(VenueReview.rating), 0.0).label("average_rating"),
            )
            .one()
        )
        return ReviewStats(
            total=row.total,
            visible=row.visible,
            hidden=row.hidden,
            average_rating=round(float(row.average_rating), 2),
        )

    @staticmethod
    def hide_review(
        db: Session,
        admin_id: UUID,
        review_id: UUID,
        reason: str | None = None,
    ) -> ReviewResponse:
        """
        Hide a review (admin action).
        """
        review = db.query(VenueReview).filter(VenueReview.id == review_id).first()

        if not review:
            raise APIException(status_code=404, detail="Review not found.")

        review.is_hidden = True
        review.hidden_reason = reason
        review.hidden_by = admin_id
        review.hidden_at = datetime.utcnow()
        db.add(
            AdminAction(
                admin_id=admin_id,
                action_type="review_hidden",
                target_type="venue_review",
                target_id=review_id,
                reason=reason,
            )
        )
        db.flush()

        return ReviewService._to_response(db, review)

    @staticmethod
    def restore_review(
        db: Session,
        admin_id: UUID,
        review_id: UUID,
    ) -> ReviewResponse:
        """
        Restore a hidden review (admin action).
        """
        review = db.query(VenueReview).filter(VenueReview.id == review_id).first()

        if not review:
            raise APIException(status_code=404, detail="Review not found.")

        if not review.is_hidden:
            raise APIException(status_code=422, detail="Review is not hidden.")

        review.is_hidden = False
        review.hidden_reason = None
        review.hidden_by = None
        review.hidden_at = None
        db.add(
            AdminAction(
                admin_id=admin_id,
                action_type="review_restored",
                target_type="venue_review",
                target_id=review_id,
            )
        )
        db.flush()

        return ReviewService._to_response(db, review)

    @staticmethod
    def delete_review_admin(
        db: Session,
        admin_id: UUID,
        review_id: UUID,
    ) -> None:
        """
        Hard delete a review (admin only). Permanent.
        """
        review = db.query(VenueReview).filter(VenueReview.id == review_id).first()

        if not review:
            raise APIException(status_code=404, detail="Review not found.")

        db.add(
            AdminAction(
                admin_id=admin_id,
                action_type="review_deleted",
                target_type="venue_review",
                target_id=review_id,
            )
        )
        db.delete(review)
        db.flush()

    # ────────────────────────────────────────────────────────────────
    # STATISTICS
    # ────────────────────────────────────────────────────────────────

    @staticmethod
    def get_rating_summary(db: Session, venue_id: UUID) -> ReviewSummaryResponse:
        """
        Get rating statistics for a venue.
        Only includes public (non-hidden, non-deleted) reviews.
        """
        reviews = (
            db.query(VenueReview)
            .filter(
                VenueReview.venue_id == venue_id,
                VenueReview.deleted_at.is_(None),
                VenueReview.is_hidden.is_(False),
            )
            .all()
        )

        if not reviews:
            return ReviewSummaryResponse(
                average_rating=0.0,
                total_reviews=0,
                rating_distribution={"1": 0, "2": 0, "3": 0, "4": 0, "5": 0},
            )

        # Calculate average
        total_rating = sum(r.rating for r in reviews)
        average_rating = total_rating / len(reviews)

        # Calculate distribution
        distribution = {"1": 0, "2": 0, "3": 0, "4": 0, "5": 0}
        for review in reviews:
            distribution[str(review.rating)] += 1

        return ReviewSummaryResponse(
            average_rating=round(average_rating, 2),
            total_reviews=len(reviews),
            rating_distribution=distribution,
        )

    # ────────────────────────────────────────────────────────────────
    # HELPERS
    # ────────────────────────────────────────────────────────────────

    @staticmethod
    def _to_response(db: Session, review: VenueReview) -> ReviewResponse:
        """
        Convert ORM model to response schema, loading related data.
        """
        # Load author/venue if not already loaded
        author = review.author
        venue = review.venue

        return ReviewResponse(
            id=review.id,
            venue_id=review.venue_id,
            booking_id=review.booking_id,
            user_id=review.user_id,
            rating=review.rating,
            title=review.title,
            comment=review.comment,
            is_hidden=review.is_hidden,
            created_at=review.created_at,
            updated_at=review.updated_at,
            user_name=author.full_name if author else None,
            user_email=author.email if author else None,
            venue_name=venue.name if venue else None,
            hidden_reason=review.hidden_reason,
            hidden_by=review.hidden_by,
            hidden_at=review.hidden_at,
        )
