from __future__ import annotations

import uuid
from typing import TYPE_CHECKING

from sqlalchemy import (
    DateTime,
    Integer,
    UniqueConstraint,
    Uuid,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.review import Review


class Rating(Base):
    __tablename__ = "ratings"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    venue_id: Mapped[int] = mapped_column(Integer, nullable=False, index=True)

    user_id: Mapped[int] = mapped_column(Integer, nullable=False, index=True)

    rating: Mapped[int] = mapped_column(Integer, nullable=False)

    created_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    review: Mapped[Review | None] = relationship(
        "Review",
        back_populates="rating",
        uselist=False,
    )

    __table_args__ = (
        UniqueConstraint(
            "venue_id",
            "user_id",
            name="uq_rating_user_venue",
        ),
    )
