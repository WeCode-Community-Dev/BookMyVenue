from sqlalchemy.orm import Session, joinedload
from app.models.venue import Venue
from app.schemas.venue import VenueCreate
from fastapi import HTTPException
from app.models.user import User
from app.models.booking import Booking
from datetime import date
from app.services.notification_service import create_notification
from datetime import datetime, timezone


def _fetch_full(db: Session, venue_id: int) -> Venue:
    """Re-fetch a venue with venue_type and amenities eager-loaded.
    Used after every write (create/update) and for direct GET by id so
    VenueOut always serializes completely without hitting a closed session.
    """
    venue = (
        db.query(Venue)
        .options(joinedload(Venue.venue_type), joinedload(Venue.amenities))
        .filter(Venue.id == venue_id)
        .first()
    )
    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")
    return venue

def create_venue(db: Session, venue_data: VenueCreate, current_user: User) -> Venue:
    new_venue = Venue(

        owner_id=current_user.id,

        name=venue_data.name,
        location=venue_data.location,
        price_per_day=venue_data.price_per_day,
        venue_type_id=venue_data.venue_type_id,
        capacity=venue_data.capacity,
        image_url=venue_data.image_url,
        description=venue_data.description,
    )

    db.add(new_venue)
    db.commit()
    
    
    new_venue = (
        db.query(Venue)
        .options(joinedload(Venue.venue_type), joinedload(Venue.amenities))
        .filter(Venue.id == new_venue.id)
        .first()
    )

    return new_venue

def get_venues(
    db: Session,
    location: str = None,
    search: str = None,
    skip: int = 0,
    limit: int = 10
):
    query = db.query(Venue).filter(
    Venue.approval_status == "approved"
)

    if location:
        query = query.filter(
            Venue.location.ilike(f"%{location}%")
        )

    if search:
        query = query.filter(
            Venue.name.ilike(f"%{search}%")
        )

    return query.offset(skip).limit(limit).all()


def get_venue_by_id(db: Session, venue_id: int):
    venue = db.query(Venue).filter(
        Venue.id == venue_id
    ).first()

    if not venue:
        raise HTTPException(
            status_code=404,
            detail="Venue not found"
        )

    return venue


def update_venue(
    db: Session,
    venue_id: int,
    venue_data
):
    venue = db.query(Venue).filter(
        Venue.id == venue_id
    ).first()

    if not venue:
        raise HTTPException(
            status_code=404,
            detail="Venue not found"
        )

    venue.name = venue_data.name
    venue.location = venue_data.location
    venue.price_per_day = venue_data.price_per_day
    venue.venue_type_id = venue_data.venue_type_id
    venue.description = venue_data.description
    venue.capacity = venue_data.capacity
    venue.image_url = venue_data.image_url

    db.commit()
    db.refresh(venue)

    return venue

def delete_venue(db: Session, venue_id: int, current_user: User):
    venue = db.query(Venue).filter(
        Venue.id == venue_id,
        Venue.owner_id == current_user.id,
    ).first()

    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")

    if venue.approval_status == "approved":
        raise HTTPException(
            status_code=400,
            detail="Approved venues cannot be hard deleted. Use deactivate instead.",
        )

    db.delete(venue)
    db.commit()
    return {"detail": "Venue deleted successfully"}


def deactivate_venue(db: Session, venue_id: int, current_user: User):
    venue = db.query(Venue).filter(
        Venue.id == venue_id,
        Venue.owner_id == current_user.id,
    ).first()

    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")

    if venue.approval_status != "approved":
        raise HTTPException(
            status_code=400,
            detail="Only approved venues can be deactivated. Delete pending/rejected venues instead.",
        )

    if not venue.is_active:
        raise HTTPException(status_code=400, detail="Venue is already deactivated")

    # Cancel all upcoming bookings
    upcoming_bookings = (
        db.query(Booking)
        .filter(
            Booking.venue_id == venue_id,
            Booking.booking_date >= date.today(),
            Booking.status != "cancelled",
        )
        .all()
    )

    for booking in upcoming_bookings:
        booking.status = "cancelled"
        booking.cancellation_reason = "Venue deactivated by owner"
        booking.cancelled_at = datetime.now(timezone.utc)

        # Notify the customer
        create_notification(
            db,
            user_id=booking.user_id,
            type="booking_cancelled",
            message=f"Your booking at {venue.name} has been cancelled because the venue is no longer available.",
            venue_id=venue.id,
            booking_id=booking.id,
        )

    venue.is_active = False
    db.commit()

    return {
        "detail": "Venue deactivated successfully",
        "cancelled_bookings": len(upcoming_bookings),
    }






def get_my_venues(db: Session, current_user: User):
    return (
        db.query(Venue)
        .options(joinedload(Venue.venue_type), joinedload(Venue.amenities))
        .filter(Venue.owner_id == current_user.id)
        .order_by(Venue.created_at.desc())
        .all()
    )   
