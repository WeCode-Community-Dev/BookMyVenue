"""Async invoice generation for confirmed bookings — orchestration only.

Kept fully independent from booking/service.py and payment/service.py:
confirm_payment only calls enqueue() (a cheap row insert), never anything
below that touches reportlab/Cloudinary/email — that work happens later,
off the request, in app/jobs/invoice_generator.py. This keeps
payment.service.confirm_payment's row-locked transaction short (see the
row locking note in that file / CLAUDE.md's payment safety rules).

Queue shape mirrors app.modules.search.indexer: a durable DB row (so
nothing is lost if Upstash is unreachable) plus a best-effort Upstash push
for near-immediate pickup, with the same backoff-on-failure retry policy.

PDF rendering + Cloudinary upload live in invoice_pdf.py (a different
concern — content generation, no DB/queue awareness). The BookingInvoice
model lives in booking/models.py, alongside every other booking table.
"""
import logging
import uuid
from datetime import datetime, timezone

from sqlalchemy import update
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core import job_queue
from app.core import redis as redis_client
from app.core.config import settings
from app.modules.booking.models import BookingInvoice

logger = logging.getLogger(__name__)

MAX_RETRIES = len(job_queue.DEFAULT_BACKOFF_SECONDS)


# ─── Enqueue (called synchronously from confirm_payment) ──────────────────

def enqueue(db: Session, booking_id: uuid.UUID) -> None:
    """Insert a pending invoice job and try to push to Upstash (fire-and-forget).

    Safe to call from inside confirm_payment's locked transaction — this is
    just a row insert/update, no PDF/network work happens here.

    Callable more than once per booking (unique constraint on booking_id) —
    e.g. once at advance confirmation, again when the balance is paid off so
    the invoice reflects the fully-paid state. A re-call resets an existing
    row back to "pending" (clearing any prior pdf_url/error) rather than
    being a no-op, so process() regenerates it.
    """
    invoice = BookingInvoice(booking_id=booking_id)
    try:
        # SAVEPOINT: a duplicate-booking IntegrityError must roll back ONLY this
        # insert, never the caller's in-flight transaction. enqueue() runs inside
        # confirm_payment / confirm_balance_payment's uncommitted webhook
        # transaction (webhooks.py owns the commit), so a bare db.rollback() here
        # would silently discard the payment confirmation itself — losing the
        # balance capture on every re-enqueue (the row already exists from the
        # advance leg, so the flush always conflicts). begin_nested() isolates it.
        with db.begin_nested():
            db.add(invoice)
            db.flush()
    except IntegrityError:
        invoice = db.query(BookingInvoice).filter(BookingInvoice.booking_id == booking_id).first()
        if not invoice or invoice.status in ("pending", "processing"):
            return  # already queued/in flight — nothing to do
        invoice.status = "pending"
        invoice.error_message = None
        db.flush()

    try:
        if redis_client.is_configured():
            redis_client.get_redis().lpush(settings.upstash_invoice_queue_key, str(invoice.id))
    except Exception as exc:
        # Redis push failure is non-fatal — the worker still polls the DB — but
        # log it (like dequeue_from_redis does) so a misconfigured or unreachable
        # Upstash isn't completely invisible.
        logger.warning("invoice: Redis push failed for %s: %s", invoice.id, exc)


# ─── Job processing (called from app/jobs/invoice_generator.py) ───────────

