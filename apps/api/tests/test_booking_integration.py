from datetime import date, timedelta

from app.modules.booking.models import Booking, BookingStatus
from tests.conftest import seed_approved_venue, seed_user


def _booking_date() -> str:
    # Use a date 30 days out so it always passes the "must be future" check
    return (date.today() + timedelta(days=30)).isoformat()


def _create_booking(client, customer_token: str, venue_id: str, venue_name: str) -> dict:
    resp = client.post(
        "/api/bookings/",
        json={
            "venue_id": venue_id,
            "venue_name": venue_name,
            "venue_cover_image": None,
            "booking_type": "full_day",
            "booking_date": _booking_date(),
            "guest_count": 10,
            "event_type": "corporate",
            "user_notes": "integration test booking",
        },
        headers={"Authorization": f"Bearer {customer_token}"},
    )
    return resp


# ── Auth guards ───────────────────────────────────────────────────────────────


def test_create_booking_unauthenticated_returns_422(client):
    resp = client.post("/api/bookings/", json={})
    assert resp.status_code == 422


def test_accept_booking_as_customer_returns_403(client, db, category_id):
    owner_id, owner_token = seed_user(db, "venue_owner")
    customer_id, customer_token = seed_user(db, "customer")
    venue_id = seed_approved_venue(db, owner_id, category_id)

    create_resp = _create_booking(client, customer_token, str(venue_id), "Test Venue")
    assert create_resp.status_code == 201
    booking_id = create_resp.json()["id"]

    # Customer trying to accept their own booking should be forbidden
    resp = client.post(
        f"/api/bookings/{booking_id}/accept",
        headers={"Authorization": f"Bearer {customer_token}"},
    )
    assert resp.status_code == 403


# ── Status transitions ────────────────────────────────────────────────────────


def test_create_booking_status_is_requested(client, db, category_id):
    owner_id, _ = seed_user(db, "venue_owner")
    _, customer_token = seed_user(db, "customer")
    venue_id = seed_approved_venue(db, owner_id, category_id)

    resp = _create_booking(client, customer_token, str(venue_id), "Test Venue")

    assert resp.status_code == 201
    assert resp.json()["status"] == "requested"


def test_create_booking_row_in_db(client, db, category_id):
    owner_id, _ = seed_user(db, "venue_owner")
    _, customer_token = seed_user(db, "customer")
    venue_id = seed_approved_venue(db, owner_id, category_id)

    resp = _create_booking(client, customer_token, str(venue_id), "Test Venue")
    assert resp.status_code == 201

    booking_id = resp.json()["id"]
    row = db.query(Booking).filter(Booking.id == booking_id).first()
    assert row is not None
    assert row.status == BookingStatus.requested


def test_owner_accept_transitions_to_owner_accepted(client, db, category_id):
    owner_id, owner_token = seed_user(db, "venue_owner")
    _, customer_token = seed_user(db, "customer")
    venue_id = seed_approved_venue(db, owner_id, category_id)

    create_resp = _create_booking(client, customer_token, str(venue_id), "Test Venue")
    assert create_resp.status_code == 201
    booking_id = create_resp.json()["id"]

    accept_resp = client.post(
        f"/api/bookings/{booking_id}/accept",
        headers={"Authorization": f"Bearer {owner_token}"},
    )

    assert accept_resp.status_code == 200
    assert accept_resp.json()["status"] == "owner_accepted"


def test_owner_accept_sets_hold_expiry_in_db(client, db, category_id):
    owner_id, owner_token = seed_user(db, "venue_owner")
    _, customer_token = seed_user(db, "customer")
    venue_id = seed_approved_venue(db, owner_id, category_id)

    create_resp = _create_booking(client, customer_token, str(venue_id), "Test Venue")
    booking_id = create_resp.json()["id"]

    client.post(
        f"/api/bookings/{booking_id}/accept",
        headers={"Authorization": f"Bearer {owner_token}"},
    )

    db.expire_all()
    row = db.query(Booking).filter(Booking.id == booking_id).first()
    assert row.status == BookingStatus.owner_accepted
    assert row.hold_expires_at is not None


def test_wrong_owner_cannot_accept_booking(client, db, category_id):
    owner_id, _ = seed_user(db, "venue_owner")
    other_owner_id, other_owner_token = seed_user(db, "venue_owner")
    _, customer_token = seed_user(db, "customer")
    venue_id = seed_approved_venue(db, owner_id, category_id)

    create_resp = _create_booking(client, customer_token, str(venue_id), "Test Venue")
    booking_id = create_resp.json()["id"]

    # A different owner trying to accept someone else's venue booking
    resp = client.post(
        f"/api/bookings/{booking_id}/accept",
        headers={"Authorization": f"Bearer {other_owner_token}"},
    )
    assert resp.status_code in (403, 404)


def test_list_my_bookings_pagination(client, db, category_id):
    owner_id, _ = seed_user(db, "venue_owner")
    _, customer_token = seed_user(db, "customer")
    venue_id = seed_approved_venue(db, owner_id, category_id)

    # Create 3 bookings
    for i in range(3):
        resp = client.post(
            "/api/bookings/",
            json={
                "venue_id": str(venue_id),
                "venue_name": f"Test Venue {i}",
                "booking_type": "full_day",
                "booking_date": (date.today() + timedelta(days=30 + i)).isoformat(),
                "guest_count": 10,
            },
            headers={"Authorization": f"Bearer {customer_token}"},
        )
        assert resp.status_code == 201

    # List bookings page 1, per_page 2
    resp = client.get(
        "/api/bookings/",
        params={"page": 1, "per_page": 2},
        headers={"Authorization": f"Bearer {customer_token}"},
    )
    print("REDIRECT HISTORY:", resp.history)
    print("RESPONSE STATUS:", resp.status_code)
    print("MY BOOKINGS DATA:", resp.json())
    assert resp.status_code == 200
    data = resp.json()
    assert "data" in data
    assert "meta" in data
    assert len(data["data"]) == 2
    assert data["meta"]["page"] == 1
    assert data["meta"]["per_page"] == 2
    assert data["meta"]["total"] == 3
    assert data["meta"]["total_pages"] == 2

    # List bookings page 2, per_page 2
    resp = client.get(
        "/api/bookings/",
        params={"page": 2, "per_page": 2},
        headers={"Authorization": f"Bearer {customer_token}"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["data"]) == 1
    assert data["meta"]["page"] == 2
    assert data["meta"]["total_pages"] == 2
