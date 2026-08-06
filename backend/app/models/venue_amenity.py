from sqlalchemy import Column, Integer, ForeignKey
from app.db.database import Base

class VenueAmenity(Base):
    __tablename__ = "venue_amenities"

    venue_id = Column(
        Integer,
        ForeignKey("venues.id"),
        primary_key=True
    )

    amenity_id = Column(
        Integer,
        ForeignKey("amenities.id"),
        primary_key=True
    )