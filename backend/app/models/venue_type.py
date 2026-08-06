from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db.database import Base


class VenueType(Base):
    __tablename__ = "venue_types"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)

    venues = relationship("Venue", back_populates="venue_type")