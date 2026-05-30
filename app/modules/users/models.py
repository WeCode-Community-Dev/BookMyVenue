from datetime import datetime
from decimal import Decimal
from sqlalchemy.orm import relationship
from sqlalchemy import (
    String,
    Text,
    Boolean,
    DateTime,
    ForeignKey,
    Numeric,
    func
)
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base


class Venue(Base):
    __tablename__ = "venues"

    id: Mapped[int] = mapped_column(primary_key=True,index=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"),nullable=False,index=True)
    name: Mapped[str] = mapped_column(String(255),nullable=False)
    location: Mapped[str] = mapped_column(String(500),nullable=False)
    price_per_day: Mapped[Decimal] = mapped_column(Numeric(10, 2),nullable=False)
    description: Mapped[str] = mapped_column(Text,nullable=False)
    is_approved: Mapped[bool] = mapped_column(Boolean,default=False,nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime,server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime,server_default=func.now(),onupdate=func.now())

    # by this we can deinfe venue.owner.name or user.venues which is very useful when building APIs.
    venues = relationship("Venue",back_populates="owner")

    # it ensure 1 user has 1 owner profile without uselist=False SQLAlchemy assumes: One User Many OwnerProfiles
    owner_profile = relationship(
    "OwnerProfile",
    back_populates="user",
    uselist=False,
    cascade="all, delete-orphan"
    )

   