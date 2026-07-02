from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.review import Review
from app.models.venue import Venue
from app.models.booking import Booking
from app.models.user import User
from app.schemas.review import ReviewCreate
from app.services.notification_service import create_notification


def create_review(db: Session, current_user: User, payload: ReviewCreate) -> Review:
    venue = db.query(Venue).filter(Venue.id == payload.venue_id).first()
    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")

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
        db, user_id=venue.owner_id, type="review",
        message="New review received", venue_id=venue.id,
    )

    return review


def get_recent_reviews_for_owner(db: Session, owner_id: int, limit: int = 10):
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
        })
    return results