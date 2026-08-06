from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.category import CategoryRepository
from app.repositories.location import LocationRepository
from app.schemas.catalog import (
    CityDropdownOut,
    CityOptionOut,
    DistrictCityGroupOut,
    DistrictOut,
    VenueCategoryOut,
)


class CatalogService:
    def __init__(self, db: AsyncSession) -> None:
        self.category_repo = CategoryRepository(db)
        self.location_repo = LocationRepository(db)

    async def list_categories(self) -> list[VenueCategoryOut]:
        categories = await self.category_repo.list_active()
        return [VenueCategoryOut.model_validate(c) for c in categories]

    async def list_districts(self) -> list[DistrictOut]:
        districts = await self.location_repo.list_districts()
        return [DistrictOut.model_validate(d) for d in districts]

    async def list_cities(
        self,
        *,
        district_id: int | None = None,
    ) -> list[CityDropdownOut]:
        cities = await self.location_repo.list_cities(district_id=district_id)
        return [CityDropdownOut.model_validate(c) for c in cities]

    async def list_location_groups(self) -> list[DistrictCityGroupOut]:
        districts = await self.location_repo.list_location_groups()
        return [
            DistrictCityGroupOut(
                id=district.id,
                name=district.name,
                cities=[
                    CityOptionOut.model_validate(city)
                    for city in sorted(district.cities, key=lambda c: c.name)
                ],
            )
            for district in districts
        ]
