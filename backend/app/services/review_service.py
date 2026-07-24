from datetime import datetime, timezone

from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status

from app.models.review import Review
from app.models.venue import Venue
from app.models.booking import Booking
from app.models.user import User
from app.schemas.review import ReviewCreate
from app.services.notification_service import create_notification
from app.services.booking_service import maybe_complete_booking


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
        )
        .first()
    )

    if not booking:
        raise HTTPException(
            status_code=403,
            detail="You can only review a venue after a completed booking",
        )

    maybe_complete_booking(db, booking)

    if booking.status != "completed":
        raise HTTPException(
            status_code=403,
            detail="You can only review a venue after a completed booking",
        )

    existing_review = (
        db.query(Review)
        .filter(Review.booking_id == payload.booking_id)
        .first()
    )
    if existing_review:
        raise HTTPException(
            status_code=409,
            detail="You have already reviewed this booking",
        )

    review = Review(
        venue_id=payload.venue_id,
        reviewer_id=current_user.id,
        booking_id=payload.booking_id,
        rating=payload.rating,
        comment=payload.comment,
    )
    db.add(review)
    try:
        db.flush()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="You have already reviewed this booking",
        )

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


def get_reviews_for_venue(db: Session, venue_id: int) -> dict:
    venue = (
        db.query(Venue)
        .filter(
            Venue.id == venue_id,
            Venue.approval_status == "approved",
            Venue.is_active.is_(True),
        )
        .first()
    )
    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")

    review_rows = (
        db.query(Review)
        .options(joinedload(Review.reviewer))
        .filter(Review.venue_id == venue_id)
        .order_by(Review.created_at.desc())
        .all()
    )

    booking_ids = [r.booking_id for r in review_rows if r.booking_id]
    bookings_by_id = {}
    if booking_ids:
        bookings = db.query(Booking).filter(Booking.id.in_(booking_ids)).all()
        bookings_by_id = {b.id: b for b in bookings}

    reviews = []
    for review in review_rows:
        booking = bookings_by_id.get(review.booking_id) if review.booking_id else None
        reviews.append({
            "id": review.id,
            "rating": review.rating,
            "comment": review.comment,
            "created_at": review.created_at,
            "reviewer_name": review.reviewer.name or "Anonymous",
            "event_type": booking.event_type if booking else None,
            "owner_reply": review.owner_reply,
            "replied_at": review.replied_at,
        })

    distribution = {str(star): 0 for star in range(1, 6)}
    for review in reviews:
        distribution[str(review["rating"])] += 1

    reviews.sort(key=lambda r: (r["rating"], r["created_at"]), reverse=True)

    return {
        "reviews": reviews,
        "total_reviews": venue.total_reviews or len(reviews),
        "average_rating": float(venue.average_rating or 0),
        "rating_distribution": distribution,
    }


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

    distribution_pct = {
        star: round((count / total) * 100) if total else 0
        for star, count in distribution.items()
    }

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