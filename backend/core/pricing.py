from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models.venue import Venue, Booking
from datetime import datetime, timezone, timedelta

async def calculate_dynamic_pricing(db: AsyncSession, venue_id: int, capacity: int, inventory_type: str):
    # Fetch active bookings for the next 7 days
    now = datetime.now(timezone.utc)
    next_week = now + timedelta(days=7)

    stmt = select(Booking).where(
        Booking.venue_id == venue_id,
        Booking.status == "CONFIRMED",
        Booking.start_time >= now,
        Booking.start_time <= next_week
    )
    result = await db.execute(stmt)
    upcoming_bookings = result.scalars().all()

    if not upcoming_bookings:
        return 1.0

    total_tickets = sum(b.tickets_count for b in upcoming_bookings)
    
    # Calculate a rough "occupancy" metric
    # Let's say a venue can host 3 events a day * 7 days = 21 slots.
    # Total possible tickets = capacity * 21
    if inventory_type == "entire_venue":
        occupancy = len(upcoming_bookings) / 21.0
    else:
        occupancy = total_tickets / (capacity * 21.0) if capacity else 0

    if occupancy > 0.8:
        return 1.5
    elif occupancy > 0.5:
        return 1.2
    
    return 1.0

async def apply_dynamic_pricing(db: AsyncSession, venues: list[Venue]):
    for v in venues:
        if v.price_per_hour is not None:
            multiplier = await calculate_dynamic_pricing(db, v.id, v.capacity, v.inventory_type)
            # We monkey-patch the ORM object temporarily for the response
            setattr(v, 'dynamic_multiplier', multiplier)
            setattr(v, 'dynamic_price', round(v.price_per_hour * multiplier, 2))
        else:
            setattr(v, 'dynamic_multiplier', 1.0)
            setattr(v, 'dynamic_price', None)
    return venues
