from datetime import date, time

from fastapi import HTTPException
from sqlalchemy.orm import Session, joinedload

from app.models.booking import Booking
from app.models.user import User
from app.models.venue import Venue
from app.schemas.venue import VenueCreate


def _fetch_full(db: Session, venue_id: int) -> Venue:
    venue = (
        db.query(Venue)
        .options(joinedload(Venue.venue_type), joinedload(Venue.amenities))
        .filter(Venue.id == venue_id)
        .first()
    )
    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")
    return venue


def _public_venue_query(db: Session):
    return (
        db.query(Venue)
        .options(joinedload(Venue.venue_type), joinedload(Venue.amenities))
        .filter(
            Venue.approval_status == "approved",
            Venue.is_active.is_(True),
        )
    )


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
    return _fetch_full(db, new_venue.id)


def get_venues(
    db: Session,
    location: str | None = None,
    search: str | None = None,
    skip: int = 0,
    limit: int = 10,
):
    query = _public_venue_query(db)

    if location:
        query = query.filter(Venue.location.ilike(f"%{location}%"))

    if search:
        query = query.filter(Venue.name.ilike(f"%{search}%"))

    return query.order_by(Venue.created_at.desc()).offset(skip).limit(limit).all()


def get_venue_by_id(db: Session, venue_id: int, *, public: bool = True):
    if public:
        venue = _public_venue_query(db).filter(Venue.id == venue_id).first()
    else:
        venue = _fetch_full(db, venue_id)

    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")

    return venue


def check_availability(
    db: Session,
    venue_id: int,
    booking_date: date,
    time_slot: time,
) -> dict:
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

    clash = (
        db.query(Booking)
        .filter(
            Booking.venue_id == venue_id,
            Booking.booking_date == booking_date,
            Booking.time_slot == time_slot,
            Booking.status != "cancelled",
        )
        .first()
    )

    return {
        "venue_id": venue_id,
        "booking_date": str(booking_date),
        "time_slot": str(time_slot),
        "available": clash is None,
    }


def update_venue(db: Session, venue_id: int, venue_data, owner_id: int):
    venue = db.query(Venue).filter(Venue.id == venue_id).first()

    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")

    if venue.owner_id != owner_id:
        raise HTTPException(status_code=403, detail="You don't have permission to update this venue")

    venue.name = venue_data.name
    venue.location = venue_data.location
    venue.price_per_day = venue_data.price_per_day
    venue.venue_type_id = venue_data.venue_type_id
    venue.description = venue_data.description
    venue.capacity = venue_data.capacity
    venue.image_url = venue_data.image_url

    db.commit()
    return _fetch_full(db, venue_id)


def delete_venue(db: Session, venue_id: int, owner_id: int):
    venue = db.query(Venue).filter(Venue.id == venue_id).first()

    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")

    if venue.owner_id != owner_id:
        raise HTTPException(status_code=403, detail="You don't have permission to delete this venue")

    db.delete(venue)
    db.commit()

    return {"message": "Venue deleted successfully"}


def get_my_venues(db: Session, current_user: User):
    return (
        db.query(Venue)
        .options(joinedload(Venue.venue_type), joinedload(Venue.amenities))
        .filter(Venue.owner_id == current_user.id)
        .order_by(Venue.created_at.desc())
        .all()
    )
