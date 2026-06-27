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

class VenueAvailability(Base):
    __tablename__ = "venue_availability"
    
    id = Column(Integer, primary_key=True, unique=True, index=True)
    venue_id = Column(
        Integer,
        ForeignKey("venues.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    
    booking_types = Column(String(255), nullable=False) # hourly or daily

    open_time = Column(String(100), nullable=False)
    closing_time = Column(String(100), nullable=False)

    ### for hourly booking
    minimum_hours = Column(Integer, nullable=True)
    gap_between_bookings = Column(Integer, nullable=True)

    venue_price = Column(Integer, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    venue = relationship("Venue", back_populates="venue_availability")

