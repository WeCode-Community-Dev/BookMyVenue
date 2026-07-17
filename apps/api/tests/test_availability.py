"""
Tests for the Availability module - slot validation, calendar generation, and date availability.

These tests are critical for ensuring no double bookings can occur and that the calendar
displays correct availability information.
"""

from datetime import UTC, date, datetime, timedelta
from datetime import time as dt_time
from uuid import uuid4

from tests.conftest import seed_approved_venue, seed_user


def _future_date(days: int = 30) -> date:
    """Helper to get a future date for testing."""
    return date.today() + timedelta(days=days)


def _future_datetime(hours: int = 48) -> datetime:
    """Helper to get a future datetime for testing."""
    return datetime.now(UTC) + timedelta(hours=hours)


def _iso(dt: datetime) -> str:
    """Convert datetime to ISO format string."""
    return dt.isoformat().replace("+00:00", "Z")


# ── Calendar API Tests ─────────────────────────────────────────────────────────


def test_calendar_returns_400_for_invalid_date_range(client):
    """Calendar must reject end_date before start_date."""
    resp = client.get(
        "/api/availability/venues/00000000-0000-0000-0000-000000000000/calendar?start_date=2025-12-31&end_date=2025-01-01&booking_type=full_day"
    )
    assert resp.status_code == 400


def test_calendar_rejects_range_over_370_days(client, db, category_id):
    """Calendar date range cannot exceed 370 days."""
    owner_id, _ = seed_user(db, "venue_owner")
    venue_id = seed_approved_venue(db, owner_id, category_id)

    start = _future_date(1)
    end = start + timedelta(days=400)

    resp = client.get(
        f"/api/availability/venues/{venue_id}/calendar?start_date={start.isoformat()}&end_date={end.isoformat()}&booking_type=full_day"
    )
    assert resp.status_code == 400


def test_calendar_returns_available_for_empty_venue(client, db, category_id):
    """A venue with no bookings should show all days as available."""
    owner_id, _ = seed_user(db, "venue_owner")
    venue_id = seed_approved_venue(db, owner_id, category_id)

    start = _future_date(10)
    end = start + timedelta(days=7)

    resp = client.get(
        f"/api/availability/venues/{venue_id}/calendar?start_date={start.isoformat()}&end_date={end.isoformat()}&booking_type=full_day"
    )

    assert resp.status_code == 200
    days = resp.json()["days"]
    for day in days:
        assert day["status"] == "available"
        assert day["is_bookable"] is True


def test_calendar_shows_fully_booked_for_full_day(client, db, category_id):
    """A venue with an existing booking should show fully_booked for full_day type."""
    owner_id, owner_token = seed_user(db, "venue_owner")
    customer_id, customer_token = seed_user(db, "customer")
    venue_id = seed_approved_venue(db, owner_id, category_id)

    # Create a booking that blocks the venue
    booking_date = _future_date(15)
    resp = client.post(
        "/api/bookings/",
        json={
            "venue_id": str(venue_id),
            "venue_name": "Test Venue",
            "booking_type": "full_day",
            "booking_date": booking_date.isoformat(),
            "guest_count": 10,
        },
        headers={"Authorization": f"Bearer {customer_token}"},
    )
    assert resp.status_code == 201
    booking_id = resp.json()["id"]
    from app.modules.booking.service import owner_accept_booking
    owner_accept_booking(db, booking_id, owner_id)
    db.commit()

    # Now check calendar - day should show fully_booked
    resp = client.get(
        f"/api/availability/venues/{venue_id}/calendar?start_date={booking_date.isoformat()}&end_date={booking_date.isoformat()}&booking_type=full_day"
    )
    assert resp.status_code == 200
    day = resp.json()["days"][0]
    assert day["status"] == "fully_booked"


# ── Date Availability Tests ───────────────────────────────────────────────────


def test_date_availability_returns_operating_window(client, db, category_id):
    """Date availability must return operating window even with no bookings."""
    owner_id, _ = seed_user(db, "venue_owner")
    venue_id = seed_approved_venue(db, owner_id, category_id)

    check_date = _future_date(20)
    resp = client.get(
        f"/api/availability/venues/{venue_id}/date/{check_date.isoformat()}?booking_type=time_slot"
    )

    assert resp.status_code == 200
    data = resp.json()
    assert "operating_window" in data
    assert data["operating_window"]["is_available"] is True


