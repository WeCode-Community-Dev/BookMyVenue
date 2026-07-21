from datetime import date, timedelta

from app.modules.booking.models import Booking
from app.modules.venue.models import VenuePricingRule
from tests.conftest import seed_approved_venue, seed_user


def _next_weekday(target_weekday: int, min_days_out: int = 30) -> date:
    """Next date (at least `min_days_out` away) matching `target_weekday` (0=Mon..6=Sun)."""
    d = date.today() + timedelta(days=min_days_out)
    while d.weekday() != target_weekday:
        d += timedelta(days=1)
    return d


def _full_day_window(d: date) -> tuple[str, str]:
    return f"{d.isoformat()}T09:00:00+05:30", f"{d.isoformat()}T21:00:00+05:30"


def _create_rule(client, token: str, venue_id, **overrides) -> dict:
    body = {
        "name": "Weekend rate",
        "days_of_week": [5, 6],
        "adjustment_type": "multiplier",
        "multiplier": 1.5,
        "applies_to": "full_day",
        "priority": 50,
        "is_active": True,
    }
    body.update(overrides)
    resp = client.post(
        f"/api/venues/{venue_id}/pricing-rules",
        json=body,
        headers={"Authorization": f"Bearer {token}"},
    )
    return resp


# ── Owner CRUD ────────────────────────────────────────────────────────────────


def test_create_pricing_rule_as_owner_returns_201(client, db, category_id):
    owner_id, token = seed_user(db, "venue_owner")
    venue_id = seed_approved_venue(db, owner_id, category_id)

    resp = _create_rule(client, token, venue_id)

    assert resp.status_code == 201
    data = resp.json()
    assert data["name"] == "Weekend rate"
    assert float(data["multiplier"]) == 1.5
    assert data["exceeds_bounds"] is False


def test_create_pricing_rule_as_customer_returns_403(client, db, category_id):
    owner_id, _ = seed_user(db, "venue_owner")
    _, customer_token = seed_user(db, "customer")
    venue_id = seed_approved_venue(db, owner_id, category_id)

    resp = _create_rule(client, customer_token, venue_id)

    assert resp.status_code == 403


