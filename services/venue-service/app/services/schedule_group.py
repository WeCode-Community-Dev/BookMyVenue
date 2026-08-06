from __future__ import annotations

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.auth import AuthUser
from app.models.schedule import VenueScheduleGroup
from app.models.venue import Venue
from app.repositories.schedule_group import ScheduleGroupRepository
from app.schemas.schedule_group import (
    WEEKDAY_LABELS,
    ScheduleGroupOut,
    ScheduleGroupWriteIn,
    ScheduleOut,
)


def _group_to_out(group: VenueScheduleGroup) -> ScheduleGroupOut:
    return ScheduleGroupOut(
        id=group.id,
        name=group.name,
        is_active=group.is_active,
        days=sorted(d.day_of_week for d in group.days),
        schedules=[
            ScheduleOut.model_validate(s)
            for s in sorted(group.schedules, key=lambda s: s.start_time)
        ],
        created_at=group.created_at,
        updated_at=group.updated_at,
    )


def _check_owner_or_admin(venue: Venue, user: AuthUser) -> None:
    if user.role == "admin":
        return
    if venue.owner_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to modify this venue.",
        )


def _validate_schedule_overlap(schedules: list[dict]) -> None:
    for i, a in enumerate(schedules):
        for b in schedules[i + 1 :]:
            if a["start_time"] < b["end_time"] and b["start_time"] < a["end_time"]:
                a_label = a.get("name") or "Schedule"
                b_label = b.get("name") or "Schedule"
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail={"schedules": f'"{a_label}" overlaps with "{b_label}".'},
                )


async def _validate_days_available(
    repo: ScheduleGroupRepository,
    venue_id: int,
    days: list[int],
    *,
    exclude_group_id: int | None = None,
) -> None:
    taken = await repo.assigned_days(venue_id, exclude_group_id=exclude_group_id)
    conflicts = sorted(set(days) & taken)
    if conflicts:
        labels = [WEEKDAY_LABELS.get(d, str(d)) for d in conflicts]
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={"days": f"These days are already assigned: {', '.join(labels)}."},
        )


class ScheduleGroupService:
    def __init__(self, db: AsyncSession) -> None:
        self.repo = ScheduleGroupRepository(db)

    async def _get_venue_or_404(self, slug: str) -> Venue:
        venue = await self.repo.get_venue_by_slug(slug)
        if venue is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Venue not found.")
        return venue

    async def _get_group_or_404(self, venue: Venue, group_id: int) -> VenueScheduleGroup:
        group = await self.repo.get_group(venue.id, group_id)
        if group is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Schedule group not found."
            )
        return group

    async def list_groups(self, slug: str) -> list[ScheduleGroupOut]:
        venue = await self._get_venue_or_404(slug)
        groups = await self.repo.list_active_groups(venue.id)
        return [_group_to_out(g) for g in groups]

    async def create_group(
        self,
        slug: str,
        payload: ScheduleGroupWriteIn,
        user: AuthUser,
    ) -> ScheduleGroupOut:
        venue = await self._get_venue_or_404(slug)
        _check_owner_or_admin(venue, user)

        schedules = [
            {
                "id": s.id,
                "name": s.name,
                "start_time": s.start_time,
                "end_time": s.end_time,
                "price": s.price,
                "is_available": s.is_available,
            }
            for s in payload.schedules
        ]
        _validate_schedule_overlap(schedules)
        await _validate_days_available(self.repo, venue.id, payload.days)

        group = await self.repo.create(
            venue_id=venue.id,
            name=payload.name,
            is_active=payload.is_active,
            days=payload.days,
            schedules=schedules,
        )
        return _group_to_out(group)
