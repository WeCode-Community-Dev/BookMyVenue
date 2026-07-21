from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db.database import Base

class Amenity(Base):
    __tablename__ = "amenities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)

    # both sides must point to each other, without this the mapper fails to load
    venues = relationship(
        "Venue",
        secondary="venue_amenities",
        back_populates="amenities"
    )