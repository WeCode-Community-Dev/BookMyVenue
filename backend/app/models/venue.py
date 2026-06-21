from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from datetime import datetime
from app.db.database import Base
from sqlalchemy.orm import relationship

class Venue(Base):
    __tablename__ = "venues"

    id = Column(Integer, primary_key=True, index=True)
    amenities = relationship("Amenity", secondary="venue_amenities")
   
    owner_id = Column(
    Integer,
    ForeignKey("users.id"),
    nullable=True
)
    name = Column(String, nullable=False)
    location = Column(String, nullable=False)
    price_per_day = Column(Float, nullable=False)
    approval_status = Column(String, default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)