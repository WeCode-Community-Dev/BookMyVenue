from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.location import City, District


class LocationRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def list_districts(self) -> list[District]:
        result = await self.db.execute(select(District).order_by(District.name))
        return list(result.scalars().all())

    async def list_cities(self, *, district_id: int | None = None) -> list[City]:
        query = (
            select(City)
            .join(District)
            .options(selectinload(City.district))
            .order_by(District.name, City.name)
        )
        if district_id is not None:
            query = query.where(City.district_id == district_id)
        result = await self.db.execute(query)
        return list(result.scalars().unique().all())

    async def list_location_groups(self) -> list[District]:
        """Districts that have at least one city, with cities preloaded."""
        result = await self.db.execute(
            select(District)
            .join(District.cities)
            .options(selectinload(District.cities))
            .order_by(District.name)
            .distinct()
        )
        return list(result.scalars().unique().all())
