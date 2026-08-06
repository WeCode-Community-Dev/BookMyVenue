from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.dependencies.auth import AuthUser, require_venue_manager
from app.schemas.schedule_group import ScheduleGroupOut, ScheduleGroupWriteIn
from app.services.schedule_group import ScheduleGroupService

router = APIRouter(prefix="/venues/{slug}/schedule-groups", tags=["schedule-groups"])


@router.get("/", response_model=list[ScheduleGroupOut])
async def list_schedule_groups(
    slug: str,
    db: AsyncSession = Depends(get_db),
) -> list[ScheduleGroupOut]:
    """List active schedule groups for a venue (public)."""
    return await ScheduleGroupService(db).list_groups(slug)


@router.post("/", response_model=ScheduleGroupOut, status_code=status.HTTP_201_CREATED)
async def create_schedule_group(
    slug: str,
    payload: ScheduleGroupWriteIn,
    user: AuthUser = Depends(require_venue_manager),
    db: AsyncSession = Depends(get_db),
) -> ScheduleGroupOut:
    """Create a schedule group for a venue (venue owner or admin only)."""
    return await ScheduleGroupService(db).create_group(slug, payload, user)