def test_list_pricing_rules_after_create(client, db, category_id):
    owner_id, token = seed_user(db, "venue_owner")
    venue_id = seed_approved_venue(db, owner_id, category_id)
    created = _create_rule(client, token, venue_id).json()

    resp = client.get(
        f"/api/venues/{venue_id}/pricing-rules",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert resp.status_code == 200
    ids = [r["id"] for r in resp.json()]
    assert created["id"] in ids


def test_update_pricing_rule(client, db, category_id):
    owner_id, token = seed_user(db, "venue_owner")
    venue_id = seed_approved_venue(db, owner_id, category_id)
    rule = _create_rule(client, token, venue_id).json()

    resp = client.patch(
        f"/api/venues/{venue_id}/pricing-rules/{rule['id']}",
        json={"priority": 90, "is_active": False},
        headers={"Authorization": f"Bearer {token}"},
    )

    assert resp.status_code == 200
    data = resp.json()
    assert data["priority"] == 90
    assert data["is_active"] is False


def test_delete_pricing_rule_soft_deletes(client, db, category_id):
    owner_id, token = seed_user(db, "venue_owner")
    venue_id = seed_approved_venue(db, owner_id, category_id)
    rule = _create_rule(client, token, venue_id).json()

    resp = client.delete(
        f"/api/venues/{venue_id}/pricing-rules/{rule['id']}",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 200

    listed = client.get(
        f"/api/venues/{venue_id}/pricing-rules",
        headers={"Authorization": f"Bearer {token}"},
    ).json()
    assert rule["id"] not in [r["id"] for r in listed]

    row = db.query(VenuePricingRule).filter(VenuePricingRule.id == rule["id"]).first()
    assert row is not None
    assert row.deleted_at is not None


def test_create_rule_exceeding_bounds_flags_exceeds_bounds(client, db, category_id):
    owner_id, token = seed_user(db, "venue_owner")
    venue_id = seed_approved_venue(db, owner_id, category_id)

    resp = _create_rule(client, token, venue_id, name="Huge surge", multiplier=3.0)

    assert resp.status_code == 201
    assert resp.json()["exceeds_bounds"] is True  # 300% > default max_price_pct (200%)


# ── Rule resolution via the public quote endpoint ──────────────────────────────


def test_zero_rules_prices_identically_to_static(client, db, category_id):
    owner_id, token = seed_user(db, "venue_owner")
    venue_id = seed_approved_venue(db, owner_id, category_id)
    target = _next_weekday(2)  # any weekday, no rules exist
    starts_at, ends_at = _full_day_window(target)

    resp = client.get(
        f"/api/venues/{venue_id}/pricing",
        params={"starts_at": starts_at, "ends_at": ends_at, "booking_type": "full_day"},
    )

    assert resp.status_code == 200
    data = resp.json()
    assert data["quoted_price_paise"] == 1_000_000  # base price, untouched
    assert data["breakdown"] == []
    assert data["clamped"] is False


def test_weekend_rule_adjusts_quoted_price(client, db, category_id):
    owner_id, token = seed_user(db, "venue_owner")
    venue_id = seed_approved_venue(db, owner_id, category_id)
    _create_rule(client, token, venue_id)  # +50% Sat/Sun

    saturday = _next_weekday(5)
    starts_at, ends_at = _full_day_window(saturday)

    resp = client.get(
        f"/api/venues/{venue_id}/pricing",
        params={"starts_at": starts_at, "ends_at": ends_at, "booking_type": "full_day"},
    )

    assert resp.status_code == 200
    data = resp.json()
    assert data["quoted_price_paise"] == 1_500_000  # 1,000,000 * 1.5
    assert data["clamped"] is False
    assert len(data["breakdown"]) == 1
    assert data["breakdown"][0]["applied_rule_name"] == "Weekend rate"


def test_rule_beyond_bounds_is_clamped(client, db, category_id):
    owner_id, token = seed_user(db, "venue_owner")
    venue_id = seed_approved_venue(db, owner_id, category_id)
    _create_rule(client, token, venue_id, name="Huge surge", multiplier=3.0)

    saturday = _next_weekday(5)
    starts_at, ends_at = _full_day_window(saturday)

    resp = client.get(
        f"/api/venues/{venue_id}/pricing",
        params={"starts_at": starts_at, "ends_at": ends_at, "booking_type": "full_day"},
    )

    assert resp.status_code == 200
    data = resp.json()
    assert data["quoted_price_paise"] == 2_000_000  # capped at max_price_pct (200%) of base
    assert data["clamped"] is True
    assert data["breakdown"][0]["clamped"] is True


def test_weekday_unaffected_by_weekend_rule(client, db, category_id):
    owner_id, token = seed_user(db, "venue_owner")
    venue_id = seed_approved_venue(db, owner_id, category_id)
    _create_rule(client, token, venue_id)  # Sat/Sun only

    monday = _next_weekday(0)
    starts_at, ends_at = _full_day_window(monday)

    resp = client.get(
        f"/api/venues/{venue_id}/pricing",
        params={"starts_at": starts_at, "ends_at": ends_at, "booking_type": "full_day"},
    )

    assert resp.status_code == 200
    assert resp.json()["quoted_price_paise"] == 1_000_000


# ── Booking snapshot integration ───────────────────────────────────────────────


def test_booking_snapshots_rule_adjusted_price_and_breakdown(client, db, category_id):
    owner_id, owner_token = seed_user(db, "venue_owner")
    customer_id, customer_token = seed_user(db, "customer")
    venue_id = seed_approved_venue(db, owner_id, category_id)
    _create_rule(client, owner_token, venue_id)  # +50% Sat/Sun

    saturday = _next_weekday(5)
    starts_at, ends_at = _full_day_window(saturday)

    resp = client.post(
        "/api/bookings/",
        json={
            "venue_id": str(venue_id),
            "venue_name": "Test Venue",
            "venue_cover_image": None,
            "booking_type": "full_day",
            "starts_at": starts_at,
            "ends_at": ends_at,
            "guest_count": 10,
            "event_type": "corporate",
            "user_notes": "pricing rule test",
        },
        headers={"Authorization": f"Bearer {customer_token}"},
    )

    assert resp.status_code == 201
    data = resp.json()
    assert data["quoted_price_paise"] == 1_500_000

    row = db.query(Booking).filter(Booking.id == data["id"]).first()
    assert row is not None
    assert row.quoted_price_paise == 1_500_000
    assert row.pricing_breakdown is not None
    assert row.pricing_breakdown[0]["applied_rule_name"] == "Weekend rate"


def test_booking_creation_rejects_stale_price_with_409(client, db, category_id):
    owner_id, owner_token = seed_user(db, "venue_owner")
    customer_id, customer_token = seed_user(db, "customer")
    venue_id = seed_approved_venue(db, owner_id, category_id)
    _create_rule(client, owner_token, venue_id)  # +50% Sat/Sun

    saturday = _next_weekday(5)
    starts_at, ends_at = _full_day_window(saturday)

    resp = client.post(
        "/api/bookings/",
        json={
            "venue_id": str(venue_id),
            "venue_name": "Test Venue",
            "venue_cover_image": None,
            "booking_type": "full_day",
            "starts_at": starts_at,
            "ends_at": ends_at,
            "guest_count": 10,
            "event_type": "corporate",
            "user_notes": "stale quote test",
            "expected_total_paise": 1_000_000,  # stale: doesn't account for the rule
        },
        headers={"Authorization": f"Bearer {customer_token}"},
    )

    assert resp.status_code == 409
    detail = resp.json()["detail"]
    assert detail["error"] == "PRICE_CHANGED"
    assert detail["quoted_price_paise"] == 1_500_000
