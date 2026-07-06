import logging
import uuid
from datetime import datetime

from sqlalchemy.orm import Session

from app.core.config import settings

from app.modules.search.models import SearchIndexJob
from app.modules.deep_research.external_source import external_source, ExternalSourceError
from app.modules.deep_research.models import ExternalDiscoveryRequest, ExternalVenueLead
from app.modules.deep_research.query_enrichment import build_internal_search_query

logger = logging.getLogger(__name__)

ENTITY_TYPE = "deep_research_query"
OPERATION = "external_discovery"
MAX_RETRIES = 3  # ASSUMPTION — align with search's process_job if that value is known
MAX_EXTERNAL_RESULTS = 5
DEFAULT_RADIUS_METERS = 15000


def retryable_discovery_job_ids(db: Session, limit: int = 10) -> list[str]:
    """DB fallback when Redis is unavailable — mirrors indexer.py's retryable_job_ids."""
    rows = (
        db.query(SearchIndexJob.id)
        .filter(
            SearchIndexJob.entity_type == ENTITY_TYPE,
            SearchIndexJob.status == "pending",
            SearchIndexJob.retry_count < MAX_RETRIES,
        )
        .limit(limit)
        .all()
    )
    return [str(row[0]) for row in rows]


def process_discovery_job(db: Session, job_id: str) -> None:
    """
    Sync equivalent of search's process_job(db, job_id). Called by a
    runner script mirroring search_indexer.py's run().
    """
    job = db.get(SearchIndexJob, uuid.UUID(job_id))
    if job is None or job.entity_type != ENTITY_TYPE:
        logger.warning("Job %s not found or not a discovery job", job_id)
        return

    job.status = "processing"
    job.started_at = datetime.utcnow()
    db.commit()

    try:
        # deep_research_queries row — read-only, not our table to write
        from app.modules.deep_research.models import DeepResearchQuery
        query_row = db.get(DeepResearchQuery, job.entity_id)
        if query_row is None:
            raise ValueError(f"deep_research_queries row {job.entity_id} not found")

        # device location — lives in OUR table, not deep_research_queries,
        # since that table has no lat/lng column
        ctx = (
            db.query(ExternalDiscoveryRequest)
            .filter(ExternalDiscoveryRequest.query_id == job.entity_id)
            .first()
        )
        if ctx is None:
            raise ValueError(
                f"No device location recorded for query {job.entity_id} — "
                "ExternalDiscoveryRequest row missing, check trigger_external_discovery"
            )
        latitude, longitude = ctx.latitude, ctx.longitude

        from app.modules.deep_research.schemas import QueryUnderstanding

        if query_row.understanding_json:
            breakdown = QueryUnderstanding(**query_row.understanding_json)
        else:
            # Fallback just in case the JSON is missing
            breakdown = QueryUnderstanding(intent="", city=query_row.city_filter)

        # reuse the same enrichment logic internal search uses, so external
        # discovery searches on the same distilled terms, not the raw sentence
        query_text = build_internal_search_query(
            query_row.query_text,
            breakdown,
        )

        raw_results = external_source.text_search(
            query=query_text,
            latitude=latitude,
            longitude=longitude,
            radius_meters=DEFAULT_RADIUS_METERS,
            max_results=10,  # Fetch more to allow for ranking and deduplication
        )

        from app.modules.venue.models import Venue
        from sqlalchemy import func

        valid_leads = []
        for raw in raw_results:
            source_ref = raw["id"]
            name = raw.get("displayName", {}).get("text", "Unknown venue")

            # We purposely do NOT deduplicate against existing external leads here.
            # If two different users search for the same criteria, they both deserve
            # to see the external venue in their results. (We can group by source_ref in the admin dashboard)

            # 2. Deduplicate against internal venues (Candidate Union prep)
            if query_row.city_filter:
                internal_venue = (
                    db.query(Venue)
                    .filter(
                        func.lower(Venue.name) == name.lower(),
                        func.lower(Venue.city) == query_row.city_filter.lower()
                    )
                    .first()
                )
                if internal_venue:
                    continue

            valid_leads.append(raw)
            if len(valid_leads) >= MAX_EXTERNAL_RESULTS:
                break

        # Configure Cloudinary once for this job run
        import cloudinary
        import cloudinary.uploader
        cloudinary.config(
            cloud_name=settings.cloudinary_cloud_name,
            api_key=settings.cloudinary_api_key,
            api_secret=settings.cloudinary_api_secret,
            secure=True,
        )

        for raw in valid_leads:
            source_ref = raw["id"]

            # ── Photo: check if we already cached this venue's photo ──────────
            # If ANY previous lead row for this Google Place ID already has a
            # Cloudinary URL, reuse it — zero cost, zero extra API call.
            cover_photo_url: str | None = None
            existing_with_photo = (
                db.query(ExternalVenueLead)
                .filter(
                    ExternalVenueLead.source_ref == source_ref,
                    ExternalVenueLead.cover_photo_url.isnot(None),
                )
                .first()
            )
            if existing_with_photo:
                cover_photo_url = existing_with_photo.cover_photo_url
                logger.debug("Reusing cached Cloudinary photo for place %s", source_ref)
            else:
                photos = raw.get("photos", [])
                if photos:
                    photo_name = photos[0].get("name")
                    if photo_name:
                        google_photo_url = (
                            f"https://places.googleapis.com/v1/{photo_name}/media"
                            f"?key={settings.google_places_api_key}"
                            f"&maxWidthPx=800&maxHeightPx=500"
                        )
                        try:
                            result = cloudinary.uploader.upload(
                                google_photo_url,
                                folder="venue404/external_leads",
                                public_id=f"gplace_{source_ref}",
                                overwrite=False,  # Never re-upload if same public_id already exists
                                resource_type="image",
                            )
                            cover_photo_url = result.get("secure_url")
                            logger.info("Uploaded photo for place %s → %s", source_ref, cover_photo_url)
                        except Exception as photo_err:
                            logger.warning("Photo upload failed for %s: %s", source_ref, photo_err)
                            # Non-fatal — we continue without a photo rather than failing the whole job

            lead = ExternalVenueLead(
                discovered_via_query_id=job.entity_id,
                source="google_places",
                source_ref=source_ref,
                name=raw.get("displayName", {}).get("text", "Unknown venue"),
                # Prefer the city Google returns directly over the query-level filter,
                # since city_filter is None when the LLM couldn't extract a city.
                city=(
                    raw.get("postalAddress", {}).get("locality")
                    or query_row.city_filter
                ),
                formatted_address=raw.get("formattedAddress"),
                cover_photo_url=cover_photo_url,
                raw_contact_info={},
            )
            db.add(lead)

        job.status = "completed"
        job.completed_at = datetime.utcnow()

    except Exception as e:
        logger.exception("Discovery job %s failed", job_id)
        job.retry_count += 1
        job.error_message = str(e)
        job.status = "failed" if job.retry_count >= MAX_RETRIES else "pending"
    finally:
        db.commit()