def test_date_availability_shows_blocked_for_blocked_date(client, db, category_id):
    """Venue blocked dates should make date unavailable."""
    owner_id, owner_token = seed_user(db, "venue_owner")
    venue_id = seed_approved_venue(db, owner_id, category_id)

    # Create a blocked date
    check_date = _future_date(30)
    blocked_start = datetime.combine(check_date, dt_time(0, 0)).replace(tzinfo=UTC)
    blocked_end = blocked_start + timedelta(days=5)

    resp = client.post(
        f"/api/venues/{venue_id}/blocked-dates",
        json={
            "starts_at": _iso(blocked_start),
            "ends_at": _iso(blocked_end),
            "reason": "Maintenance",
        },
        headers={"Authorization": f"Bearer {owner_token}"},
    )
    assert resp.status_code == 201

    # Check a date within the blocked period
    resp = client.get(
        f"/api/availability/venues/{venue_id}/date/{check_date.isoformat()}?booking_type=full_day"
    )

    assert resp.status_code == 200
    data = resp.json()
    assert data["operating_window"]["is_available"] is True  # Day is open
    # For full_day, should show as blocked due to venue block
    assert len(data["blocked_slots"]) > 0


# ── Slot Validation Tests ─────────────────────────────────────────────────────


def test_validate_slot_rejects_past_time(client, db, category_id):
    """Validation must reject slots in the past."""
    owner_id, _ = seed_user(db, "venue_owner")
    venue_id = seed_approved_venue(db, owner_id, category_id)

    past_time = datetime.now(UTC) - timedelta(hours=1)
    future_time = datetime.now(UTC) + timedelta(hours=2)

    resp = client.post(
        f"/api/availability/venues/{venue_id}/validate?booking_type=time_slot&starts_at={_iso(past_time)}&ends_at={_iso(future_time)}"
    )
    assert resp.status_code == 400


def test_validate_slot_rejects_invalid_time_order(client, db, category_id):
    """End time must be after start time."""
    owner_id, _ = seed_user(db, "venue_owner")
    venue_id = seed_approved_venue(db, owner_id, category_id)

    start = _future_datetime()
    end = start - timedelta(hours=2)  # Earlier than start

    resp = client.post(
        f"/api/availability/venues/{venue_id}/validate?booking_type=time_slot&starts_at={_iso(start)}&ends_at={_iso(end)}"
    )
    assert resp.status_code == 400


def test_validate_slot_rejects_misaligned_time_slot(client, db, category_id):
    """Time slot times must align with venue's slot_interval_minutes (default 30)."""
    owner_id, _ = seed_user(db, "venue_owner")
    venue_id = seed_approved_venue(db, owner_id, category_id)

    # 9:15 is not aligned to 30-minute intervals
    start = datetime.now(UTC).replace(minute=15, second=0, microsecond=0) + timedelta(hours=48)
    end = start + timedelta(hours=2)

    resp = client.post(
        f"/api/availability/venues/{venue_id}/validate?booking_type=time_slot&starts_at={_iso(start)}&ends_at={_iso(end)}"
    )
    assert resp.status_code == 400


def test_validate_slot_rejects_exceeds_max_capacity(client, db, category_id):
    """Guest count cannot exceed venue max_capacity."""
    owner_id, _ = seed_user(db, "venue_owner")
    venue_id = seed_approved_venue(db, owner_id, category_id)

    start = _future_datetime()
    end = start + timedelta(hours=4)

    resp = client.post(
        f"/api/availability/venues/{venue_id}/validate?booking_type=time_slot&starts_at={_iso(start)}&ends_at={_iso(end)}&guest_count=1000"
    )
    assert resp.status_code == 400


def test_validate_slot_rejects_unsupported_booking_type(client, db, category_id):
    """Booking type must be in venue's allowed_booking_types."""
    owner_id, _ = seed_user(db, "venue_owner")
    # Venue allows only "full_day" by default, try "time_slot"
    venue_id = seed_approved_venue(db, owner_id, category_id)

    start = _future_datetime()
    end = start + timedelta(hours=4)

    resp = client.post(
        f"/api/availability/venues/{venue_id}/validate?booking_type=invalid_type&starts_at={_iso(start)}&ends_at={_iso(end)}"
    )
    assert resp.status_code == 400


