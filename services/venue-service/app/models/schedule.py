from __future__ import annotations

from datetime import date, datetime, time
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    Date,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    Numeric,
    String,
    Time,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.venue import Venue


class VenueScheduleGroup(Base):
    __tablename__ = "venue_schedule_groups"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    venue_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("venues.id", ondelete="CASCADE"),
        nullable=False,
    )

    name: Mapped[str] = mapped_column(String(100), nullable=False)

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    venue: Mapped[Venue] = relationship(
        "Venue",
        back_populates="schedule_groups",
    )

    days: Mapped[list[VenueScheduleGroupDay]] = relationship(
        "VenueScheduleGroupDay",
        back_populates="group",
        cascade="all, delete-orphan",
    )

    schedules: Mapped[list[VenueSchedule]] = relationship(
        "VenueSchedule",
        back_populates="group",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<VenueScheduleGroup id={self.id} name={self.name!r}>"


class VenueScheduleGroupDay(Base):
    __tablename__ = "venue_schedule_group_days"

    __table_args__ = (
        UniqueConstraint("group_id", "day_of_week", name="uq_group_day"),
        CheckConstraint(
            "day_of_week >= 0 AND day_of_week <= 6",
            name="ck_day_of_week",
        ),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    group_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("venue_schedule_groups.id", ondelete="CASCADE"),
        nullable=False,
    )

    day_of_week: Mapped[int] = mapped_column(Integer, nullable=False)

    group: Mapped[VenueScheduleGroup] = relationship(
        "VenueScheduleGroup",
        back_populates="days",
    )

    def __repr__(self) -> str:
        return (
            f"<VenueScheduleGroupDay id={self.id} "
            f"group_id={self.group_id} day={self.day_of_week}>"
        )


class VenueSchedule(Base):
    __tablename__ = "venue_schedules"

    __table_args__ = (
        CheckConstraint(
            "end_time > start_time",
            name="ck_schedule_time_range",
        ),
        CheckConstraint("price >= 0", name="ck_schedule_price"),
        UniqueConstraint(
            "group_id",
            "start_time",
            "end_time",
            name="uq_schedule_slot",
        ),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    group_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("venue_schedule_groups.id", ondelete="CASCADE"),
        nullable=False,
    )

    name: Mapped[str | None] = mapped_column(String(100), nullable=True)

    start_time: Mapped[time] = mapped_column(Time, nullable=False)

    end_time: Mapped[time] = mapped_column(Time, nullable=False)

    price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)

    is_available: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    group: Mapped[VenueScheduleGroup] = relationship(
        "VenueScheduleGroup",
        back_populates="schedules",
    )

    def __repr__(self) -> str:
        label = self.name or "Schedule"
        return f"<VenueSchedule id={self.id} {label} ({self.start_time}-{self.end_time})>"


class VenueScheduleOverride(Base):
    __tablename__ = "venue_schedule_overrides"

    __table_args__ = (
        Index("ix_sched_override_venue", "venue_id"),
        Index("ix_sched_override_date", "override_date"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    venue_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("venues.id", ondelete="CASCADE"),
        nullable=False,
    )

    override_date: Mapped[date] = mapped_column(Date, nullable=False)

    start_time: Mapped[time | None] = mapped_column(Time, nullable=True)

    end_time: Mapped[time | None] = mapped_column(Time, nullable=True)

    is_available: Mapped[bool] = mapped_column(Boolean, nullable=False)

    reason: Mapped[str | None] = mapped_column(String(255), nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    venue: Mapped[Venue] = relationship(
        "Venue",
        back_populates="schedule_overrides",
    )

    def __repr__(self) -> str:
        return (
            f"<VenueScheduleOverride id={self.id} "
            f"venue_id={self.venue_id} date={self.override_date}>"
        )
