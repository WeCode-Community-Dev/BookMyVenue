from __future__ import annotations

from decimal import Decimal

from fastapi import HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.auth import AuthUser
from app.models.venue import Venue, VenueImage
from app.repositories.venue import VenueRepository
from app.schemas.venue import (
    PaginatedVenueListOut,
    VenueDetailOut,
    VenueListItemOut,
    VenueWriteIn,
)
from app.services.venue_filters import parse_decimal
from app.utils.slug import generate_unique_venue_slug


class VenueService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.repo = VenueRepository(db)

    async def list_venues(
        self,
        *,
        request: Request,
        user: AuthUser | None,
        mine: bool = False,
        search: str | None = None,
        category_id: int | None = None,
        min_price: str | float | int | None = None,
        max_price: str | float | int | None = None,
        city_id: int | None = None,
        radius_km: float | None = None,
        ordering: str | None = None,
        page: int = 1,
        limit: int = 12,
    ) -> PaginatedVenueListOut:
        rows, total = await self.repo.list_venues(
            user=user,
            mine=mine,
            search=search,
            category_id=category_id,
            min_price=parse_decimal(min_price),
            max_price=parse_decimal(max_price),
            city_id=city_id,
            radius_km=radius_km,
            ordering=ordering,
            page=page,
            limit=limit,
        )

        results = [
            self._to_list_item(venue, min_price_value, has_slots)
            for venue, min_price_value, has_slots in rows
        ]
        return PaginatedVenueListOut(
            count=total,
            next=self._page_link(request, page=page + 1, limit=limit, total=total),
            previous=self._page_link(request, page=page - 1, limit=limit, total=total),
            results=results,
        )

    async def create_venue(
        self,
        *,
        user: AuthUser,
        payload: VenueWriteIn,
    ) -> VenueDetailOut:
        category = await self.repo.get_active_category(payload.category_id)
        if category is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={"category_id": ["Invalid category."]},
            )

        city = await self.repo.get_city(payload.city_id)
        if city is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={"city_id": ["Invalid city."]},
            )

        slug = await generate_unique_venue_slug(self.db, payload.name)
        images = [
            {
                "image_url": image.image_url,
                "is_cover": image.is_cover,
                "sort_order": image.sort_order,
            }
            for image in payload.images
        ]

        venue = await self.repo.create(
            owner_id=user.id,
            category_id=payload.category_id,
            city_id=payload.city_id,
            name=payload.name,
            slug=slug,
            description=payload.description,
            address=payload.address,
            google_maps_url=payload.google_maps_url,
            capacity=payload.capacity,
            booking_type=payload.booking_type.value,
            contact_name=payload.contact_name,
            contact_phone=payload.contact_phone,
            contact_email=payload.contact_email,
            amenities=payload.amenities,
            images=images,
        )
        min_price = await self.repo.min_price_for_venue(venue.id)
        return self._to_detail(venue, min_price)

    def _to_list_item(
        self,
        venue: Venue,
        min_price: Decimal | None,
        has_slots: bool,
    ) -> VenueListItemOut:
        return VenueListItemOut(
            slug=venue.slug,
            name=venue.name,
            address=venue.address,
            capacity=venue.capacity,
            status=venue.status,
            is_active=venue.is_active,
            booking_type=venue.booking_type,
            category=venue.category,
            city=venue.city,
            min_price=min_price,
            has_slots=has_slots,
            cover_image=self._cover_image_url(venue),
            average_rating=venue.average_rating,
            review_count=venue.review_count,
            created_at=venue.created_at,
        )

    def _to_detail(self, venue: Venue, min_price: Decimal | None) -> VenueDetailOut:
        return VenueDetailOut(
            id=venue.id,
            slug=venue.slug,
            owner_id=venue.owner_id,
            name=venue.name,
            description=venue.description,
            address=venue.address,
            google_maps_url=venue.google_maps_url,
            capacity=venue.capacity,
            contact_name=venue.contact_name,
            contact_phone=venue.contact_phone,
            contact_email=venue.contact_email,
            status=venue.status,
            amenities=venue.amenities or [],
            booking_type=venue.booking_type,
            is_active=venue.is_active,
            category=venue.category,
            city=venue.city,
            images=sorted(venue.images, key=lambda img: img.sort_order),
            min_price=min_price,
            average_rating=venue.average_rating,
            review_count=venue.review_count,
            created_at=venue.created_at,
            updated_at=venue.updated_at,
        )

    @staticmethod
    def _cover_image_url(venue: Venue) -> str | None:
        images: list[VenueImage] = list(venue.images)
        if not images:
            return None
        cover = next((image for image in images if image.is_cover), None)
        image = cover or min(images, key=lambda item: item.sort_order)
        return image.image_url

    @staticmethod
    def _page_link(
        request: Request,
        *,
        page: int,
        limit: int,
        total: int,
    ) -> str | None:
        if page < 1 or total == 0:
            return None
        max_page = (total + limit - 1) // limit
        if page > max_page:
            return None
        query = dict(request.query_params)
        query["page"] = str(page)
        query["limit"] = str(limit)
        return str(request.url.replace_query_params(**query))
