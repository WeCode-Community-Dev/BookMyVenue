import logging

from app.core import job_queue
from app.core.config import settings
from app.core.database import SessionLocal
from app.modules.booking.invoice import process, retryable_invoice_ids

logger = logging.getLogger(__name__)


def run() -> int:
    db = SessionLocal()

    try:
        invoice_ids = job_queue.dequeue_from_redis(settings.upstash_invoice_queue_key, limit=10)
        source = "Redis"

        if not invoice_ids:
            invoice_ids = retryable_invoice_ids(db, limit=10)
            source = "Database"

        if not invoice_ids:
            return 0

        logger.info("Invoice generator: processing %d job(s) from %s", len(invoice_ids), source)

        processed = 0
        for invoice_id in invoice_ids:
            try:
                process(db, invoice_id)
                processed += 1
            except Exception:
                logger.exception("Failed processing invoice job %s", invoice_id)

        logger.info("Invoice generator: finished (%d/%d processed)", processed, len(invoice_ids))
        return processed

    finally:
        db.close()
