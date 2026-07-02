import logging

from app.core.config import settings
from app.core.database import SessionLocal
from app.modules.search.indexer import process_job, retryable_job_ids

logger = logging.getLogger(__name__)


def _dequeue_from_upstash(limit: int) -> list[str]:
    if not settings.upstash_redis_url or not settings.upstash_redis_token:
        return []

    try:
        from upstash_redis import Redis

        redis = Redis(
            url=settings.upstash_redis_url,
            token=settings.upstash_redis_token,
        )

        job_ids = []

        for _ in range(limit):
            job_id = redis.rpop(settings.upstash_search_queue_key)
            if not job_id:
                break
            job_ids.append(job_id)

        return job_ids

    except Exception as exc:
        logger.warning("Redis unavailable: %s", exc)
        return []


def run() -> int:
    db = SessionLocal()

    try:
        job_ids = _dequeue_from_upstash(limit=10)
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
