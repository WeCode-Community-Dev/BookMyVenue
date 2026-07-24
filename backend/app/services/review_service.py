from datetime import datetime, timezone

from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.review import Review
from app.models.venue import Venue
from app.models.booking import Booking
from app.models.user import User
from app.schemas.review import ReviewCreate
from app.services.notification_service import create_notification


def create_review(db: Session, current_user: User, payload: ReviewCreate) -> dict:

    if current_user.role != "user":
        raise HTTPException(
            status_code=403,
            detail="Only customers can submit reviews",
        )

    venue = db.query(Venue).filter(Venue.id == payload.venue_id).first()
    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")

    booking = (
        db.query(Booking)
        .filter(
            Booking.id == payload.booking_id,
            Booking.venue_id == payload.venue_id,
            Booking.user_id == current_user.id,
            Booking.status == "booked",
        )
        .first()
    )

    if not booking:
        raise HTTPException(
            status_code=403,
            detail="You can only review a venue after a completed booking",
        )

    review = Review(
        venue_id=payload.venue_id,
        reviewer_id=current_user.id,
        booking_id=payload.booking_id,
        rating=payload.rating,
        comment=payload.comment,
    )
    db.add(review)
    db.flush()

    all_ratings = db.query(Review.rating).filter(Review.venue_id == venue.id).all()
    ratings = [r[0] for r in all_ratings]
    venue.total_reviews = len(ratings)
    venue.average_rating = round(sum(ratings) / len(ratings), 2) if ratings else 0.00

    db.commit()
    db.refresh(review)

    create_notification(
        db,
        user_id=venue.owner_id,
        type="review",
        message="New review received",
        venue_id=venue.id,
        booking_id=booking.id,
    )

    return {
        "id": review.id,
        "venue_id": review.venue_id,
        "rating": review.rating,
        "comment": review.comment,
        "created_at": review.created_at,
        "reviewer_name": review.reviewer.name or "Anonymous",
        "venue_name": venue.name,
        "event_type": booking.event_type,
        "owner_reply": review.owner_reply,
        "replied_at": review.replied_at,
    }
    
    
def get_public_reviews(db: Session, limit: int = 6) -> list:
    """
    Public endpoint — returns recent reviews from approved venues only.
    No auth required. Used on the landing page testimonials section.
    """
    rows = (
        db.query(Review, Venue, Booking)
        .join(Venue, Review.venue_id == Venue.id)
        .outerjoin(Booking, Review.booking_id == Booking.id)
        .filter(
            Venue.approval_status == "approved",
            Venue.is_active.is_(True),
            Review.comment.isnot(None),
            Review.rating >= 4,
        )
        .order_by(Review.created_at.desc())
        .limit(limit)
        .all()
    )
 
    results = []
    for review, venue, booking in rows:
        results.append({
            "id": review.id,
            "venue_id": review.venue_id,
            "rating": review.rating,
            "comment": review.comment,
            "created_at": review.created_at,
            "reviewer_name": review.reviewer.name or "Anonymous",
            "venue_name": venue.name,
            "event_type": booking.event_type if booking else None,
            "owner_reply": review.owner_reply,
            "replied_at": review.replied_at,
        })
    return results


def get_recent_reviews_for_owner(db: Session, owner_id: int, limit: int = 50) -> list:
    rows = (
        db.query(Review, Venue, Booking)
        .join(Venue, Review.venue_id == Venue.id)
        .outerjoin(Booking, Review.booking_id == Booking.id)
        .filter(Venue.owner_id == owner_id)
        .order_by(Review.created_at.desc())
        .limit(limit)
        .all()
    )

    results = []
    for review, venue, booking in rows:
        results.append({
            "id": review.id,
            "venue_id": review.venue_id,
            "rating": review.rating,
            "comment": review.comment,
            "created_at": review.created_at,
            "reviewer_name": review.reviewer.name or "Anonymous",
            "venue_name": venue.name,
            "event_type": booking.event_type if booking else None,
            "owner_reply": review.owner_reply,
            "replied_at": review.replied_at,
        })
    return results


def get_review_dashboard_data(db: Session, owner_id: int) -> dict:
    """
    Returns reviews list + rating distribution + totals for the owner dashboard.
    Rating distribution is computed across ALL venues owned by this owner.
    Review of the month = highest rated; if tie, most recent 5-star.
    """
    reviews = get_recent_reviews_for_owner(db, owner_id, limit=50)

    # Rating distribution across all owner's venues
    all_ratings = (
        db.query(Review.rating)
        .join(Venue, Review.venue_id == Venue.id)
        .filter(Venue.owner_id == owner_id)
        .all()
    )
    rating_values = [r[0] for r in all_ratings]
    total = len(rating_values)
    average = round(sum(rating_values) / total, 1) if total else 0.0

    distribution = {str(star): 0 for star in range(1, 6)}
    for r in rating_values:
        distribution[str(r)] += 1

    # Convert counts to percentages
    distribution_pct = {
        star: round((count / total) * 100) if total else 0
        for star, count in distribution.items()
    }

    # Review of the month: highest rating, then most recent if tie
    review_of_month = None
    if reviews:
        sorted_reviews = sorted(
            reviews,
            key=lambda r: (r["rating"], r["created_at"]),
            reverse=True,
        )
        review_of_month = sorted_reviews[0]

    return {
        "reviews": reviews,
        "rating_distribution": distribution_pct,
        "total_reviews": total,
        "average_rating": average,
        "review_of_month": review_of_month,
    }


def add_or_update_reply(db: Session, review_id: int, owner: User, reply_text: str) -> dict:
    """
    Allows a venue owner to add or edit their reply to a review.
    Verifies the review belongs to one of their venues before writing.
    """
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    venue = db.query(Venue).filter(
        Venue.id == review.venue_id,
        Venue.owner_id == owner.id,
    ).first()

    if not venue:
        raise HTTPException(
            status_code=403,
            detail="You can only reply to reviews on your own venues",
        )

    review.owner_reply = reply_text
    review.replied_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(review)

    booking = db.query(Booking).filter(Booking.id == review.booking_id).first()

    return {
        "id": review.id,
        "venue_id": review.venue_id,
        "rating": review.rating,
        "comment": review.comment,
        "created_at": review.created_at,
        "reviewer_name": review.reviewer.name or "Anonymous",
        "venue_name": venue.name,
        "event_type": booking.event_type if booking else None,
        "owner_reply": review.owner_reply,
        "replied_at": review.replied_at,
    }