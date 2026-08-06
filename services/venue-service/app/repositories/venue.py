from __future__ import annotations

from decimal import Decimal

from sqlalchemy import Select, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.dependencies.auth import AuthUser
from app.models.category import VenueCategory
from app.models.enums import VenueStatus
from app.models.location import City
from app.models.schedule import VenueSchedule, VenueScheduleGroup
from app.models.venue import Venue, VenueImage
from app.services.venue_filters import (
    apply_city_location_filter,
    apply_price_and_category_filters,
    apply_venue_search,
    build_order_by,
    has_slots_subquery,
    min_price_subquery,
    parse_ordering,
)


class VenueRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    def _detail_options(self):
        return (
            selectinload(Venue.category),
            selectinload(Venue.city).selectinload(City.district),
            selectinload(Venue.images),
        )

    async def get_active_category(self, category_id: int) -> VenueCategory | None:
        result = await self.db.execute(
            select(VenueCategory).where(
                VenueCategory.id == category_id,
                VenueCategory.is_active.is_(True),
            )
        )
        return result.scalar_one_or_none()

    async def get_city(self, city_id: int) -> City | None:
        result = await self.db.execute(select(City).where(City.id == city_id))
        return result.scalar_one_or_none()

    async def get_by_slug(self, slug: str) -> Venue | None:
        result = await self.db.execute(
            select(Venue)
            .options(*self._detail_options())
            .where(Venue.slug == slug)
        )
        return result.scalar_one_or_none()

    async def create(
        self,
        *,
        owner_id: int,
        category_id: int,
        city_id: int,
        name: str,
        slug: str,
        description: str | None,
        address: str,
        google_maps_url: str | None,
        capacity: int,
        booking_type: str,
        contact_name: str,
        contact_phone: str,
        contact_email: str,
        amenities: list,
        images: list[dict],
    ) -> Venue:
        venue = Venue(
            owner_id=owner_id,
            category_id=category_id,
            city_id=city_id,
            name=name,
            slug=slug,
            description=description,
            address=address,
            google_maps_url=google_maps_url,
            capacity=capacity,
            booking_type=booking_type,
            contact_name=contact_name,
            contact_phone=contact_phone,
            contact_email=contact_email,
            amenities=amenities,
            status=VenueStatus.PENDING_APPROVAL.value,
        )
        self.db.add(venue)
        await self.db.flush()

        for index, image in enumerate(images):
            sort_order = image.get("sort_order")
            if sort_order is None:
                sort_order = index
            self.db.add(
                VenueImage(
                    venue_id=venue.id,
                    image_url=image["image_url"],
                    is_cover=bool(image.get("is_cover", False)),
                    sort_order=sort_order,
                )
            )
        await self.db.flush()

        created = await self.get_by_slug(venue.slug)
        assert created is not None
        return created

    async def list_venues(
        self,
        *,
        user: AuthUser | None,
        mine: bool,
        search: str | None,
        category_id: int | None,
        min_price: Decimal | None,
        max_price: Decimal | None,
        city_id: int | None,
        radius_km: float | None,
        ordering: str | None,
        page: int,
        limit: int,
    ) -> tuple[list[tuple[Venue, Decimal | None, bool]], int]:
        min_price_col = min_price_subquery()
        has_slots_col = has_slots_subquery()

        query: Select = select(
            Venue,
            min_price_col.label("min_price"),
            has_slots_col.label("has_slots"),
        ).options(*self._detail_options())
        query = self._apply_visibility(query, user=user, mine=mine)

        search_term = search.strip() if search else None
        query, name_similarity_expr = apply_venue_search(query, search_term)

        query = apply_price_and_category_filters(
            query,
            category_id=category_id,
            min_price=min_price,
            max_price=max_price,
            min_price_col=min_price_col,
        )

        location_priority_expr = None
        distance_expr = None
        location_order_mode = None
        if city_id is not None:
            (
                query,
                location_priority_expr,
                distance_expr,
                location_order_mode,
            ) = await apply_city_location_filter(
                self.db,
                query,
                city_id=city_id,
                radius_km=radius_km,
            )

        has_explicit_ordering = bool(ordering and ordering.strip())
        ordering_fields = parse_ordering(ordering)
        order_by = build_order_by(
            ordering=ordering_fields,
            min_price_col=min_price_col,
            location_priority_expr=location_priority_expr,
            distance_expr=distance_expr,
            name_similarity_expr=name_similarity_expr,
            location_order_mode=location_order_mode,
            has_explicit_ordering=has_explicit_ordering,
        )
        query = query.order_by(*order_by)

        count_query = select(func.count()).select_from(
            query.order_by(None).with_only_columns(Venue.id).subquery()
        )
        total = int((await self.db.execute(count_query)).scalar_one())

        offset = (page - 1) * limit
        result = await self.db.execute(query.offset(offset).limit(limit))
        rows: list[tuple[Venue, Decimal | None, bool]] = []
        for row in result.all():
            venue = row[0]
            min_price_value = row[1]
            has_slots = bool(row[2])
            rows.append((venue, min_price_value, has_slots))
        return rows, total

    def _apply_visibility(
        self,
        query: Select,
        *,
        user: AuthUser | None,
        mine: bool,
    ) -> Select:
        if mine and user is not None and user.role == "venue":
            return query.where(Venue.owner_id == user.id)
        if mine and user is not None and user.role == "admin":
            return query
        return query.where(
            Venue.is_active.is_(True),
            Venue.status == VenueStatus.APPROVED.value,
        )

    async def min_price_for_venue(self, venue_id: int) -> Decimal | None:
        result = await self.db.execute(
            select(func.min(VenueSchedule.price))
            .select_from(VenueSchedule)
            .join(
                VenueScheduleGroup,
                VenueSchedule.group_id == VenueScheduleGroup.id,
            )
            .where(
                VenueScheduleGroup.venue_id == venue_id,
                VenueScheduleGroup.is_active.is_(True),
                VenueSchedule.is_available.is_(True),
            )
        )
        value = result.scalar_one()
        return Decimal(value) if value is not None else None
