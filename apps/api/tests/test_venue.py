from tests.conftest import seed_user

VENUE_BODY = {
    "name": "Integration Test Venue",
    "address_line1": "1 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "country": "India",
    "timezone": "Asia/Kolkata",
    "max_capacity": 50,
    "open_time": "09:00:00",
    "close_time": "21:00:00",
    "allowed_booking_types": ["full_day"],
    "pricing_mode": "flat",
    "starting_price_paise": 500000,
    "min_booking_duration_minutes": 60,
    "max_booking_duration_minutes": 1440,
    "slot_interval_minutes": 30,
    "advance_pct": "30.00",
    "balance_due_days_before_event": 7,
    "owner_action_window_hours": 48,
    "overdue_advance_refund_pct": "0.00",
}


def test_create_venue_as_owner_returns_201(client, db, category_id):
    _, token = seed_user(db, "venue_owner")

    body = {**VENUE_BODY, "category_id": str(category_id)}
    resp = client.post(
        "/api/venues/",
        json=body,
        headers={"Authorization": f"Bearer {token}"},
    )

    assert resp.status_code == 201
    data = resp.json()
    assert data["name"] == body["name"]
    assert data["city"] == body["city"]
    assert data["status"] == "draft"


def test_create_venue_row_exists_in_db(client, db, category_id):
    from app.modules.venue.models import Venue

    owner_id, token = seed_user(db, "venue_owner")
    body = {**VENUE_BODY, "category_id": str(category_id)}

    resp = client.post(
        "/api/venues/",
        json=body,
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 201

    venue_id = resp.json()["id"]
    row = db.query(Venue).filter(Venue.id == venue_id).first()
    assert row is not None
    assert str(row.owner_id) == str(owner_id)


def test_create_venue_as_customer_returns_403(client, db, category_id):
    _, token = seed_user(db, "customer")

    body = {**VENUE_BODY, "category_id": str(category_id)}
    resp = client.post(
        "/api/venues/",
        json=body,
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 403


def test_create_venue_unauthenticated_returns_422(client, category_id):
    body = {**VENUE_BODY, "category_id": str(category_id)}
    resp = client.post("/api/venues/", json=body)
    assert resp.status_code == 422
