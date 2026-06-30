"""Smoke tests covering the MVP booking flow and role enforcement."""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient  # noqa: E402

from app.db.base import Base  # noqa: E402
from app.db.session import engine, SessionLocal  # noqa: E402
from app.main import app  # noqa: E402

Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)


def _client():
    return TestClient(app)


def test_signup_login_and_booking_flow():
    client = _client()

    owner = client.post(
        "/api/v1/auth/signup",
        json={
            "email": "owner@test.io",
            "name": "Owner",
            "password": "secret123",
            "role": "owner",
        },
    )
    assert owner.status_code == 200, owner.text
    owner_token = owner.json()["access_token"]

    user = client.post(
        "/api/v1/auth/signup",
        json={
            "email": "user@test.io",
            "name": "User",
            "password": "secret123",
            "role": "user",
        },
    )
    assert user.status_code == 200, user.text
    user_token = user.json()["access_token"]

    # Owner creates a venue (goes to pending)
    venue = client.post(
        "/api/v1/owner/venues",
        headers={"Authorization": f"Bearer {owner_token}"},
        json={
            "name": "Test Hall",
            "type": "birthday_hall",
            "address": "1 Test St",
            "lat": 12.97,
            "lng": 77.59,
            "price_per_hour": 40.0,
            "capacity": 100,
            "photos": [],
            "amenities": ["ac"],
        },
    )
    assert venue.status_code == 201, venue.text
    venue_id = venue.json()["id"]
    assert venue.json()["status"] == "pending"

    # Admin approves. Admin role cannot be self-assigned via signup, so create
    # the admin account directly in the DB (as a real bootstrap would).
    from app.db.session import SessionLocal
    from app.core.security import hash_password
    from app.modules.users.model import User, UserRole

    with SessionLocal() as db:
        admin_user = User(
            email="admin@test.io",
            name="Admin",
            password_hash=hash_password("secret123"),
            role=UserRole.admin,
        )
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        admin_id = admin_user.id

    admin_login = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@test.io", "password": "secret123"},
    )
    assert admin_login.status_code == 200, admin_login.text
    admin_token = admin_login.json()["access_token"]
    approved = client.patch(
        f"/api/v1/admin/venues/{venue_id}",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={"status": "approved"},
    )
    assert approved.status_code == 200
    assert approved.json()["status"] == "approved"

    # User searches venues
    search = client.get("/api/v1/venues", params={"type": "birthday_hall"})
    assert search.status_code == 200
    assert any(v["id"] == venue_id for v in search.json())

    # User books
    from datetime import datetime, timedelta, timezone

    start = datetime.now(timezone.utc) + timedelta(days=2)
    booking = client.post(
        "/api/v1/bookings",
        headers={"Authorization": f"Bearer {user_token}"},
        json={
            "venue_id": venue_id,
            "start_at": start.isoformat(),
            "end_at": (start + timedelta(hours=3)).isoformat(),
        },
    )
    assert booking.status_code == 201, booking.text
    booking_id = booking.json()["id"]
    assert booking.json()["total_price"] == 120.0

    # Conflict booking
    conflict = client.post(
        "/api/v1/bookings",
        headers={"Authorization": f"Bearer {user_token}"},
        json={
            "venue_id": venue_id,
            "start_at": start.isoformat(),
            "end_at": (start + timedelta(hours=2)).isoformat(),
        },
    )
    assert conflict.status_code == 409

    # User cancels while still pending (cancel only allowed pre-confirm)
    cancelled = client.post(
        f"/api/v1/bookings/{booking_id}/cancel",
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert cancelled.status_code == 200, cancelled.text
    assert cancelled.json()["status"] == "cancelled"

    # Cancelling again / after cancel is rejected
    re_cancel = client.post(
        f"/api/v1/bookings/{booking_id}/cancel",
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert re_cancel.status_code == 409

    # Create a second booking; owner accepts, then user cancel must be rejected
    booking2 = client.post(
        "/api/v1/bookings",
        headers={"Authorization": f"Bearer {user_token}"},
        json={
            "venue_id": venue_id,
            "start_at": (start + timedelta(days=1)).isoformat(),
            "end_at": ((start + timedelta(days=1)) + timedelta(hours=2)).isoformat(),
        },
    )
    booking2_id = booking2.json()["id"]

    decided = client.patch(
        f"/api/v1/owner/bookings/{booking2_id}",
        headers={"Authorization": f"Bearer {owner_token}"},
        json={"status": "confirmed"},
    )
    assert decided.status_code == 200, decided.text
    assert decided.json()["status"] == "confirmed"

    cancel_confirmed = client.post(
        f"/api/v1/bookings/{booking2_id}/cancel",
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert cancel_confirmed.status_code == 409  # policy: cannot cancel confirmed

    # Role enforcement: user cannot hit owner endpoint
    forbidden = client.get(
        "/api/v1/owner/venues",
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert forbidden.status_code == 403


if __name__ == "__main__":
    test_signup_login_and_booking_flow()
    print("SMOKE_TEST_OK")
