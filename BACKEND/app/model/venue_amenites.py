from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    Text,
    DateTime,
    ForeignKey,
    func
)
from sqlalchemy.orm import relationship
from app.db.database import Base

class VenueAmenities(Base):
    __tablename__ = "venue_amenities"
    
    id = Column(Integer, primary_key=True, index=True)
    venue_id = Column(
        Integer,
        ForeignKey("venues.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    wifi = Column(Boolean, default=False)
    kitchen = Column(Boolean, default=False)
    parking = Column(Boolean, default=False)
    ac = Column(Boolean, default=False)
    

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    venue = relationship("Venue", back_populates="venue_amenities")

