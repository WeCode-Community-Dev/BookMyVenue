from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import or_
from fastapi import HTTPException
import redis.asyncio as redis
from models.venue import Venue, Booking
from schemas.venue import BookingRequest
from datetime import datetime, timezone, timedelta


async def create_booking(
    db: AsyncSession,
    redis_client: redis.Redis,
    booking_req: BookingRequest,
    user_id: int,
):
    from sqlalchemy import update
    import json

    max_retries = 3
    for attempt in range(max_retries):
        stmt_venue = select(Venue).where(Venue.id == booking_req.venue_id)
        result = await db.execute(stmt_venue)
        venue = result.scalar_one_or_none()

        if not venue:
            raise HTTPException(status_code=404, detail="Venue not found")

        # Check overlaps
        stmt_overlap = select(Booking).where(
            Booking.venue_id == venue.id,
            Booking.status.in_(["CONFIRMED", "PENDING"]),
            or_(
                Booking.expires_at == None,
                Booking.expires_at > datetime.now(timezone.utc),
            ),
            Booking.start_time < booking_req.end_time,
            Booking.end_time > booking_req.start_time,
        )
        result_overlap = await db.execute(stmt_overlap)
        overlapping_bookings = result_overlap.scalars().all()

        if venue.inventory_type == "entire_venue":
            if len(overlapping_bookings) > 0:
                raise HTTPException(
                    status_code=400,
                    detail="Venue is already booked for this time period",
                )
            tickets_to_book = 1
        else:
            current_booked_tickets = sum([b.tickets_count for b in overlapping_bookings])
            if current_booked_tickets + booking_req.tickets_count > venue.capacity:
                raise HTTPException(
                    status_code=400,
                    detail="Not enough capacity available for this time period",
                )
            tickets_to_book = booking_req.tickets_count

        # OCC Check
        update_stmt = (
            update(Venue)
            .where(Venue.id == venue.id, Venue.version == venue.version)
            .values(version=Venue.version + 1)
        )
        res = await db.execute(update_stmt)
        if res.rowcount == 0:
            if attempt == max_retries - 1:
                raise HTTPException(
                    status_code=409,
                    detail="Server is currently busy processing bookings for this venue. Please try again.",
                )
            # Rollback to fetch fresh data on next iteration
            await db.rollback()
            continue

        new_booking = Booking(
            venue_id=venue.id,
            user_id=user_id,
            status="PENDING",
            start_time=booking_req.start_time,
            end_time=booking_req.end_time,
            tickets_count=tickets_to_book,
            expires_at=datetime.now(timezone.utc) + timedelta(minutes=10),
        )

        db.add(new_booking)
        await db.commit()
        await db.refresh(new_booking)

        # Update cache safely
        cache_key = f"venue:{venue.id}:active_bookings"
        cached_data = await redis_client.get(cache_key)
        if cached_data:
            active_bookings = json.loads(cached_data)
            active_bookings.append({
                "start_time": new_booking.start_time.isoformat(),
                "end_time": new_booking.end_time.isoformat(),
                "tickets_count": new_booking.tickets_count,
            })
            await redis_client.set(cache_key, json.dumps(active_bookings), ex=300)

        return new_booking


async def get_venue_availability(
    db: AsyncSession,
    redis_client: redis.Redis,
    venue_id: int,
    start_time: datetime,
    end_time: datetime,
):
    stmt_venue = select(Venue).where(Venue.id == venue_id)
    result = await db.execute(stmt_venue)
    venue = result.scalar_one_or_none()

    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")

    import json
    cache_key = f"venue:{venue_id}:active_bookings"
    cached_data = await redis_client.get(cache_key)

    overlapping_bookings = []
    if cached_data:
        active_bookings = json.loads(cached_data)
        for b in active_bookings:
            b_start = datetime.fromisoformat(b["start_time"])
            b_end = datetime.fromisoformat(b["end_time"])
            if b_start < end_time and b_end > start_time:
                overlapping_bookings.append({"tickets_count": b["tickets_count"]})
    else:
        stmt_overlap = select(Booking).where(
            Booking.venue_id == venue.id,
            Booking.status.in_(["CONFIRMED", "PENDING"]),
            or_(
                Booking.expires_at == None, Booking.expires_at > datetime.now(timezone.utc)
            ),
        )
        result_overlap = await db.execute(stmt_overlap)
        db_bookings = result_overlap.scalars().all()

        cache_data = []
        for b in db_bookings:
            cache_data.append({
                "start_time": b.start_time.isoformat(),
                "end_time": b.end_time.isoformat(),
                "tickets_count": b.tickets_count,
            })
            if b.start_time < end_time and b.end_time > start_time:
                overlapping_bookings.append({"tickets_count": b.tickets_count})

        await redis_client.set(cache_key, json.dumps(cache_data), ex=300)

    if venue.inventory_type == "entire_venue":
        available_slots = 1 if len(overlapping_bookings) == 0 else 0
        return {
            "inventory_type": "entire_venue",
            "available_slots": available_slots,
            "max_capacity": 1,
            "current_capacity": len(overlapping_bookings),
        }
    else:
        current_booked_tickets = sum([b["tickets_count"] for b in overlapping_bookings])
        available_slots = max(0, venue.capacity - current_booked_tickets)
        return {
            "inventory_type": "capacity_based",
            "available_slots": available_slots,
            "max_capacity": venue.capacity,
            "current_capacity": current_booked_tickets,
        }
