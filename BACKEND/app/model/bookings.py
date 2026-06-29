from sqlalchemy import (
    Column,
    Integer,
    String,
    Date,
    DateTime,
    ForeignKey,
    func
)
from sqlalchemy.orm import relationship
from app.db.database import Base


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )

    venue_id = Column(
        Integer,
        ForeignKey("venues.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    order_id = Column(
        Integer,
        ForeignKey("orders.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    booking_date = Column(Date, nullable=False)
    start_time = Column(String(100), nullable=False)
    end_time = Column(String(100), nullable=False)

    status = Column(String(50), nullable=False, default="created")
    # status can be "created", "confirmed", "cancelled", "completed", "offline"

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    user = relationship("User", back_populates="bookings")
    venue = relationship("Venue", back_populates="bookings")
    order = relationship("Order", back_populates="booking")