"""Seed demo data for local development only."""
from datetime import timedelta, timezone
from datetime import datetime

from sqlalchemy import select

from app.core.security import hash_password
from app.modules.bookings.model import Booking, BookingStatus
from app.modules.users.model import User, UserRole
from app.modules.venues.model import Venue, VenueStatus, VenueType


def seed_demo_data(db) -> None:  # noqa: ANN001
    if db.scalar(select(User).where(User.email == "admin@example.com")):
        return  # already seeded

    admin = User(
        email="admin@example.com",
        name="Admin",
        password_hash=hash_password("admin123"),
        role=UserRole.admin,
    )
    owner = User(
        email="owner@example.com",
        name="Venue Owner",
        password_hash=hash_password("owner123"),
        role=UserRole.owner,
    )
    user = User(
        email="user@example.com",
        name="Demo User",
        password_hash=hash_password("user123"),
        role=UserRole.user,
    )
    db.add_all([admin, owner, user])
    db.flush()

    sample_venues = [
        Venue(
            owner_id=owner.id,
            name="Grand Birthday Hall",
            type=VenueType.birthday_hall,
            description="Spacious hall perfect for birthday parties.",
            address="123 Party St, Downtown",
            lat=12.9716,
            lng=77.5946,
            price_per_hour=50.0,
            capacity=200,
            photos=[],
            amenities=["parking", "catering", "ac"],
            status=VenueStatus.approved,
        ),
        Venue(
            owner_id=owner.id,
            name="Cozy Corner Cafe",
            type=VenueType.cafe,
            description="Intimate cafe for small meetups.",
            address="45 Coffee Ln, Midtown",
            lat=12.9650,
            lng=77.6000,
            price_per_hour=20.0,
            capacity=40,
            photos=[],
            amenities=["wifi", "coffee"],
            status=VenueStatus.approved,
        ),
        Venue(
            owner_id=owner.id,
            name="Skyline Auditorium",
            type=VenueType.auditorium,
            description="Large auditorium for events and conferences.",
            address="88 Skyline Ave, Uptown",
            lat=12.9800,
            lng=77.5800,
            price_per_hour=120.0,
            capacity=800,
            photos=[],
            amenities=["ac", "projector", "parking"],
            status=VenueStatus.pending,
        ),
    ]
    db.add_all(sample_venues)
    db.flush()

    start = datetime.now(timezone.utc) + timedelta(days=7)
    booking = Booking(
        user_id=user.id,
        venue_id=sample_venues[0].id,
        start_at=start,
        end_at=start + timedelta(hours=3),
        status=BookingStatus.confirmed,
        total_price=150.0,
    )
    db.add(booking)
    db.commit()
