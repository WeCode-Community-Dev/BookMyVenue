from sqlalchemy.orm import Session
from app.models.venue_type import VenueType


def get_venue_types(db: Session):
    return db.query(VenueType).all()