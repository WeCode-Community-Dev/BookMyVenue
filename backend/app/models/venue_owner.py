from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base


class VenueOwner(Base):
    __tablename__ = "venue_owners"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)

    business_name = Column(String, nullable=False)
    business_address = Column(String, nullable=False)
    business_type = Column(String, nullable=True)
    contact_person = Column(String, nullable=True)
    business_phone = Column(String, nullable=True)
    business_email = Column(String, nullable=True)
    website = Column(String, nullable=True)
    gst_number = Column(String, nullable=True)
    pan_number = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="venue_owner_profile")