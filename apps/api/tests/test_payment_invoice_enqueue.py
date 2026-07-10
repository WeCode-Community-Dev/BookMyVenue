"""Regression: balance-payment confirmation must survive the invoice re-enqueue.

confirm_balance_payment() calls invoice.enqueue() at the end of its (still
uncommitted) webhook transaction. The balance leg always finds an existing
booking_invoices row (created on the advance leg), so the enqueue insert hits
the UNIQUE(booking_id) constraint. enqueue() used to handle that with a bare
db.rollback(), which silently discarded the *entire* transaction — wiping the
balance capture (payment succeeded, booking fully_paid, the balance ledger
entry) that confirm_balance_payment had just written. The SAVEPOINT fix
(begin_nested) must contain the rollback to the invoice insert alone.
"""
import uuid

from app.modules.booking.models import (
    Booking,
    BookingInvoice,
    BookingStatus,
    BookingType,
    PaymentStatus,
)
from app.modules.payment import service
from app.modules.payment.models import LedgerEntry, Payment, PaymentAttemptStatus
from tests.conftest import seed_approved_venue, seed_user


def _seed_confirmed_booking_awaiting_balance(db, category_id):
    """A confirmed, advance-paid booking with a pending balance Payment AND an
    already-generated invoice row — i.e. exactly the state the balance webhook
    lands in."""
    owner_id, _ = seed_user(db, "venue_owner")
    customer_id, _ = seed_user(db, "customer")
    venue_id = seed_approved_venue(db, owner_id, category_id)

    booking = Booking(
        venue_id=venue_id,
        user_id=customer_id,
        booking_type=BookingType.full_day,
        guest_count=10,
        status=BookingStatus.confirmed,
        payment_status=PaymentStatus.advance_paid,
        quoted_price_paise=1_000_000,
        advance_due_paise=300_000,
        balance_due_paise=700_000,
        amount_paid_paise=300_000,
    )
    db.add(booking)
    db.flush()

    # The advance-leg invoice, already processed — this is what makes the
    # balance-leg enqueue insert collide on UNIQUE(booking_id).
    db.add(BookingInvoice(booking_id=booking.id, status="generated", pdf_url="https://cdn/x.pdf"))

    intent_id = f"pi_test_balance_{uuid.uuid4().hex}"
    payment = Payment(
        booking_id=booking.id,
        amount_paise=700_000,
        currency="inr",
        status=PaymentAttemptStatus.pending,
        stripe_payment_intent_id=intent_id,
        payment_type="balance",
    )
    db.add(payment)
    db.commit()
    return booking, payment, intent_id


def test_balance_confirmation_survives_invoice_reenqueue(db, category_id):
    booking, payment, intent_id = _seed_confirmed_booking_awaiting_balance(db, category_id)

    # Webhook path: confirm the balance capture. The webhook owns the commit,
    # so this call does not commit — mirror that and commit ourselves after.
    service.confirm_payment(db, intent_id)

    # In-session state must reflect a completed balance capture. Under the old
    # bare-rollback bug these would already be reverted by this point.
    assert payment.status == PaymentAttemptStatus.succeeded
    assert booking.payment_status == PaymentStatus.fully_paid
    assert booking.amount_paid_paise == 1_000_000

    # And it must persist through the commit the webhook performs.
    db.commit()
    db.expire_all()

    persisted_payment = db.get(Payment, payment.id)
    persisted_booking = db.get(Booking, booking.id)
    assert persisted_payment.status == PaymentAttemptStatus.succeeded
    assert persisted_booking.payment_status == PaymentStatus.fully_paid
    assert persisted_booking.amount_paid_paise == 1_000_000

    # The balance charge ledger entry was written (not rolled back).
    charge = (
        db.query(LedgerEntry)
        .filter(
            LedgerEntry.booking_id == booking.id,
            LedgerEntry.entry_type == "charge",
            LedgerEntry.amount_paise == 700_000,
            LedgerEntry.direction == "credit",
        )
        .first()
    )
    assert charge is not None

    # The invoice was re-queued for regeneration (reset to pending), not left
    # generated and not duplicated.
    invoices = db.query(BookingInvoice).filter(BookingInvoice.booking_id == booking.id).all()
    assert len(invoices) == 1
    assert invoices[0].status == "pending"
