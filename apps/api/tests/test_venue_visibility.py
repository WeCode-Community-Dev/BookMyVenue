"""
Venue visibility tests.

Business rule (CLAUDE.md): a venue is visible to customers only when
  status = approved AND active = true AND deleted_at IS NULL

Every other status must be invisible in public search results.
"""

from datetime import UTC, datetime
from uuid import uuid4

from app.modules.venue.models import Venue, VenueStatus
from tests.conftest import seed_approved_venue, seed_user


def _seed_venue_with_status(db, owner_id, category_id, status: VenueStatus, is_active: bool = True):
    from datetime import time as dt_time

    venue_id = uuid4()
    db.add(
        Venue(
            id=venue_id,
            owner_id=owner_id,
            category_id=category_id,
            name=f"Venue {status.value}",
            slug=f"venue-{status.value}-{venue_id.hex[:6]}",
            address_line1="1 Test St",
            city="Mumbai",
            state="Maharashtra",
            country="India",
            timezone="Asia/Kolkata",
            max_capacity=50,
            open_time=dt_time(9, 0),
            close_time=dt_time(21, 0),
            allowed_booking_types=["full_day"],
            min_booking_duration_minutes=60,
            max_booking_duration_minutes=1440,
            slot_interval_minutes=30,
            pre_buffer_minutes=0,
            post_buffer_minutes=0,
            pricing_mode="flat",
            starting_price_paise=500_000,
            platform_commission_pct=10,
            advance_pct=30,
            balance_due_days_before_event=7,
            owner_action_window_hours=48,
            overdue_advance_refund_pct=0,
            status=status,
            is_active=is_active,
        )
    )
    db.commit()
    return venue_id


# ── Search endpoint visibility ────────────────────────────────────────────────


def test_approved_active_venue_appears_in_search(client, db, category_id):
    owner_id, _ = seed_user(db, "venue_owner")
    seed_approved_venue(db, owner_id, category_id)

    resp = client.get("/api/search/")
    assert resp.status_code == 200
    assert len(resp.json()["items"]) == 1


def test_draft_venue_hidden_from_search(client, db, category_id):
    owner_id, _ = seed_user(db, "venue_owner")
    _seed_venue_with_status(db, owner_id, category_id, VenueStatus.draft)

    resp = client.get("/api/search/")
    assert resp.status_code == 200
    assert len(resp.json()["items"]) == 0


def test_pending_approval_venue_hidden_from_search(client, db, category_id):
    owner_id, _ = seed_user(db, "venue_owner")
    _seed_venue_with_status(db, owner_id, category_id, VenueStatus.pending_approval)

    resp = client.get("/api/search/")
    assert resp.status_code == 200
    assert len(resp.json()["items"]) == 0


def test_rejected_venue_hidden_from_search(client, db, category_id):
    owner_id, _ = seed_user(db, "venue_owner")
    _seed_venue_with_status(db, owner_id, category_id, VenueStatus.rejected)

    resp = client.get("/api/search/")
    assert resp.status_code == 200
    assert len(resp.json()["items"]) == 0


def test_suspended_venue_hidden_from_search(client, db, category_id):
    owner_id, _ = seed_user(db, "venue_owner")
    _seed_venue_with_status(db, owner_id, category_id, VenueStatus.suspended)

    resp = client.get("/api/search/")
    assert resp.status_code == 200
    assert len(resp.json()["items"]) == 0


def test_approved_but_inactive_venue_hidden_from_search(client, db, category_id):
    owner_id, _ = seed_user(db, "venue_owner")
    _seed_venue_with_status(db, owner_id, category_id, VenueStatus.approved, is_active=False)

    resp = client.get("/api/search/")
    assert resp.status_code == 200
    assert len(resp.json()["items"]) == 0


def test_soft_deleted_venue_hidden_from_search(client, db, category_id):
    owner_id, _ = seed_user(db, "venue_owner")
    venue_id = seed_approved_venue(db, owner_id, category_id)

    db.query(Venue).filter(Venue.id == venue_id).update({"deleted_at": datetime.now(UTC)})
    db.commit()

    resp = client.get("/api/search/")
    assert resp.status_code == 200
    assert len(resp.json()["items"]) == 0


def test_only_approved_venues_appear_among_mixed(client, db, category_id):
    owner_id, _ = seed_user(db, "venue_owner")
    seed_approved_venue(db, owner_id, category_id)
    _seed_venue_with_status(db, owner_id, category_id, VenueStatus.draft)
    _seed_venue_with_status(db, owner_id, category_id, VenueStatus.pending_approval)

    resp = client.get("/api/search/")
    assert resp.status_code == 200
    assert len(resp.json()["items"]) == 1
