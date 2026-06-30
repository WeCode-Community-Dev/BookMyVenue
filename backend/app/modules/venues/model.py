import enum

from sqlalchemy import JSON, Enum, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, TimestampMixin


class VenueType(str, enum.Enum):
    birthday_hall = "birthday_hall"
    cafe = "cafe"
    hotel = "hotel"
    resort = "resort"
    auditorium = "auditorium"
    meetup = "meetup"
    mall = "mall"
    other = "other"


class VenueStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"


class Venue(Base, TimestampMixin):
    __tablename__ = "venues"

    id: Mapped[int] = mapped_column(primary_key=True)
    owner_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    type: Mapped[VenueType] = mapped_column(Enum(VenueType), nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    address: Mapped[str] = mapped_column(String(500), nullable=False)
    lat: Mapped[float | None] = mapped_column(Float, nullable=True)
    lng: Mapped[float | None] = mapped_column(Float, nullable=True)
    price_per_hour: Mapped[float] = mapped_column(Float, nullable=False)
    capacity: Mapped[int] = mapped_column(Integer, nullable=False)
    photos: Mapped[list] = mapped_column(JSON, default=list, nullable=False)
    amenities: Mapped[list] = mapped_column(JSON, default=list, nullable=False)
    status: Mapped[VenueStatus] = mapped_column(
        Enum(VenueStatus), default=VenueStatus.pending, nullable=False, index=True
    )

    @property
    def distance_km(self) -> float | None:
        return getattr(self, "_distance_km", None)

    @distance_km.setter
    def distance_km(self, value: float | None) -> None:
        self._distance_km = value
