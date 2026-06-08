from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
import redis.asyncio as redis
from typing import List

from core.database import get_db
from core.redis import get_redis
from core.notifications import notify_booking_status
from schemas.venue import (
    VenueCreate,
    VenueUpdate,
    VenueResponse,
    BookingRequest,
    BookingResponse,
    BookingStatusUpdate,
)
from models.venue import Venue, Booking
from models.user import User
from crud.booking import create_booking, get_venue_availability
from api.dependencies import get_current_user, get_current_active_admin_or_owner

router = APIRouter()


@router.post("/", response_model=VenueResponse)
async def create_venue(
    venue_req: VenueCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_admin_or_owner),
):
    new_venue = Venue(
        name=venue_req.name,
        location=venue_req.location,
        capacity=venue_req.capacity,
        price_per_hour=venue_req.price_per_hour,
        latitude=venue_req.latitude,
        longitude=venue_req.longitude,
        geom=f"SRID=4326;POINT({venue_req.longitude} {venue_req.latitude})" if venue_req.longitude and venue_req.latitude else None,
        photos=venue_req.photos,
        inventory_type=venue_req.inventory_type,
        features=venue_req.features,
        owner_id=current_user.id,
    )
    db.add(new_venue)
    await db.commit()
    await db.refresh(new_venue)
    return new_venue


@router.put("/{venue_id}", response_model=VenueResponse)
async def update_venue(
    venue_id: int,
    venue_req: VenueUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_admin_or_owner),
):
    result = await db.execute(select(Venue).where(Venue.id == venue_id))
    venue = result.scalars().first()
    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")

    if venue.owner_id != current_user.id and current_user.role != "SUPER_ADMIN":
        raise HTTPException(
            status_code=403, detail="You do not have permission to edit this venue"
        )

    update_data = venue_req.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(venue, key, value)

    await db.commit()
    await db.refresh(venue)
    return venue


@router.get("/my-venues", response_model=List[VenueResponse])
async def list_my_venues(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_admin_or_owner),
):
    result = await db.execute(
        select(Venue)
        .options(selectinload(Venue.owner))
        .where(Venue.owner_id == current_user.id)
    )
    venues = result.scalars().all()
    from core.pricing import apply_dynamic_pricing
    venues = await apply_dynamic_pricing(db, venues)
    return venues


@router.get("/my-bookings", response_model=List[BookingResponse])
async def list_my_bookings(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Booking)
        .options(selectinload(Booking.venue))
        .where(Booking.user_id == current_user.id)
        .order_by(Booking.start_time.desc())
    )
    bookings = result.scalars().all()
    return bookings


@router.get("/my-recommendations", response_model=List[VenueResponse])
async def get_my_recommendations(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    from core.recommendations import get_user_recommendations
    from core.pricing import apply_dynamic_pricing
    venues = await get_user_recommendations(db, current_user.id)
    venues = await apply_dynamic_pricing(db, venues)
    return venues

from geoalchemy2.types import Geography
from sqlalchemy import func, String
from typing import Optional

@router.get("/", response_model=List[VenueResponse])
@limiter.limit("20/minute")
async def list_venues(
    request: Request,
    db: AsyncSession = Depends(get_db),
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    location: Optional[str] = None,
    min_capacity: Optional[int] = None,
    facilities: Optional[str] = None,
    user_lat: Optional[float] = None,
    user_lng: Optional[float] = None,
    max_distance: Optional[float] = None,
    search: Optional[str] = None,
    sort: Optional[str] = "newest",
    skip: int = 0,
    limit: int = 20,
):
    query = select(Venue).options(selectinload(Venue.owner))

    if search:
        from sqlalchemy import or_
        query = query.where(
            or_(
                Venue.name.ilike(f"%{search}%"),
                Venue.location.ilike(f"%{search}%")
            )
        )


    if min_price is not None:
        query = query.where(Venue.price_per_hour >= min_price)
    if max_price is not None:
        query = query.where(Venue.price_per_hour <= max_price)
    if location:
        query = query.where(Venue.location.ilike(f"%{location}%"))
    if min_capacity is not None:
        query = query.where(Venue.capacity >= min_capacity)

    if user_lat is not None and user_lng is not None and max_distance is not None:
        point = func.ST_SetSRID(func.ST_MakePoint(user_lng, user_lat), 4326)
        query = query.where(
            func.ST_DWithin(
                func.cast(Venue.geom, Geography),
                func.cast(point, Geography),
                max_distance * 1000  # meters
            )
        )

    if facilities:
        fac_list = [f.strip() for f in facilities.split(",")]
        for f in fac_list:
            # Use JSON extraction assuming features is a JSONB/JSON dict of booleans
            query = query.where(
                func.cast(Venue.features.op("->>")(f), String).ilike("true")
            )

    if sort == "price_asc":
        query = query.order_by(Venue.price_per_hour.asc())
    elif sort == "price_desc":
        query = query.order_by(Venue.price_per_hour.desc())
    elif sort == "capacity_asc":
        query = query.order_by(Venue.capacity.asc())
    elif sort == "capacity_desc":
        query = query.order_by(Venue.capacity.desc())
    else:  # default to newest
        query = query.order_by(Venue.id.desc())

    query = query.offset(skip).limit(limit)

    result = await db.execute(query)
    venues = result.scalars().all()
    from core.pricing import apply_dynamic_pricing
    venues = await apply_dynamic_pricing(db, venues)

    return venues


@router.get("/{venue_id}", response_model=VenueResponse)
async def get_venue(venue_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Venue).where(Venue.id == venue_id))
    venue = result.scalars().first()
    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")
    from core.pricing import apply_dynamic_pricing
    venue = (await apply_dynamic_pricing(db, [venue]))[0]
    return venue


