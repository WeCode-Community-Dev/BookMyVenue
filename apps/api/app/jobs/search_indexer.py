import logging

from app.core import job_queue
from app.core.config import settings
from app.core.database import SessionLocal
from app.modules.search.indexer import process_job, retryable_job_ids

logger = logging.getLogger(__name__)


def run() -> int:
    db = SessionLocal()

    try:
        job_ids = job_queue.dequeue_from_redis(settings.upstash_search_queue_key, limit=10)
        source = "Redis"

        if not job_ids:
            job_ids = retryable_job_ids(db, limit=10)
            source = "Database"

        if not job_ids:
            logger.info("Search indexer: no jobs")
            return 0

        logger.info(
            "Search indexer: processing %d job(s) from %s",
            len(job_ids),
            source,
        )

        processed = 0

        for job_id in job_ids:
            try:
                process_job(db, job_id)
                processed += 1
            except Exception:
                logger.exception(
                    "Failed processing search index job %s",
                    job_id,
                )

        logger.info(
            "Search indexer: finished (%d/%d processed)",
            processed,
            len(job_ids),
        )

        return processed

    finally:
        db.close()
