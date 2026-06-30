import math
from typing import Optional

from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.core.exceptions import ForbiddenError, NotFoundError
from app.modules.venues.model import Venue, VenueStatus, VenueType
from app.modules.venues.schemas import VenueSearchParams, VenueUpdate


def search_venues(db: Session, params: VenueSearchParams) -> list[Venue]:
    stmt = select(Venue).where(Venue.status == VenueStatus.approved)

    if params.type:
        stmt = stmt.where(Venue.type == params.type)
    if params.min_price is not None:
        stmt = stmt.where(Venue.price_per_hour >= params.min_price)
    if params.max_price is not None:
        stmt = stmt.where(Venue.price_per_hour <= params.max_price)
    if params.min_capacity is not None:
        stmt = stmt.where(Venue.capacity >= params.min_capacity)
    if params.q:
        like = f"%{params.q}%"
        stmt = stmt.where(
            or_(Venue.name.ilike(like), Venue.address.ilike(like))
        )

    venues = list(db.scalars(stmt))

    # Location radius filtering in Python (SQLite has no native geo).
    # Apply the radius filter to the full candidate set BEFORE pagination so
    # the page is sliced from the actually-in-range results.
    if params.lat is not None and params.lng is not None:
        radius = params.radius_km if params.radius_km is not None else 10.0
        results = []
        for v in venues:
            if v.lat is None or v.lng is None:
                continue
            dist = haversine(params.lat, params.lng, v.lat, v.lng)
            if dist <= radius:
                v.distance_km = round(dist, 2)
                results.append(v)
        results.sort(key=lambda x: x.distance_km or 0.0)
        venues = results

    return venues[params.skip : params.skip + params.limit]


def haversine(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    earth_radius_km = 6371.0
    d_lat = math.radians(lat2 - lat1)
    d_lng = math.radians(lng2 - lng1)
    a = (
        math.sin(d_lat / 2) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(d_lng / 2) ** 2
    )
    return earth_radius_km * 2 * math.asin(math.sqrt(a))


def get_venue(db: Session, venue_id: int) -> Venue:
    venue = db.get(Venue, venue_id)
    if not venue:
        raise NotFoundError("Venue not found")
    return venue


def get_approved_venue(db: Session, venue_id: int) -> Venue:
    venue = get_venue(db, venue_id)
    if venue.status != VenueStatus.approved:
        raise NotFoundError("Venue not available")
    return venue


def create_venue(db: Session, owner_id: int, data) -> Venue:  # noqa: ANN001
    venue = Venue(
        owner_id=owner_id,
        name=data.name,
        type=data.type,
        description=data.description,
        address=data.address,
        lat=data.lat,
        lng=data.lng,
        price_per_hour=data.price_per_hour,
        capacity=data.capacity,
        photos=data.photos,
        amenities=data.amenities,
        status=VenueStatus.pending,
    )
    db.add(venue)
    db.commit()
    db.refresh(venue)
    return venue


def update_venue(db: Session, venue: Venue, owner_id: int, data: VenueUpdate) -> Venue:
    if venue.owner_id != owner_id:
        raise ForbiddenError("You do not own this venue")
    updates = data.model_dump(exclude_unset=True)
    for field, value in updates.items():
        setattr(venue, field, value)
    db.commit()
    db.refresh(venue)
    return venue


def list_owner_venues(db: Session, owner_id: int) -> list[Venue]:
    return list(db.scalars(select(Venue).where(Venue.owner_id == owner_id)))


def list_pending_venues(db: Session, skip: int = 0, limit: int = 50) -> list[Venue]:
    stmt = (
        select(Venue)
        .where(Venue.status == VenueStatus.pending)
        .order_by(Venue.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    return list(db.scalars(stmt))


def list_all_venues(db: Session, skip: int = 0, limit: int = 50) -> list[Venue]:
    stmt = (
        select(Venue)
        .order_by(Venue.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    return list(db.scalars(stmt))


def set_venue_status(db: Session, venue: Venue, status: VenueStatus) -> Venue:
    venue.status = status
    db.commit()
    db.refresh(venue)
    return venue


def count_by_status(db: Session, status: Optional[VenueStatus] = None) -> int:
    stmt = select(func.count()).select_from(Venue)
    if status is not None:
        stmt = stmt.where(Venue.status == status)
    return int(db.scalar(stmt) or 0)
