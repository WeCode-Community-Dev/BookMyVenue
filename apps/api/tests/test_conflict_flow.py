"""
Conflict flow tests.

Business rules under test (from CLAUDE.md):
- Multiple users may request the same slot
- Requesting a slot does NOT reserve it
- Acceptance starts a 24-hour hold but does NOT block competing requests
- Only one confirmed booking can exist per slot
- After acceptance, NEW requests for the same slot are rejected (slot is blocking)
"""
from app.modules.booking.models import Booking, BookingStatus
from app.modules.booking.state_machine import can_transition
from tests.conftest import create_booking, seed_approved_venue, seed_user

# ── State machine (unit) ──────────────────────────────────────────────────────

def test_requested_can_transition_to_conflict_cancelled():
    assert can_transition(BookingStatus.requested, BookingStatus.conflict_cancelled) is True


def test_conflict_cancelled_is_terminal():
    for target in BookingStatus:
        assert can_transition(BookingStatus.conflict_cancelled, target) is False


def test_hold_expired_is_terminal():
    for target in BookingStatus:
        assert can_transition(BookingStatus.hold_expired, target) is False


# ── Multiple requests for same slot (integration) ─────────────────────────────

def test_two_customers_can_request_same_slot(client, db, category_id):
    owner_id, _ = seed_user(db, "venue_owner")
    _, token1 = seed_user(db, "customer")
    _, token2 = seed_user(db, "customer")
    venue_id = seed_approved_venue(db, owner_id, category_id)

    resp1 = create_booking(client, token1, venue_id)
    resp2 = create_booking(client, token2, venue_id)

    assert resp1.status_code == 201
    assert resp2.status_code == 201
    assert resp1.json()["id"] != resp2.json()["id"]


def test_competing_request_stays_requested_after_acceptance(client, db, category_id):
    owner_id, owner_token = seed_user(db, "venue_owner")
    _, token1 = seed_user(db, "customer")
    _, token2 = seed_user(db, "customer")
    venue_id = seed_approved_venue(db, owner_id, category_id)

    b1 = create_booking(client, token1, venue_id).json()
    b2 = create_booking(client, token2, venue_id).json()

    # Owner accepts booking 1
    resp = client.post(
        f"/api/bookings/{b1['id']}/accept",
        headers={"Authorization": f"Bearer {owner_token}"},
    )
    assert resp.status_code == 200

    # Booking 2 stays "requested" — conflict_cancelled only happens at payment confirmation
    db.expire_all()
    row = db.query(Booking).filter(Booking.id == b2["id"]).first()
    assert row.status == BookingStatus.requested


def test_new_request_blocked_after_acceptance(client, db, category_id):
    owner_id, owner_token = seed_user(db, "venue_owner")
    _, token1 = seed_user(db, "customer")
    _, token3 = seed_user(db, "customer")
    venue_id = seed_approved_venue(db, owner_id, category_id)

    b1 = create_booking(client, token1, venue_id).json()

    client.post(
        f"/api/bookings/{b1['id']}/accept",
        headers={"Authorization": f"Bearer {owner_token}"},
    )

    # A brand-new request for the same slot after acceptance should be blocked
    resp = create_booking(client, token3, venue_id)
    assert resp.status_code == 409
