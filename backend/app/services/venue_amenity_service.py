from sqlalchemy.orm import Session
from app.models.venue_amenity import VenueAmenity

def add_amenity_to_venue(
    db: Session,
    venue_id: int,
    amenity_id: int
):
    link = VenueAmenity(
        venue_id=venue_id,
        amenity_id=amenity_id
    )

    db.add(link)
    db.commit()

    return {
        "message": "Amenity linked to venue"
    }