import logging
import uuid
from datetime import datetime, timezone, timedelta
from uuid import UUID

from sqlalchemy import text
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload

from app.core.config import settings
from app.infrastructure.embeddings.jina import embed_passage, embed_query
from app.modules.search.models import SearchIndexJob
from app.modules.venue.models import Venue

logger = logging.getLogger(__name__)

# Exponential backoff delays in seconds per retry attempt index.
# Attempt 0 → immediate, 1 → 5 min, 2 → 15 min, 3 → 1 hr, 4 → 6 hr
_BACKOFF_SECONDS = [0, 300, 900, 3600, 21600]


def _redis_client():
    from upstash_redis import Redis

    return Redis(url=settings.upstash_redis_url, token=settings.upstash_redis_token)


def enqueue_job(db: Session, entity_id: UUID, operation: str) -> None:
    """Insert a pending search index job and try to push to Upstash (fire-and-forget).

    If a pending/processing job already exists for this entity the partial unique
    index raises IntegrityError — we treat that as a no-op (the outstanding job
    will pick up the latest state when it runs).
    """
    job = SearchIndexJob(
        entity_type="venue",
        entity_id=entity_id,
        operation=operation,
    )
    db.add(job)
    try:
        db.flush()
    except IntegrityError:
        db.rollback()
        return

    job_id = str(job.id)

    try:
        if settings.upstash_redis_url and settings.upstash_redis_token:
            _redis_client().lpush(settings.upstash_search_queue_key, job_id)
    except Exception:
        # Redis push failure is non-fatal — the APScheduler worker will poll the DB.
        pass


def _build_search_document(venue: Venue) -> str:
    """Rich document for better semantic search"""
    parts = [venue.name]

    if venue.description and len(venue.description.strip()) > 10:
        parts.append(venue.description.strip())

    parts.append(f"{venue.city} {venue.state} India")

    if venue.category:
        slug = venue.category.slug
        parts.append(venue.category.label)

        keywords = {
            "wedding_hall": (
                "wedding marriage reception function banquet hall mandap sadya "
                "kalyanam kalyana mandapam vivaham nikah shaadi shadi vivah "
                "engagement muhurtham sangeet mehendi haldi baraat "
                "wedding venue marriage hall wedding function hall"
            ),
            "banquet_hall": (
                "banquet hall wedding reception marriage function party hall "
                "conference hall corporate event convention hall"
            ),
            "event_space": "event space party celebration function birthday anniversary get together",
            "rooftop": "rooftop terrace open air rooftop party sundowner",
            "club": "club nightclub party lounge discotheque dj night",
            "resort": "resort destination wedding luxury staycation getaway resort wedding",
            "lawn": "lawn garden outdoor open lawn poolside function lawn",
            "auditorium": "auditorium theatre hall seminar convocation stage",
        }
        if slug in keywords:
            parts.append(keywords[slug])

    parts.append(f"capacity {venue.max_capacity} pax people guests")
    if venue.min_capacity and venue.min_capacity > 0:
        parts.append(f"minimum {venue.min_capacity} guests")

    if venue.amenities:
        parts.append(" ".join(a.name for a in venue.amenities))

    return "\n".join(parts)


def _update_fts(db: Session, venue_id: UUID, document: str) -> None:
    db.execute(
        text(
            "UPDATE venues SET search_vector = to_tsvector('english', :doc) WHERE id = :id"
        ),
        {"doc": document, "id": str(venue_id)},
    )


def generate_query_embedding(query: str) -> list[float]:
    """Kept as a thin wrapper so search/service.py doesn't need to import the
    embeddings client directly — it only ever talks to the search module."""
    return embed_query(query)


def process_job(db: Session, job_id: str) -> None:
    """Process a single search index job end-to-end."""
    job = (
        db.query(SearchIndexJob).filter(SearchIndexJob.id == uuid.UUID(job_id)).first()
    )
    if not job:
        logger.warning("search_indexer: job %s not found", job_id)
        return
    if job.status != "pending":
        logger.debug("search_indexer: job %s already %s, skipping", job_id, job.status)
        return

    job.status = "processing"
    job.started_at = datetime.now(timezone.utc)
    db.commit()

    try:
        venue = (
            db.query(Venue)
            .options(joinedload(Venue.category), joinedload(Venue.amenities))
            .filter(Venue.id == job.entity_id)
            .first()
        )
        if not venue:
            raise ValueError(f"Venue {job.entity_id} not found")

        document = _build_search_document(venue)

        _update_fts(db, venue.id, document)

        if settings.jina_api_key:
            embedding = embed_passage(document)
            venue.embedding = embedding
            venue.embedding_updated_at = datetime.now(timezone.utc)

        job.status = "completed"
        job.completed_at = datetime.now(timezone.utc)
        db.commit()
        logger.info("search_indexer: job %s completed for venue %s", job_id, venue.id)

    except Exception as exc:
        db.rollback()
        job = (
            db.query(SearchIndexJob)
            .filter(SearchIndexJob.id == uuid.UUID(job_id))
            .first()
        )
        if job:
            job.retry_count += 1
            job.error_message = str(exc)
            job.status = "failed" if job.retry_count < 5 else "failed_permanently"
            db.commit()
        logger.error("search_indexer: job %s failed (%s)", job_id, exc)


def retryable_job_ids(db: Session, limit: int = 10) -> list[str]:
    """Return job IDs eligible for processing: pending or failed-with-backoff-elapsed."""
    now = datetime.now(timezone.utc)
    pending = (
        db.query(SearchIndexJob)
        .filter(SearchIndexJob.status == "pending")
        .order_by(SearchIndexJob.created_at.asc())
        .limit(limit)
        .all()
    )

    results = list(pending)

    if len(results) < limit:
        failed = (
            db.query(SearchIndexJob)
            .filter(
                SearchIndexJob.status == "failed",
                SearchIndexJob.retry_count < 5,
            )
            .order_by(SearchIndexJob.created_at.asc())
            .all()
        )
        for job in failed:
            if len(results) >= limit:
                break
            delay = _BACKOFF_SECONDS[min(job.retry_count, len(_BACKOFF_SECONDS) - 1)]
            eligible_at = job.created_at.replace(tzinfo=timezone.utc) + timedelta(
                seconds=delay
            )
            if now >= eligible_at:
                results.append(job)

    return [str(j.id) for j in results]
