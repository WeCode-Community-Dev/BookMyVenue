from app.modules.booking.models import BookingStatus
from app.modules.booking.state_machine import VALID_TRANSITIONS, can_transition

TERMINAL = [
    BookingStatus.completed,
    BookingStatus.hold_expired,
    BookingStatus.request_expired,
    BookingStatus.conflict_cancelled,
    BookingStatus.user_cancelled,
    BookingStatus.admin_cancelled,
    BookingStatus.owner_rejected,
    BookingStatus.balance_overdue_cancelled,
]


def test_status_count():
    # Tripwire: bump this when BookingStatus gains/loses a member, and check
    # VALID_TRANSITIONS (state_machine.py) is updated to match.
    assert len(list(BookingStatus)) == 12


def test_happy_path_request_accept_confirm_complete():
    assert can_transition(BookingStatus.requested, BookingStatus.owner_accepted)
    assert can_transition(BookingStatus.owner_accepted, BookingStatus.confirmed)
    assert can_transition(BookingStatus.confirmed, BookingStatus.completed)


def test_payment_required_before_confirm():
    # cannot jump straight from requested to confirmed
    assert not can_transition(BookingStatus.requested, BookingStatus.confirmed)


def test_hold_and_conflict_paths():
    assert can_transition(BookingStatus.owner_accepted, BookingStatus.hold_expired)
    # conflict cancellation only applies to still-pending (requested) bookings
    assert can_transition(BookingStatus.requested, BookingStatus.conflict_cancelled)
    assert not can_transition(BookingStatus.owner_accepted, BookingStatus.conflict_cancelled)


def test_terminal_states_have_no_exits():
    for s in TERMINAL:
        assert VALID_TRANSITIONS[s] == set()
        assert not can_transition(s, BookingStatus.requested)
