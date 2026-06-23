from sqlalchemy.orm import Session
from app.models.venue import Venue
from app.schemas.venue import VenueCreate
from fastapi import HTTPException

def create_venue(db: Session, venue_data: VenueCreate) -> Venue:
    new_venue = Venue(
        owner_id=1,
        name=venue_data.name,
        location=venue_data.location,
        price_per_day=venue_data.price_per_day
    )

    db.add(new_venue)
    db.commit()
    db.refresh(new_venue)

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

    db.commit()
    db.refresh(venue)

    return venue

def delete_venue(db: Session, venue_id: int):
    venue = db.query(Venue).filter(
        Venue.id == venue_id
    ).first()

    if not venue:
        raise HTTPException(
            status_code=404,
            detail="Venue not found"
        )

    db.delete(venue)
    db.commit()

    return venue

def get_my_venues(
    db: Session,
    owner_id: int
):
    return db.query(Venue).filter(
        Venue.owner_id == owner_id
    ).all()    

def approve_venue(
    db: Session,
    venue_id: int
):
    venue = db.query(Venue).filter(
        Venue.id == venue_id
    ).first()

    if not venue:
        raise HTTPException(
            status_code=404,
            detail="Venue not found"
        )

    venue.approval_status = "approved"

    db.commit()
    db.refresh(venue)

    return venue

def get_pending_venues(db: Session):
    return db.query(Venue).filter(
        Venue.approval_status == "pending"
    ).all()