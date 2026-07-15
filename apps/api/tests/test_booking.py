from datetime import UTC, date, datetime, timedelta
from unittest.mock import MagicMock
from uuid import uuid4

import pytest
from fastapi import HTTPException

from app.modules.booking.cancellation import _compute_refund
from app.modules.booking.models import Booking, BookingSlot, BookingStatus, PaymentStatus
from app.modules.booking.schemas import ExtendDeadlineIn
from app.modules.booking.service import (
    owner_accept_booking,
    owner_extend_deadline,
)
from app.modules.booking.state_machine import can_transition
from app.modules.venue.models import VenueCancellationPolicy


def test_status_transitions():
    # Test valid transitions
    assert can_transition(BookingStatus.requested, BookingStatus.owner_accepted) is True
    assert can_transition(BookingStatus.requested, BookingStatus.owner_rejected) is True
    assert can_transition(BookingStatus.owner_accepted, BookingStatus.confirmed) is True
    assert can_transition(BookingStatus.confirmed, BookingStatus.completed) is True

    # Test invalid transitions
    assert can_transition(BookingStatus.completed, BookingStatus.requested) is False
    assert can_transition(BookingStatus.user_cancelled, BookingStatus.confirmed) is False
    assert can_transition(BookingStatus.owner_rejected, BookingStatus.owner_accepted) is False


def test_refund_computation_no_policy(monkeypatch):
    booking = Booking(
        amount_paid_paise=100000,  # INR 1000
        platform_fee_paise=10000,  # INR 100
        slot=BookingSlot(starts_at=datetime.now(UTC) + timedelta(days=2)),
    )
    import app.modules.booking.cancellation as cancellation
    monkeypatch.setattr(cancellation.settings_store, "get_setting", lambda db, key: 0.0 if "pct" in key else False)

    # Without policy, refund should default to 0.0% (and match no_show or None tier)
    result = _compute_refund(MagicMock(), booking, None)
    assert result.refund_amount_paise == 0
    assert result.penalty_amount_paise == 100000
    assert result.refund_pct_applied == 0.0


def test_refund_computation_policy_fee_refundable():
    policy = VenueCancellationPolicy(
        tier_1_hours=48,
        tier_1_refund_pct=100.0,
        tier_2_hours=24,
        tier_2_refund_pct=50.0,
        tier_3_hours=12,
        tier_3_refund_pct=25.0,
        no_show_refund_pct=10.0,
        platform_fee_refundable=True,
    )

    starts_at = datetime.now(UTC) + timedelta(days=3)
    booking = Booking(
        amount_paid_paise=100000,  # INR 1000
        platform_fee_paise=10000,  # INR 100
        slot=BookingSlot(starts_at=starts_at),
    )

    # Case 1: > 48 hours notice (Tier 1 -> 100% refund)
    result = _compute_refund(MagicMock(), booking, policy, cancelled_at=datetime.now(UTC))
    assert result.refund_amount_paise == 100000
    assert result.refund_pct_applied == 100.0
    assert result.tier_matched == "tier_1"

    # Case 2: 30 hours notice (Tier 2 -> 50% refund of total 1000 = 500)
    result = _compute_refund(MagicMock(), booking, policy, cancelled_at=starts_at - timedelta(hours=30))
    assert result.refund_amount_paise == 50000
    assert result.refund_pct_applied == 50.0
    assert result.tier_matched == "tier_2"

    # Case 3: 5 hours notice (No show -> 10% refund of total 1000 = 100)
    result = _compute_refund(MagicMock(), booking, policy, cancelled_at=starts_at - timedelta(hours=5))
    assert result.refund_amount_paise == 10000
    assert result.refund_pct_applied == 10.0
    assert result.tier_matched == "no_show"


def test_refund_computation_policy_fee_non_refundable():
    policy = VenueCancellationPolicy(
        tier_1_hours=48,
        tier_1_refund_pct=100.0,
        tier_2_hours=24,
        tier_2_refund_pct=50.0,
        no_show_refund_pct=0.0,
        platform_fee_refundable=False,
    )

    starts_at = datetime.now(UTC) + timedelta(days=3)
    booking = Booking(
        amount_paid_paise=100000,  # INR 1000
        platform_fee_paise=10000,  # INR 100
        slot=BookingSlot(starts_at=starts_at),
    )

    # Case 1: > 48 hours notice (Tier 1 -> 100% refund of owner share (900) = 900)
    result = _compute_refund(MagicMock(), booking, policy, cancelled_at=datetime.now(UTC))
    assert result.refund_amount_paise == 90000
    assert result.refund_pct_applied == 100.0
    assert result.tier_matched == "tier_1"

    # Case 2: 30 hours notice (Tier 2 -> 50% refund of owner share (900) = 450)
    result = _compute_refund(MagicMock(), booking, policy, cancelled_at=starts_at - timedelta(hours=30))
    assert result.refund_amount_paise == 45000
    assert result.refund_pct_applied == 50.0
    assert result.tier_matched == "tier_2"


def test_owner_accept_booking_idempotency(monkeypatch):
    import app.modules.booking.service as booking_service

    db = MagicMock()
    booking = MagicMock()
    booking.status = BookingStatus.owner_accepted
    booking.venue.owner_id = uuid4()

    db.query().options().filter().with_for_update().first.return_value = booking

    # _booking_out serializes a real Booking to a pydantic model; stub it so the
    # test focuses on the idempotency control flow, not response serialization.
    sentinel = object()
    monkeypatch.setattr(booking_service, "_booking_out", lambda db, b: sentinel)

    # Calling accept on an already accepted booking should return current state
    # and NOT recreate intents or flush.
    result = owner_accept_booking(db, uuid4(), booking.venue.owner_id)
    assert result is sentinel
    db.flush.assert_not_called()


def test_owner_extend_deadline_validation():
    db = MagicMock()
    booking = MagicMock()
    booking.status = BookingStatus.confirmed
    booking.payment_status = PaymentStatus.advance_paid
    booking.balance_overdue_at = datetime.now(UTC)
    booking.deadline_extension_count = 0
    booking.venue.owner_id = uuid4()

    # Slot starts in the past relative to execution
    booking.slot.starts_at = datetime.now(UTC) - timedelta(hours=2)

    db.query().options().filter().with_for_update().first.return_value = booking

    # Extension on already started event should fail
    body = ExtendDeadlineIn(new_due_date=date.today() + timedelta(days=2))
    with pytest.raises(HTTPException) as exc_info:
        owner_extend_deadline(db, uuid4(), booking.venue.owner_id, body)
    assert exc_info.value.status_code == 400
    assert "Cannot extend deadline for a past or ongoing event" in exc_info.value.detail
