from __future__ import annotations

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.schedule import (
    VenueSchedule,
    VenueScheduleGroup,
    VenueScheduleGroupDay,
)
from app.models.venue import Venue


class ScheduleGroupRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    def _with_children(self):
        return (
            selectinload(VenueScheduleGroup.days),
            selectinload(VenueScheduleGroup.schedules),
        )

    async def get_venue_by_slug(self, slug: str) -> Venue | None:
        result = await self.db.execute(select(Venue).where(Venue.slug == slug))
        return result.scalar_one_or_none()

    async def get_group(self, venue_id: int, group_id: int) -> VenueScheduleGroup | None:
        result = await self.db.execute(
            select(VenueScheduleGroup)
            .options(*self._with_children())
            .where(
                VenueScheduleGroup.id == group_id,
                VenueScheduleGroup.venue_id == venue_id,
                VenueScheduleGroup.is_active.is_(True),
            )
        )
        return result.scalar_one_or_none()

    async def list_active_groups(self, venue_id: int) -> list[VenueScheduleGroup]:
        result = await self.db.execute(
            select(VenueScheduleGroup)
            .options(*self._with_children())
            .where(
                VenueScheduleGroup.venue_id == venue_id,
                VenueScheduleGroup.is_active.is_(True),
            )
            .order_by(VenueScheduleGroup.created_at)
        )
        return list(result.scalars().all())

    async def assigned_days(
        self,
        venue_id: int,
        *,
        exclude_group_id: int | None = None,
    ) -> set[int]:
        query = (
            select(VenueScheduleGroupDay.day_of_week)
            .join(VenueScheduleGroup)
            .where(VenueScheduleGroup.venue_id == venue_id)
        )
        if exclude_group_id is not None:
            query = query.where(VenueScheduleGroup.id != exclude_group_id)
        result = await self.db.execute(query)
        return {row[0] for row in result.all()}

    async def get_existing_schedule_ids(self, group_id: int) -> set[int]:
        result = await self.db.execute(
            select(VenueSchedule.id).where(VenueSchedule.group_id == group_id)
        )
        return {row[0] for row in result.all()}

    async def create(
        self,
        *,
        venue_id: int,
        name: str,
        is_active: bool,
        days: list[int],
        schedules: list[dict],
    ) -> VenueScheduleGroup:
        group = VenueScheduleGroup(venue_id=venue_id, name=name, is_active=is_active)
        self.db.add(group)
        await self.db.flush()
        await self._sync_children(group, days=days, schedules=schedules)
        await self.db.flush()
        refreshed = await self.get_group(venue_id, group.id)
        assert refreshed is not None
        return refreshed

    async def _sync_children(
        self,
        group: VenueScheduleGroup,
        *,
        days: list[int],
        schedules: list[dict],
    ) -> None:
        await self.db.execute(
            delete(VenueScheduleGroupDay).where(
                VenueScheduleGroupDay.group_id == group.id
            )
        )
        for day in sorted(set(days)):
            self.db.add(VenueScheduleGroupDay(group_id=group.id, day_of_week=day))

        existing_result = await self.db.execute(
            select(VenueSchedule).where(VenueSchedule.group_id == group.id)
        )
        existing_by_id = {s.id: s for s in existing_result.scalars().all()}
        kept_ids: set[int] = set()

        for s in schedules:
            sid = s.get("id")
            payload = {
                "name": s.get("name") or "",
                "start_time": s["start_time"],
                "end_time": s["end_time"],
                "price": s["price"],
                "is_available": s.get("is_available", True),
            }
            if sid and sid in existing_by_id:
                row = existing_by_id[sid]
                for k, v in payload.items():
                    setattr(row, k, v)
                kept_ids.add(sid)
            else:
                new_s = VenueSchedule(group_id=group.id, **payload)
                self.db.add(new_s)
                await self.db.flush()
                kept_ids.add(new_s.id)

        for sid, row in existing_by_id.items():
            if sid not in kept_ids:
                await self.db.delete(row)
