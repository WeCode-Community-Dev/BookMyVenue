from __future__ import annotations

from decimal import Decimal, InvalidOperation

from geoalchemy2 import Geography
from sqlalchemy import Select, case, cast, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.location import City
from app.models.schedule import VenueSchedule, VenueScheduleGroup
from app.models.venue import Venue

DEFAULT_NEARBY_RADIUS_KM = 75.0
VENUE_SEARCH_SIMILARITY_THRESHOLD = 0.3
ORDERING_FIELDS = frozenset({"min_price", "created_at", "name", "capacity"})
DEFAULT_ORDERING = ("-created_at",)


def min_price_subquery():
    return (
        select(func.min(VenueSchedule.price))
        .select_from(VenueSchedule)
        .join(
            VenueScheduleGroup,
            VenueSchedule.group_id == VenueScheduleGroup.id,
        )
        .where(
            VenueScheduleGroup.venue_id == Venue.id,
            VenueScheduleGroup.is_active.is_(True),
            VenueSchedule.is_available.is_(True),
        )
        .scalar_subquery()
    )


def has_slots_subquery():
    return (
        select(VenueSchedule.id)
        .select_from(VenueSchedule)
        .join(
            VenueScheduleGroup,
            VenueSchedule.group_id == VenueScheduleGroup.id,
        )
        .where(
            VenueScheduleGroup.venue_id == Venue.id,
            VenueScheduleGroup.is_active.is_(True),
        )
        .exists()
    )


def apply_venue_search(query: Select, search: str | None) -> tuple[Select, object | None]:
    """Return ``(query, name_similarity_expr_or_None)``."""
    if not search:
        return query, None

    name_similarity = func.word_similarity(search, Venue.name)
    query = query.where(
        or_(
            Venue.name.ilike(f"%{search}%"),
            name_similarity >= VENUE_SEARCH_SIMILARITY_THRESHOLD,
        )
    )
    return query, name_similarity


def apply_price_and_category_filters(
    query: Select,
    *,
    category_id: int | None,
    min_price: Decimal | None,
    max_price: Decimal | None,
    min_price_col,
) -> Select:
    if category_id is not None:
        query = query.where(Venue.category_id == category_id)
    if min_price is not None:
        query = query.where(min_price_col >= min_price)
    if max_price is not None:
        query = query.where(min_price_col <= max_price)
    return query


async def apply_city_location_filter(
    db: AsyncSession,
    query: Select,
    *,
    city_id: int,
    radius_km: float | None,
) -> tuple[Select, object | None, object | None, str | None]:
    """Return ``(query, location_priority_expr, distance_expr, mode)``."""
    result = await db.execute(select(City).where(City.id == city_id))
    city = result.scalar_one_or_none()
    if city is None:
        return query.where(False), None, None, None

    location_priority = case((Venue.city_id == city_id, 0), else_=1)

    if city.location is None:
        query = query.where(Venue.city_id == city_id)
        return query, location_priority, None, "exact_only"

    radius_m = _resolve_radius_km(radius_km) * 1000.0
    city_geo = cast(City.location, Geography(geometry_type="POINT", srid=4326))
    ref_geo = cast(city.location, Geography(geometry_type="POINT", srid=4326))
    distance = func.ST_Distance(city_geo, ref_geo)

    query = (
        query.join(City, Venue.city_id == City.id)
        .where(or_(Venue.city_id == city_id, City.location.isnot(None)))
        .where(or_(Venue.city_id == city_id, distance <= radius_m))
    )
    return query, location_priority, distance, "distance"


def parse_ordering(ordering: str | None) -> list[str]:
    if not ordering or not ordering.strip():
        return list(DEFAULT_ORDERING)
    fields: list[str] = []
    for part in ordering.split(","):
        token = part.strip()
        if not token:
            continue
        name = token[1:] if token.startswith("-") else token
        if name in ORDERING_FIELDS:
            fields.append(token)
    return fields or list(DEFAULT_ORDERING)


def build_order_by(
    *,
    ordering: list[str],
    min_price_col,
    location_priority_expr,
    distance_expr,
    name_similarity_expr,
    location_order_mode: str | None,
    has_explicit_ordering: bool,
) -> list:
    clauses: list = []

    if location_order_mode == "distance" and location_priority_expr is not None:
        clauses.append(location_priority_expr.asc())
        if distance_expr is not None:
            clauses.append(distance_expr.asc())
    elif location_order_mode == "exact_only" and location_priority_expr is not None:
        clauses.append(location_priority_expr.asc())

    if name_similarity_expr is not None and not has_explicit_ordering:
        clauses.append(name_similarity_expr.desc())
        clauses.extend(_secondary_order_clauses(ordering, min_price_col))
        return clauses

    clauses.extend(_secondary_order_clauses(ordering, min_price_col))
    return clauses


def _secondary_order_clauses(ordering: list[str], min_price_col) -> list:
    mapping = {
        "min_price": min_price_col,
        "created_at": Venue.created_at,
        "name": Venue.name,
        "capacity": Venue.capacity,
    }
    clauses = []
    for token in ordering:
        descending = token.startswith("-")
        name = token[1:] if descending else token
        column = mapping[name]
        clauses.append(column.desc() if descending else column.asc())
    return clauses


def parse_decimal(value: str | float | int | None) -> Decimal | None:
    if value in (None, ""):
        return None
    try:
        return Decimal(str(value))
    except (InvalidOperation, TypeError, ValueError):
        return None


def _resolve_radius_km(value: float | None) -> float:
    if value is None or value <= 0:
        return DEFAULT_NEARBY_RADIUS_KM
    return float(value)
