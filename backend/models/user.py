from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(
        String, nullable=False, default="CUSTOMER"
    )  # CUSTOMER, PARTNER, SUPER_ADMIN

    bookings = relationship(
        "Booking", back_populates="user", cascade="all, delete-orphan"
    )
    venues = relationship("Venue", back_populates="owner", cascade="all, delete-orphan")