@router.post("/book", response_model=BookingResponse)
@limiter.limit("5/minute")
async def book_venue(
    request: Request,
    booking_req: BookingRequest,
    db: AsyncSession = Depends(get_db),
    redis_client: redis.Redis = Depends(get_redis),
    current_user: User = Depends(get_current_user),
):
    booking = await create_booking(db, redis_client, booking_req, current_user.id)
    return booking


from datetime import datetime


@router.get("/{venue_id}/availability")
async def check_availability(
    venue_id: int,
    start_time: datetime,
    end_time: datetime,
    db: AsyncSession = Depends(get_db),
    redis_client: redis.Redis = Depends(get_redis),
):
    availability = await get_venue_availability(
        db, redis_client, venue_id, start_time, end_time
    )
    return availability


@router.get("/{venue_id}/bookings", response_model=List[BookingResponse])
async def list_venue_bookings(
    venue_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_admin_or_owner),
):
    result = await db.execute(select(Venue).where(Venue.id == venue_id))
    venue = result.scalar_one_or_none()
    if not venue or (
        venue.owner_id != current_user.id and current_user.role != "SUPER_ADMIN"
    ):
        raise HTTPException(status_code=403, detail="Forbidden")

    result = await db.execute(
        select(Booking)
        .options(selectinload(Booking.user))
        .where(Booking.venue_id == venue_id)
        .order_by(Booking.start_time.desc())
    )
    bookings = result.scalars().all()
    return bookings


@router.put("/bookings/{booking_id}/status", response_model=BookingResponse)
async def update_booking_status(
    booking_id: int,
    status_update: BookingStatusUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_admin_or_owner),
):
    result = await db.execute(select(Booking).options(selectinload(Booking.venue), selectinload(Booking.user)).where(Booking.id == booking_id))
    booking = result.scalar_one_or_none()

    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    if booking.venue.owner_id != current_user.id and current_user.role != "SUPER_ADMIN":
        raise HTTPException(status_code=403, detail="Forbidden")

    valid_statuses = ["CONFIRMED", "CANCELLED", "PENDING"]
    new_status = status_update.status.upper()
    if new_status not in valid_statuses:
        raise HTTPException(status_code=400, detail="Invalid status")

    booking.status = new_status
    await db.commit()
    await db.refresh(booking)

    # Trigger Notification
    if booking.user and booking.user.email:
        await notify_booking_status(booking.user.email, booking.venue.name, new_status)

    return booking

@router.get("/my-venues/analytics")
async def get_my_venues_analytics(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_admin_or_owner),
):
    from sqlalchemy import func
    
    # Total Revenue for confirmed bookings
    result_revenue = await db.execute(
        select(func.sum(Booking.tickets_count * func.coalesce(Venue.price_per_hour, 0)))
        .join(Venue)
        .where(Venue.owner_id == current_user.id)
        .where(Booking.status == "CONFIRMED")
    )
    total_revenue = result_revenue.scalar() or 0.0

    # Total Bookings count
    result_count = await db.execute(
        select(func.count(Booking.id))
        .join(Venue)
        .where(Venue.owner_id == current_user.id)
    )
    total_bookings = result_count.scalar() or 0

    return {"total_revenue": total_revenue, "total_bookings": total_bookings}

