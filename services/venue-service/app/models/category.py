from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import Boolean, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.venue import Venue


class VenueCategory(Base):
    __tablename__ = "venue_categories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)

    icon_url: Mapped[str | None] = mapped_column(Text, nullable=True)

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    venues: Mapped[list[Venue]] = relationship(
        "Venue",
        back_populates="category",
    )

    def __repr__(self) -> str:
        return f"<VenueCategory id={self.id} name={self.name!r}>"
