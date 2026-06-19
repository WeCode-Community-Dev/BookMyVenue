from sqlalchemy import Column, Integer, String, DateTime, func, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base
from typing import Literal


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    venue_id = Column(Integer, ForeignKey("venues.id"), nullable=False)

    razorpay_order_id = Column(String(255), unique=True, nullable=False)
    razorpay_payment_id = Column(String(255), nullable=True)

    amount = Column(Integer, nullable=False)  # store paise, not rupees
    currency = Column(String(10), nullable=False, default="INR")

    status = Column(
        String(50),
        nullable=False,
        default="pending"
    )  
    # status can be "pending", "paid", "failed", "refunded"

    payment_time = Column(DateTime(timezone=True), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    venue = relationship("Venue", back_populates="orders")
    user = relationship("User", back_populates="orders")
    booking = relationship("Booking", back_populates="order", uselist=False)