def test_validate_slot_returns_409_for_conflicting_booking(client, db, category_id):
    """Validation must return 409 Conflict when slot overlaps existing booking."""
    owner_id, _ = seed_user(db, "venue_owner")
    venue_id = seed_approved_venue(db, owner_id, category_id)

    booking_date = _future_date(30)

    # Create a booking
    resp = client.post(
        "/api/bookings/",
        json={
            "venue_id": str(venue_id),
            "venue_name": "Test Venue",
            "booking_type": "full_day",
            "booking_date": booking_date.isoformat(),
            "guest_count": 10,
        },
        headers={"Authorization": f"Bearer {seed_user(db, 'customer')[1]}"},
    )
    assert resp.status_code == 201
    booking_id = resp.json()["id"]
    from app.modules.booking.service import owner_accept_booking
    owner_accept_booking(db, booking_id, owner_id)
    db.commit()

    # Try to validate same date - should conflict
    resp = client.post(
        f"/api/availability/venues/{venue_id}/validate?booking_type=full_day&booking_date={booking_date.isoformat()}"
    )
    assert resp.status_code == 409


def test_validate_slot_accepts_valid_request(client, db, category_id):
    """A valid slot should return valid=true with effective times."""
    owner_id, _ = seed_user(db, "venue_owner")
    venue_id = seed_approved_venue(db, owner_id, category_id)
    from app.modules.venue.models import Venue
    venue = db.query(Venue).get(venue_id)
    venue.allowed_booking_types = ["full_day", "time_slot"]
    db.commit()

    start = _future_datetime()
    end = start + timedelta(hours=4)

    # Use aligned time (on the hour)
    start = start.replace(minute=0, second=0, microsecond=0)
    end = start + timedelta(hours=4)

    resp = client.post(
        f"/api/availability/venues/{venue_id}/validate?booking_type=time_slot&starts_at={_iso(start)}&ends_at={_iso(end)}"
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["valid"] is True
    assert "effective_starts_at" in data
    assert "effective_ends_at" in data


# ── Pricing Quote Tests ─────────────────────────────────────────────────────


def test_pricing_quote_returns_valid_response(client, db, category_id):
    """Pricing quote should return valid pricing structure."""
    owner_id, _ = seed_user(db, "venue_owner")
    venue_id = seed_approved_venue(db, owner_id, category_id)

    start = _future_datetime()
    end = start + timedelta(hours=4)

    resp = client.get(
        f"/api/availability/venues/{venue_id}/quote?starts_at={_iso(start)}&ends_at={_iso(end)}&booking_type=full_day"
    )

    assert resp.status_code == 200
    data = resp.json()
    assert "quoted_price_paise" in data
    assert "platform_fee_paise" in data
    assert "owner_payout_paise" in data
    assert "advance_due_paise" in data


def test_pricing_quote_does_not_require_availability(client, db, category_id):
    """Pricing quote works even if slot is not available."""
    owner_id, _ = seed_user(db, "venue_owner")
    venue_id = seed_approved_venue(db, owner_id, category_id)

    # Use a past date - pricing should still work
    past_start = datetime.now(UTC) - timedelta(days=10)
    past_end = past_start + timedelta(hours=4)

    resp = client.get(
        f"/api/availability/venues/{venue_id}/quote?starts_at={_iso(past_start)}&ends_at={_iso(past_end)}&booking_type=full_day"
    )
    assert resp.status_code == 200


# ── Operating Window Tests ───────────────────────────────────────────────────


def test_closed_day_shows_unavailable(client, db, category_id):
    """Days marked as closed in venue_availability should show closed status."""
    from app.modules.venue.models import VenueAvailability

    owner_id, owner_token = seed_user(db, "venue_owner")
    venue_id = seed_approved_venue(db, owner_id, category_id)

    # Set Sunday (day 6) as closed
    closed_avail = VenueAvailability(
        id=uuid4(),
        venue_id=venue_id,
        day_of_week=6,  # Sunday
        is_available=False,
    )
    db.add(closed_avail)
    db.commit()

    # Find a Sunday 30 days out
    future_date = _future_date(30)
    while future_date.weekday() != 6:
        future_date += timedelta(days=1)

    resp = client.get(
        f"/api/availability/venues/{venue_id}/calendar?start_date={future_date.isoformat()}&end_date={future_date.isoformat()}&booking_type=full_day"
    )

    assert resp.status_code == 200
    day = resp.json()["days"][0]
    assert day["status"] == "closed"
    assert day["is_bookable"] is False


# ── Buffer Time Tests ───────────────────────────────────────────────────────


def test_buffer_times_block_adjacent_slots(client, db, category_id):
    """Post-buffer time should prevent adjacent bookings."""
    owner_id, _ = seed_user(db, "venue_owner")
    venue_id = seed_approved_venue(db, owner_id, category_id)
    from app.modules.venue.models import Venue
    venue = db.query(Venue).get(venue_id)
    venue.allowed_booking_types = ["full_day", "time_slot"]
    venue.post_buffer_minutes = 60
    db.commit()

    # Venue with 60min post-buffer
    # Book 9-12, next booking should start at 13:00 earliest

    booking_date = _future_date(25)
    start_time = datetime.combine(booking_date, dt_time(9, 0)).replace(tzinfo=UTC)
    end_time = datetime.combine(booking_date, dt_time(12, 0)).replace(tzinfo=UTC)

    resp = client.post(
        "/api/bookings/",
        json={
            "venue_id": str(venue_id),
            "venue_name": "Test Venue",
            "booking_type": "time_slot",
            "starts_at": _iso(start_time),
            "ends_at": _iso(end_time),
            "guest_count": 10,
        },
        headers={"Authorization": f"Bearer {seed_user(db, 'customer')[1]}"},
    )
    assert resp.status_code == 201
    booking_id = resp.json()["id"]
    from app.modules.booking.service import owner_accept_booking
    owner_accept_booking(db, booking_id, owner_id)
    db.commit()

    # Try to book 12:30-14:00 - should conflict due to buffer
    adjacent_start = datetime.combine(booking_date, dt_time(12, 30)).replace(tzinfo=UTC)
    adjacent_end = datetime.combine(booking_date, dt_time(14, 0)).replace(tzinfo=UTC)

    resp = client.post(
        f"/api/availability/venues/{venue_id}/validate?booking_type=time_slot&starts_at={_iso(adjacent_start)}&ends_at={_iso(adjacent_end)}"
    )

    assert resp.status_code == 409


# ── Owner Calendar Tests ───────────────────────────────────────────────────


def test_owner_calendar_requires_venue_owner(client, db, category_id):
    """Only venue owners can access owner calendar."""
    owner_id, _ = seed_user(db, "venue_owner")
    other_owner_id, other_token = seed_user(db, "venue_owner")
    venue_id = seed_approved_venue(db, owner_id, category_id)

    start = _future_date(10)
    end = start + timedelta(days=7)

    resp = client.get(
        f"/api/availability/venues/{venue_id}/calendar/owner?start_date={start.isoformat()}&end_date={end.isoformat()}&booking_type=full_day",
        headers={"Authorization": f"Bearer {other_token}"},
    )

    assert resp.status_code == 403


def test_owner_calendar_includes_bookings(client, db, category_id):
    """Owner calendar should include booking details."""
    owner_id, owner_token = seed_user(db, "venue_owner")
    customer_id, customer_token = seed_user(db, "customer")
    venue_id = seed_approved_venue(db, owner_id, category_id)

    booking_date = _future_date(15)
    client.post(
        "/api/bookings/",
        json={
            "venue_id": str(venue_id),
            "venue_name": "Test Venue",
            "booking_type": "full_day",
            "booking_date": booking_date.isoformat(),
            "guest_count": 10,
        },
        headers={"Authorization": f"Bearer {customer_token}"},
    )

    resp = client.get(
        f"/api/availability/venues/{venue_id}/calendar/owner?start_date={booking_date.isoformat()}&end_date={booking_date.isoformat()}&booking_type=full_day",
        headers={"Authorization": f"Bearer {owner_token}"},
    )

    assert resp.status_code == 200
    day = resp.json()["days"][0]
    assert len(day["bookings"]) > 0
