from sqlalchemy.orm import Session
from fastapi import HTTPException, status
 
from app.models.venue import Venue
from app.models.amenity import Amenity
from app.models.venue_amenity import VenueAmenity
from app.models.user import User



def _get_owned_venue_or_404(db: Session, venue_id: int, current_user: User) -> Venue:
    venue = db.query(Venue).filter(Venue.id == venue_id).first()
    if not venue:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Venue not found")
    if venue.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not own this venue",
        )
    return venue

def _get_amenity_or_404(db: Session, amenity_id: int) -> Amenity:
    amenity = db.query(Amenity).filter(Amenity.id == amenity_id).first()
    if not amenity:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Amenity not found")
    return amenity


def add_amenity_to_venue(
    db: Session, venue_id: int, amenity_id: int, current_user: User
):
    venue = _get_owned_venue_or_404(db, venue_id, current_user)
    _get_amenity_or_404(db, amenity_id)
 
    existing = (
        db.query(VenueAmenity)
        .filter(
            VenueAmenity.venue_id == venue_id,
            VenueAmenity.amenity_id == amenity_id,
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This amenity is already linked to this venue",
        )
 
    link = VenueAmenity(venue_id=venue_id, amenity_id=amenity_id)
    db.add(link)
    db.commit()
    db.refresh(venue)
 
    return venue.amenities


def remove_amenity_from_venue(
    db: Session, venue_id: int, amenity_id: int, current_user: User
):
    venue = _get_owned_venue_or_404(db, venue_id, current_user)
    _get_amenity_or_404(db, amenity_id)
 
    link = (
        db.query(VenueAmenity)
        .filter(
            VenueAmenity.venue_id == venue_id,
            VenueAmenity.amenity_id == amenity_id,
        )
        .first()
    )
    if not link:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="This amenity is not linked to this venue",
        )
 
    db.delete(link)
    db.commit()
    db.refresh(venue)
 
    return venue.amenities