"""
Hold expiry job tests.

Business rule (CLAUDE.md):
  If token payment is not completed within 24 hours:
    accepted -> hold_expired
  The slot must be unblocked so the owner can accept another requester.
"""

from datetime import UTC, datetime, timedelta

from app.jobs.hold_expiry import run as run_hold_expiry
from app.modules.booking.models import Booking, BookingSlot, BookingStatus
from tests.conftest import create_booking, seed_approved_venue, seed_user


def _accept_booking(client, owner_token: str, booking_id: str):
    return client.post(
        f"/api/bookings/{booking_id}/accept",
        headers={"Authorization": f"Bearer {owner_token}"},
    )


def _expire_hold(db, booking_id: str):
    """Force hold_expires_at into the past to simulate expiry."""
    db.query(Booking).filter(Booking.id == booking_id).update(
        {"hold_expires_at": datetime.now(UTC) - timedelta(hours=25)}
    )
    db.commit()


def test_expired_hold_transitions_to_hold_expired(client, db, category_id):
    owner_id, owner_token = seed_user(db, "venue_owner")
    _, customer_token = seed_user(db, "customer")
    venue_id = seed_approved_venue(db, owner_id, category_id)

    booking = create_booking(client, customer_token, venue_id).json()
    _accept_booking(client, owner_token, booking["id"])
    _expire_hold(db, booking["id"])

    processed = run_hold_expiry()

    assert processed == 1
    db.expire_all()
    row = db.query(Booking).filter(Booking.id == booking["id"]).first()
    assert row.status == BookingStatus.hold_expired


def test_expired_hold_unblocks_slot(client, db, category_id):
    owner_id, owner_token = seed_user(db, "venue_owner")
    _, customer_token = seed_user(db, "customer")
    venue_id = seed_approved_venue(db, owner_id, category_id)

    booking = create_booking(client, customer_token, venue_id).json()
    _accept_booking(client, owner_token, booking["id"])
    _expire_hold(db, booking["id"])

    run_hold_expiry()

    db.expire_all()
    slot = db.query(BookingSlot).filter(BookingSlot.booking_id == booking["id"]).first()
    assert slot.is_blocking is False


def test_non_expired_hold_is_not_affected(client, db, category_id):
    owner_id, owner_token = seed_user(db, "venue_owner")
    _, customer_token = seed_user(db, "customer")
    venue_id = seed_approved_venue(db, owner_id, category_id)

    booking = create_booking(client, customer_token, venue_id).json()
    _accept_booking(client, owner_token, booking["id"])
    # Do NOT expire the hold — it should still be in the future

    processed = run_hold_expiry()

    assert processed == 0
    db.expire_all()
    row = db.query(Booking).filter(Booking.id == booking["id"]).first()
    assert row.status == BookingStatus.owner_accepted


def test_only_accepted_bookings_are_expired(client, db, category_id):
    owner_id, _ = seed_user(db, "venue_owner")
    _, customer_token = seed_user(db, "customer")
    venue_id = seed_approved_venue(db, owner_id, category_id)

    # A plain "requested" booking — never accepted, no hold
    booking = create_booking(client, customer_token, venue_id).json()

    processed = run_hold_expiry()

    assert processed == 0
    db.expire_all()
    row = db.query(Booking).filter(Booking.id == booking["id"]).first()
    assert row.status == BookingStatus.requested
