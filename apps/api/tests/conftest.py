import time
from datetime import date, timedelta
from datetime import time as dt_time
from uuid import UUID, uuid4

import pytest
from fastapi.testclient import TestClient
from jose import jwt
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.config import settings

# Hard stop if the DATABASE_URL looks like a real/production database.
# .env.test should always point to a local throwaway DB.
_db_url = settings.database_url
assert "supabase.co" not in _db_url, (
    "Tests must not run against Supabase. Set DATABASE_URL in apps/api/.env.test."
)
assert any(h in _db_url for h in ("localhost", "127.0.0.1", "0.0.0.0")), (
    "Tests must use a local database. Set DATABASE_URL in apps/api/.env.test."
)
from app.core.database import SessionLocal  # noqa: E402 -- must follow the DB safety check above
from app.main import app  # noqa: E402
from app.modules.profile.models import (  # noqa: E402
    Profile,
    ProfileStatus,
    UserRole,
    UserRoleAssignment,
)
from app.modules.venue.models import Venue, VenueCategory, VenueStatus  # noqa: E402

# ── Session-scoped: seed one category for the whole run ──────────────────────

@pytest.fixture(scope="session")
def category_id() -> UUID:
    db = SessionLocal()
    try:
        db.execute(text("TRUNCATE venue_categories CASCADE"))
        db.commit()
        cat = VenueCategory(slug="test-hall", label="Test Hall", is_active=True, sort_order=0)
        db.add(cat)
        db.commit()
        db.refresh(cat)
        return cat.id
    finally:
        db.close()


# ── Function-scoped: fresh DB state per test ─────────────────────────────────

@pytest.fixture
def db() -> Session:
    session = SessionLocal()
    yield session
    session.rollback()
    session.execute(text("TRUNCATE profiles CASCADE"))
    session.commit()
    session.close()


@pytest.fixture
def client() -> TestClient:
    return TestClient(app)


# ── Helpers (plain functions, not fixtures) ───────────────────────────────────

def make_token(user_id: UUID, email: str) -> str:
    now = int(time.time())
    return jwt.encode(
        {
            "sub": str(user_id),
            "email": email,
            "aud": "authenticated",
            "iat": now,
            "exp": now + 3600,
        },
        settings.supabase_jwt_secret,
        algorithm="HS256",
    )


def seed_user(db: Session, role: str) -> tuple[UUID, str]:
    """Insert a profile + role row. Returns (user_id, bearer_token)."""
    user_id = uuid4()
    email = f"{role}-{user_id.hex[:6]}@test.com"
    db.add(Profile(id=user_id, email=email, status=ProfileStatus.active))
    db.add(UserRoleAssignment(user_id=user_id, role=UserRole(role)))
    db.commit()
    return user_id, make_token(user_id, email)


def create_booking(client, token: str, venue_id: UUID, booking_date: date | None = None):
    """POST /api/bookings/ and return the raw response."""
    return client.post(
        "/api/bookings/",
        json={
            "venue_id": str(venue_id),
            "venue_name": "Test Venue",
            "venue_cover_image": None,
            "booking_type": "full_day",
            "booking_date": (booking_date or date.today() + timedelta(days=30)).isoformat(),
            "guest_count": 10,
            "event_type": "corporate",
            "user_notes": "test",
        },
        headers={"Authorization": f"Bearer {token}"},
    )


def seed_approved_venue(db: Session, owner_id: UUID, category_id: UUID) -> UUID:
    """Insert a fully approved, active venue ready to accept bookings."""
    venue_id = uuid4()
    db.add(Venue(
        id=venue_id,
        owner_id=owner_id,
        category_id=category_id,
        name="Test Venue",
        slug=f"test-venue-{venue_id.hex[:6]}",
        address_line1="123 Test St",
        city="Mumbai",
        state="Maharashtra",
        country="India",
        timezone="Asia/Kolkata",
        max_capacity=100,
        open_time=dt_time(9, 0),
        close_time=dt_time(21, 0),
        allowed_booking_types=["full_day"],
        min_booking_duration_minutes=60,
        max_booking_duration_minutes=1440,
        slot_interval_minutes=30,
        pre_buffer_minutes=0,
        post_buffer_minutes=0,
        pricing_mode="flat",
        starting_price_paise=1_000_000,
        platform_commission_pct=10,
        advance_pct=30,
        balance_due_days_before_event=7,
        owner_action_window_hours=48,
        overdue_advance_refund_pct=0,
        status=VenueStatus.approved,
        is_active=True,
    ))
    db.commit()
    return venue_id
