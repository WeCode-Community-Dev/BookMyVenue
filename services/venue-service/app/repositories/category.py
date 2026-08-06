from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.category import VenueCategory


class CategoryRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def list_active(self) -> list[VenueCategory]:
        result = await self.db.execute(
            select(VenueCategory)
            .where(VenueCategory.is_active.is_(True))
            .order_by(VenueCategory.name)
        )
        return list(result.scalars().all())
