from app.modules.booking.models import BookingStatus
from app.modules.booking.state_machine import can_transition


def test_requested_to_user_cancelled_transition():
    # Verify that requested -> user_cancelled is a valid transition in the state machine
    assert can_transition(BookingStatus.requested, BookingStatus.user_cancelled) is True
