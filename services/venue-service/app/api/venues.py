from fastapi import APIRouter, Depends, Query, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.dependencies.auth import AuthUser, get_optional_user, require_venue_manager
from app.schemas.catalog import (
    CityDropdownOut,
    DistrictCityGroupOut,
    DistrictOut,
    VenueCategoryOut,
)
from app.schemas.venue import PaginatedVenueListOut, VenueDetailOut, VenueWriteIn
from app.services.catalog import CatalogService
from app.services.venue import VenueService

router = APIRouter(prefix="/venues", tags=["venues"])


@router.get("/categories", response_model=list[VenueCategoryOut])
async def list_categories(
    db: AsyncSession = Depends(get_db),
) -> list[VenueCategoryOut]:
    """List active venue categories."""
    return await CatalogService(db).list_categories()


@router.get("/districts", response_model=list[DistrictOut])
async def list_districts(
    db: AsyncSession = Depends(get_db),
) -> list[DistrictOut]:
    """List all districts."""
    return await CatalogService(db).list_districts()


@router.get("/cities", response_model=list[CityDropdownOut])
async def list_cities(
    district_id: int | None = Query(None),
    db: AsyncSession = Depends(get_db),
) -> list[CityDropdownOut]:
    """List cities, optionally filtered by district_id."""
    return await CatalogService(db).list_cities(district_id=district_id)


@router.get("/location-groups", response_model=list[DistrictCityGroupOut])
async def list_location_groups(
    db: AsyncSession = Depends(get_db),
) -> list[DistrictCityGroupOut]:
    """List districts with their nested cities (for location pickers)."""
    return await CatalogService(db).list_location_groups()


@router.get("/", response_model=PaginatedVenueListOut)
async def list_venues(
    request: Request,
    mine: bool = Query(False),
    search: str | None = Query(None),
    category_id: int | None = Query(None),
    min_price: str | None = Query(None),
    max_price: str | None = Query(None),
    city_id: int | None = Query(None),
    radius_km: float | None = Query(None),
    ordering: str | None = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(12, ge=1, le=50),
    user: AuthUser | None = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
) -> PaginatedVenueListOut:
    """List venues with Django-compatible filters and pagination."""
    return await VenueService(db).list_venues(
        request=request,
        user=user,
        mine=mine,
        search=search,
        category_id=category_id,
        min_price=min_price,
        max_price=max_price,
        city_id=city_id,
        radius_km=radius_km,
        ordering=ordering,
        page=page,
        limit=limit,
    )


@router.post("/", response_model=VenueDetailOut, status_code=status.HTTP_201_CREATED)
async def create_venue(
    payload: VenueWriteIn,
    user: AuthUser = Depends(require_venue_manager),
    db: AsyncSession = Depends(get_db),
) -> VenueDetailOut:
    """Create a venue (venue owners and admins only)."""
    return await VenueService(db).create_venue(user=user, payload=payload)
