from datetime import datetime

from sqlalchemy import (
    String,
    Text,
    DateTime,
    CheckConstraint,
    Boolean,
    func
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship
)

from app.db.base import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    username: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    email: Mapped[str] = mapped_column(
        String(150),
        unique=True,
        nullable=False
    )

    password: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False
    )

    role: Mapped[str] = mapped_column(
        String(20),
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now()
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now()
    )

    __table_args__ = (
        CheckConstraint(
            "role IN ('user', 'owner', 'admin')",
            name="check_user_role"
        ),
    )

    venues = relationship(
        "Venue",
        back_populates="owner"
    )

    bookings = relationship(
        "Booking",
        back_populates="user"
    )

    owner_profile = relationship(
        "OwnerProfile",
        back_populates="user",
        uselist=False
    )