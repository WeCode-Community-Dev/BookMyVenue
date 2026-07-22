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

class VenueImages(Base):
    __tablename__ = "venue_images"
    
    id = Column(Integer, primary_key=True, index=True)
    venue_id = Column(
        Integer,
        ForeignKey("venues.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    image_url = Column(String(1000), nullable=False)
    cover_image = Column(Boolean, default=False)
    display_order = Column(Integer, default=1)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    venue = relationship("Venue", back_populates="venue_images")

