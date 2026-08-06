from sqlalchemy.orm import Session
from app.models.venue_type import VenueType

DEFAULT_VENUE_TYPES = [
    "Wedding Hall",
    "Conference Hall",
    "Banquet Hall",
    "Party Hall",
    "Outdoor Venue",
    "Resort",
    "Other",
]


def seed_venue_types(db: Session) -> None:
    """Inserts the default venue types if the table is currently empty.
    Safe to call on every startup — does nothing once types already exist,
    so renaming/adding types later via direct DB access won't get overwritten.
    """
    existing_count = db.query(VenueType).count()
    if existing_count > 0:
        return

    for name in DEFAULT_VENUE_TYPES:
        db.add(VenueType(name=name))
    db.commit()