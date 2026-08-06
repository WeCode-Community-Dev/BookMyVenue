from __future__ import annotations

from typing import TYPE_CHECKING

from geoalchemy2 import Geometry
from sqlalchemy import ForeignKey, Index, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.venue import Venue


class District(Base):
    __tablename__ = "districts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)

    cities: Mapped[list[City]] = relationship(
        "City",
        back_populates="district",
    )

    def __repr__(self) -> str:
        return f"<District id={self.id} name={self.name!r}>"


class City(Base):
    __tablename__ = "cities"

    __table_args__ = (
        UniqueConstraint("district_id", "name", name="uq_cities_district_name"),
        Index("ix_cities_district_id", "district_id"),
        Index("ix_cities_location", "location", postgresql_using="gist"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    district_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("districts.id", ondelete="RESTRICT"),
        nullable=False,
    )

    name: Mapped[str] = mapped_column(String(100), nullable=False)

    # Geographic coordinates (longitude, latitude) in WGS84.
    location = mapped_column(
        Geometry(geometry_type="POINT", srid=4326),
        nullable=True,
    )

    district: Mapped[District] = relationship(
        "District",
        back_populates="cities",
    )

    venues: Mapped[list[Venue]] = relationship(
        "Venue",
        back_populates="city",
    )

    def __repr__(self) -> str:
        return f"<City id={self.id} name={self.name!r}>"
