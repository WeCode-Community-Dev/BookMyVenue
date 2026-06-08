from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models.venue import Venue, Booking
from models.user import User

async def get_user_recommendations(db: AsyncSession, user_id: int, limit: int = 5):
    # 1. Fetch user's past bookings
    stmt = select(Booking).where(Booking.user_id == user_id).order_by(Booking.created_at.desc())
    result = await db.execute(stmt)
    bookings = result.scalars().all()

    # 2. Extract preferences
    if not bookings:
        # If no history, recommend the highest capacity / most popular venues by default
        popular_stmt = select(Venue).where(Venue.status == "APPROVED").order_by(Venue.capacity.desc()).limit(limit)
        pop_res = await db.execute(popular_stmt)
        return pop_res.scalars().all()

    booked_venue_ids = [b.venue_id for b in bookings]
    
    # Get the venues they booked
    venue_stmt = select(Venue).where(Venue.id.in_(booked_venue_ids))
    venue_res = await db.execute(venue_stmt)
    past_venues = venue_res.scalars().all()

    # Average price they are willing to pay
    prices = [v.price_per_hour for v in past_venues if v.price_per_hour]
    avg_price = sum(prices) / len(prices) if prices else None

    # Collect popular features they like
    preferred_features = {}
    for v in past_venues:
        if v.features:
            for feat, val in v.features.items():
                if str(val).lower() == "true":
                    preferred_features[feat] = preferred_features.get(feat, 0) + 1
                    
    # Sort features by preference
    top_features = sorted(preferred_features, key=preferred_features.get, reverse=True)[:3]

    # 3. Find matching venues (not already booked by them recently)
    rec_stmt = select(Venue).where(
        Venue.status == "APPROVED",
        Venue.id.notin_(booked_venue_ids)
    )

    if avg_price is not None:
        # Price within +/- 40% of their average
        min_p = avg_price * 0.6
        max_p = avg_price * 1.4
        rec_stmt = rec_stmt.where(Venue.price_per_hour >= min_p, Venue.price_per_hour <= max_p)

    rec_res = await db.execute(rec_stmt)
    candidates = rec_res.scalars().all()

    # Rank candidates by how many preferred features they have
    def score_venue(v: Venue) -> int:
        score = 0
        if v.features:
            for feat in top_features:
                if str(v.features.get(feat, "")).lower() == "true":
                    score += 1
        return score

    candidates.sort(key=score_venue, reverse=True)

    return candidates[:limit]
