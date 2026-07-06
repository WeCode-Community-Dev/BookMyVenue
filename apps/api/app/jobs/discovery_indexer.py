import logging

from app.core.database import SessionLocal
from app.modules.deep_research.jobs import process_discovery_job, retryable_discovery_job_ids

logger = logging.getLogger(__name__)


def run() -> int:
    """
    Pulls pending external discovery jobs from the database and processes them.
    Unlike search indexing, this runs more frequently (e.g. every 30 seconds)
    since users are actively waiting for the results on the frontend.
    """
    db = SessionLocal()

    try:
        # Fetch up to 10 pending jobs from the database
        job_ids = retryable_discovery_job_ids(db, limit=10)

        if not job_ids:
            return 0

        logger.info(
            "Discovery indexer: processing %d job(s) from Database",
            len(job_ids),
        )

        processed = 0

        for job_id in job_ids:
            try:
                process_discovery_job(db, job_id)
                processed += 1
            except Exception:
                logger.exception(
                    "Failed processing discovery job %s",
                    job_id,
                )

        logger.info(
            "Discovery indexer: finished (%d/%d processed)",
            processed,
            len(job_ids),
        )

        return processed

    finally:
        db.close()