def process(db: Session, invoice_id: uuid.UUID | str) -> None:
    """Process a single invoice job end-to-end: generate PDF, upload, email."""
    from sqlalchemy.orm import joinedload

    from app.modules.booking.invoice_pdf import generate_pdf, upload_pdf_to_cloudinary
    from app.modules.booking.models import Booking

    invoice_id = uuid.UUID(str(invoice_id))

    # Atomically claim the row before doing any work: a single UPDATE that flips
    # pending/failed -> processing. Only the worker whose UPDATE actually matches
    # a row proceeds (rowcount == 1); everyone else bails. A Redis pop and a DB
    # poll — or two overlapping job runs — can hand the same id to two workers,
    # and the previous "db.get() + check status + set processing" was a
    # check-then-act race (both could pass the check before either wrote
    # processing), double-generating the PDF and double-sending the email. The
    # compare-and-swap closes that window so exactly one worker wins.
    claimed = db.execute(
        update(BookingInvoice)
        .where(
            BookingInvoice.id == invoice_id,
            BookingInvoice.status.in_(("pending", "failed")),
        )
        .values(status="processing")
        # No session object holds this row yet (fresh per-id call) and we re-fetch
        # right after the commit, so skip the in-Python WHERE evaluation.
        .execution_options(synchronize_session=False)
    ).rowcount
    db.commit()
    if not claimed:
        return  # already claimed by another worker, or not in a processable state

    invoice = db.get(BookingInvoice, invoice_id)
    if not invoice:
        return

    try:
        booking = (
            db.query(Booking)
            .options(joinedload(Booking.venue), joinedload(Booking.user), joinedload(Booking.slot))
            .filter(Booking.id == invoice.booking_id)
            .first()
        )
        if not booking:
            raise ValueError(f"Booking {invoice.booking_id} not found")

        pdf_bytes = generate_pdf(booking)
        pdf_url = upload_pdf_to_cloudinary(pdf_bytes, booking.id)

        invoice.pdf_url = pdf_url
        invoice.status = "generated"
        db.commit()
        logger.info("invoice: generated for booking %s -> %s", booking.id, pdf_url)

        _send_invoice_email(db, booking, pdf_url)

    except Exception as exc:
        db.rollback()
        invoice = db.get(BookingInvoice, invoice_id)
        if invoice:
            invoice.attempts += 1
            invoice.error_message = str(exc)
            invoice.status = "failed"
            db.commit()
        logger.error("invoice: job %s failed (%s)", invoice_id, exc)


def _send_invoice_email(db: Session, booking, pdf_url: str) -> None:
    """The single combined status+invoice email to the customer — held back
    by confirm_payment / confirm_balance_payment (notify(..., skip_email=True))
    specifically so it can be sent once per trigger, combined with the
    invoice, instead of as two separate emails.

    Whether this is the initial confirmation or a balance-settlement
    regeneration is read off the booking's current payment_status (fully
    committed by the time this runs) rather than passed in — process() is
    triggered generically by an invoice_id, it doesn't know why.
    """
    customer = booking.user
    if not customer or not customer.email:
        return

    from app.core.email import send_email
    from app.modules.notification.models import InAppNotification
    from app.modules.notification.templates import render_booking_invoice_email

    fully_paid = booking.payment_status.value == "fully_paid" if booking.payment_status else False
    source_type = "balance_paid" if fully_paid else "payment_confirmed"

    venue_name = booking.venue.name if booking.venue else "your venue"
    subject, html = render_booking_invoice_email(customer.full_name, venue_name, pdf_url, fully_paid=fully_paid)
    if not send_email(customer.email, subject, html):
        return

    # Best-effort bookkeeping: stamp sent_at on the in-app notification that
    # confirm_payment/confirm_balance_payment wrote without an email, so it
    # doesn't look un-sent.
    row = (
        db.query(InAppNotification)
        .filter(
            InAppNotification.booking_id == booking.id,
            InAppNotification.user_id == booking.user_id,
            InAppNotification.type == source_type,
            InAppNotification.sent_at.is_(None),
        )
        .order_by(InAppNotification.created_at.desc())
        .first()
    )
    if row:
        row.sent_at = datetime.now(timezone.utc)
        db.commit()


def retryable_invoice_ids(db: Session, limit: int = 10) -> list[str]:
    """Return invoice job IDs eligible for processing: pending or failed-with-backoff-elapsed."""
    pending = (
        db.query(BookingInvoice)
        .filter(BookingInvoice.status == "pending")
        .order_by(BookingInvoice.created_at.asc())
        .limit(limit)
        .all()
    )
    results = list(pending)

    if len(results) < limit:
        failed = (
            db.query(BookingInvoice)
            .filter(BookingInvoice.status == "failed", BookingInvoice.attempts < MAX_RETRIES)
            .order_by(BookingInvoice.created_at.asc())
            .all()
        )
        for inv in failed:
            if len(results) >= limit:
                break
            if job_queue.is_backoff_eligible(inv.created_at, inv.attempts):
                results.append(inv)

    return [str(i.id) for i in results]
