from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime,
    ForeignKey,
    CheckConstraint,
)
from sqlalchemy.orm import relationship

from app.db.database import Base


class Notification(Base):

    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)

    # Who should see this notification (the venue owner's user id)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    type = Column(String(30), nullable=False)  # 'booking_request' | 'review' | 'payment'
    message = Column(String(255), nullable=False)

    venue_id = Column(Integer, ForeignKey("venues.id", ondelete="SET NULL"), nullable=True)
    booking_id = Column(Integer, ForeignKey("bookings.id", ondelete="SET NULL"), nullable=True)
    payment_id = Column(Integer, ForeignKey("payments.id", ondelete="SET NULL"), nullable=True)

    is_read = Column(Boolean, nullable=False, default=False)

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )

    venue = relationship("Venue")

    __table_args__ = (
        CheckConstraint(
            "type IN ('booking_request', 'review', 'payment')",
            name="ck_notification_type",
        ),
    )
