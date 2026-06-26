from __future__ import annotations

from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base
from .venue import Venue


class VenueImage(Base):
    __tablename__ = "venue_images"

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True, index=True)
    venue_id: Mapped[int] = mapped_column(
        Integer, ForeignKey(Venue.id), nullable=False)
    image_url: Mapped[str] = mapped_column(String, nullable=False)
    display_order: Mapped[int] = mapped_column(Integer, default=0)

    venue = relationship("Venue", back_populates="images")
    
