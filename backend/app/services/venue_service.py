from sqlalchemy.orm import Session, joinedload
from app.models.venue import Venue
from app.schemas.venue import VenueCreate
from fastapi import HTTPException
from app.models.user import User



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
    venue_data,
    owner_id: int
):
    venue = db.query(Venue).filter(
        Venue.id == venue_id
    ).first()

    if not venue:
        raise HTTPException(
            status_code=404,
            detail="Venue not found"
        )
    
    # Check if the current user owns this venue
    if venue.owner_id != owner_id:
        raise HTTPException(
            status_code=403,
            detail="You don't have permission to update this venue"
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

def delete_venue(db: Session, venue_id: int, owner_id: int):
    venue = db.query(Venue).filter(
        Venue.id == venue_id
    ).first()

    if not venue:
        raise HTTPException(
            status_code=404,
            detail="Venue not found"
        )
    
    # Check if the current user owns this venue
    if venue.owner_id != owner_id:
        raise HTTPException(
            status_code=403,
            detail="You don't have permission to delete this venue"
        )

    db.delete(venue)
    db.commit()

    return {"message": "Venue deleted successfully"}

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



def get_my_venues(db: Session, current_user: User):
    return (
        db.query(Venue)
        .filter(Venue.owner_id == current_user.id)
        .order_by(Venue.created_at.desc())
        .all()
    )   
