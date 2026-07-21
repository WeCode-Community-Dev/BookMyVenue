"""Single source of truth for the background-job catalogue.

The same canonical `app/jobs/*` functions are run three ways:
  - in-process via APScheduler (`app/jobs/scheduler.py`), when ENABLE_JOBS=true
  - from the CLI (`apps/api/run_job.py`)
  - from the machine-to-machine endpoint (`POST /api/internal/run-jobs`)

Each job manages its own session (commit on success, rollback on error) and
returns the number of rows it processed.
"""

import logging

import app.models  # noqa: F401 — register every ORM model before any job queries run
from app.jobs import (
    balance_overdue,
    booking_completion,
    hold_expiry,
    invoice_generator,
    payment_pending_expiry,
    payment_reminders,
    search_indexer,
    stale_requests,
)

logger = logging.getLogger(__name__)

# name -> callable. Names are stable; the cron triggers reference them.
JOBS = {
    "hold_expiry": hold_expiry.run,
    "request_expiry": stale_requests.run,
    "completion": booking_completion.run,
    "payment_reminders": payment_reminders.run,
    "overdue_flag": balance_overdue.run_flag,
    "overdue_autocancel": balance_overdue.run_autocancel,
    "search_indexer": search_indexer.run,
    "payment_pending_expiry": payment_pending_expiry.run,
    "invoice_generator": invoice_generator.run,
}


def run_job(job_name: str) -> int:
    """Run one named job and return the count it processed.

    Raises KeyError if the name is unknown so callers can map it to a 400.
    """
    job_func = JOBS[job_name]
    logger.info("running job %s", job_name)
    count = job_func()
    logger.info("job %s processed %s row(s)", job_name, count)
    return count


def run_all() -> dict[str, int]:
    """Run every job once; return a {name: count} summary."""
    return {name: run_job(name) for name in JOBS}
