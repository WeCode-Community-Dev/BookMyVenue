"""Deep Research orchestration.

Phase 1: Query Understanding → Internal Retrieval (hybrid search) → persisted
query log (breakdown + result summary for admin observability).

Phase 2 (this file): External discovery via Google Places. Runs as a single
async request — no job queue, no polling. Cloudinary photo uploads are
concurrent (asyncio.gather), so total wait time ≈ 1× upload rather than N×.
"""

import asyncio
import logging
from uuid import UUID

from sqlalchemy.orm import Session

from app.modules.deep_research.models import (
    DeepResearchQuery,
    ExternalDiscoveryRequest,
    ExternalVenueLead,
    LeadReservation,
)
from app.modules.deep_research.query_enrichment import build_internal_search_query
from app.modules.deep_research.query_understanding import understand_query
from app.modules.deep_research.schemas import DeepResearchSearchResponse, ExternalLeadPublic
from app.modules.search import service as search_service
from app.modules.search.schemas import SearchParams

logger = logging.getLogger(__name__)

_TOP_RESULTS_TRACKED = 5
MAX_EXTERNAL_RESULTS = 5
DEFAULT_RADIUS_METERS = 15000


# ─── Phase 1: Internal search ────────────────────────────────────────────────

def run_search(
    db: Session, user_id: UUID, query: str, page: int, page_size: int
) -> DeepResearchSearchResponse:
    breakdown = understand_query(query)

    search_params = SearchParams(
        q=build_internal_search_query(query, breakdown),
        city=breakdown.city or "",
        capacity=breakdown.capacity or 0,
        page=page,
        page_size=page_size,
    )
    internal_results = search_service.search_hybrid(db, search_params)

    match_scores = [r.match_score for r in internal_results.items if r.match_score is not None]
    avg_match_score = sum(match_scores) / len(match_scores) if match_scores else None
    top_results = [
        {
            "id": str(r.id),
            "name": r.name,
            "match_source": r.match_source,
            "match_score": r.match_score,
        }
        for r in internal_results.items[:_TOP_RESULTS_TRACKED]
    ]

    research_query = DeepResearchQuery(
        user_id=user_id,
        query_text=query,
        city_filter=breakdown.city,
        understanding_json=breakdown.model_dump(),
        result_count=internal_results.total,
        avg_match_score=avg_match_score,
        top_results_json=top_results,
    )
    db.add(research_query)
    db.commit()
    db.refresh(research_query)

    return DeepResearchSearchResponse(
        query_id=research_query.id,
        understanding=breakdown,
        internal_results=internal_results,
    )


# ─── Phase 2: External discovery ─────────────────────────────────────────────

async def _upload_photo_to_cloudinary(
    source_ref: str, photos: list[dict]
) -> str | None:
    """
    Upload the first Google Places photo to Cloudinary.
    Returns the secure Cloudinary URL, or None if upload fails.
    Non-fatal — a lead without a photo is still a valid lead.
    """
    import cloudinary
    import cloudinary.uploader
    from app.core.config import settings

    if not photos:
        return None

    photo_name = photos[0].get("name")
    if not photo_name:
        return None

    google_photo_url = (
        f"https://places.googleapis.com/v1/{photo_name}/media"
        f"?key={settings.google_places_api_key}"
        f"&maxWidthPx=800&maxHeightPx=500"
    )
    try:
        # Run the blocking Cloudinary SDK call in a thread so it doesn't
        # block the event loop while we wait for the upload.
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(
            None,
            lambda: cloudinary.uploader.upload(
                google_photo_url,
                folder="venue404/external_leads",
                public_id=f"gplace_{source_ref}",
                overwrite=False,
                resource_type="image",
            ),
        )
        url = result.get("secure_url")
        logger.info("Uploaded photo for place %s → %s", source_ref, url)
        return url
    except Exception as exc:
        logger.warning("Photo upload failed for %s: %s", source_ref, exc)
        return None


async def run_external_discovery(
    db: Session, query_id: UUID, latitude: float, longitude: float
) -> list[ExternalLeadPublic]:
    """
    Async function that:
    1. Saves an audit row for the location supplied by the browser.
    2. Calls Google Places (async httpx).
    3. Deduplicates against our internal Venue table.
    4. Uploads all photos concurrently via asyncio.gather.
    5. Bulk-inserts ExternalVenueLead rows.
    6. Returns the list of ExternalLeadPublic immediately.
    """
    import cloudinary
    from app.core.config import settings
    from app.modules.deep_research.external_source import external_source
    from app.modules.venue.models import Venue
    from sqlalchemy import func

    # ── 1. Audit row ──────────────────────────────────────────────────────────
    ctx = ExternalDiscoveryRequest(
        query_id=query_id, latitude=latitude, longitude=longitude
    )
    db.add(ctx)
    db.commit()

    # ── 2. Load query context ─────────────────────────────────────────────────
    query_row = db.get(DeepResearchQuery, query_id)
    if query_row is None:
        raise ValueError(f"deep_research_queries row {query_id} not found")

    from app.modules.deep_research.schemas import QueryUnderstanding

    breakdown = (
        QueryUnderstanding(**query_row.understanding_json)
        if query_row.understanding_json
        else QueryUnderstanding(intent="", city=query_row.city_filter)
    )
    # For external discovery, we must include the city in the text query 
    # since Google Places uses it alongside the location bias.
    query_text = build_internal_search_query(query_row.query_text, breakdown)
    if breakdown.city and breakdown.city.lower() not in query_text.lower():
        query_text = f"{query_text} in {breakdown.city}"

    # If the user explicitly provided a city, rely entirely on the text query
    # (e.g. "wedding hall in Bangalore") rather than skewing results to their GPS location.
    if breakdown.city:
        use_lat, use_lng = None, None
    else:
        use_lat, use_lng = latitude, longitude

    # ── 3. Google Places call (async) ─────────────────────────────────────────
    raw_results = await external_source.text_search(
        query=query_text,
        latitude=use_lat,
        longitude=use_lng,
        radius_meters=DEFAULT_RADIUS_METERS,
        max_results=10,  # fetch extra to allow for dedup filtering
    )

    # ── 4. Deduplicate against internal venues ────────────────────────────────
    valid_raws: list[dict] = []
    for raw in raw_results:
        name = raw.get("displayName", {}).get("text", "")
        if query_row.city_filter and name:
            clash = (
                db.query(Venue)
                .filter(
                    func.lower(Venue.name) == name.lower(),
                    func.lower(Venue.city) == query_row.city_filter.lower(),
                )
                .first()
            )
            if clash:
                continue
        valid_raws.append(raw)
        if len(valid_raws) >= MAX_EXTERNAL_RESULTS:
            break

    if not valid_raws:
        return []

    # ── 5. Configure Cloudinary once ──────────────────────────────────────────
    cloudinary.config(
        cloud_name=settings.cloudinary_cloud_name,
        api_key=settings.cloudinary_api_key,
        api_secret=settings.cloudinary_api_secret,
        secure=True,
    )

    # ── 6. Upload photos concurrently ─────────────────────────────────────────
    # For each lead, check if we already have a cached Cloudinary URL first.
    async def resolve_photo(raw: dict) -> str | None:
        source_ref = raw["id"]
        cached = (
            db.query(ExternalVenueLead)
            .filter(
                ExternalVenueLead.source_ref == source_ref,
                ExternalVenueLead.cover_photo_url.isnot(None),
            )
            .first()
        )
        if cached:
            logger.debug("Reusing cached photo for place %s", source_ref)
            return cached.cover_photo_url
        return await _upload_photo_to_cloudinary(source_ref, raw.get("photos", []))

    photo_urls: list[str | None] = await asyncio.gather(
        *[resolve_photo(raw) for raw in valid_raws]
    )

    # ── 7. Persist leads and return ───────────────────────────────────────────
    public_leads: list[ExternalLeadPublic] = []
    for raw, cover_photo_url in zip(valid_raws, photo_urls):
        lead = ExternalVenueLead(
            discovered_via_query_id=query_id,
            source="google_places",
            source_ref=raw["id"],
            name=raw.get("displayName", {}).get("text", "Unknown venue"),
            city=(
                raw.get("postalAddress", {}).get("locality")
                or query_row.city_filter
            ),
            formatted_address=raw.get("formattedAddress"),
            cover_photo_url=cover_photo_url,
            raw_contact_info={},
        )
        db.add(lead)
        db.flush()  # get lead.id without a full commit yet
        public_leads.append(_to_public_lead(lead))

    db.commit()
    return public_leads


# ─── Helpers ──────────────────────────────────────────────────────────────────

def _to_public_lead(lead: ExternalVenueLead) -> ExternalLeadPublic:
    return ExternalLeadPublic(
        id=lead.id,
        name=lead.name,
        city=lead.city,
        formatted_address=lead.formatted_address,
        cover_photo_url=lead.cover_photo_url,
        category_guess=lead.category_guess,
        source=lead.source,
    )


# ─── Reservations ─────────────────────────────────────────────────────────────

def reserve_lead(
    db: Session,
    lead_id: UUID,
    user_id: UUID,
    event_date=None,
    guest_count=None,
    phone=None,
    notes=None,
) -> LeadReservation:
    import httpx
    from app.core.config import settings
    from app.modules.deep_research.external_source import DETAILS_FIELD_MASK, PLACES_DETAILS_URL

    lead = db.get(ExternalVenueLead, lead_id)
    if lead is None:
        raise ValueError(f"No lead found for id={lead_id}")

    if not lead.raw_contact_info:
        # Fetch details synchronously (this is a sync route, one-time fetch per lead)
        headers = {
            "X-Goog-Api-Key": settings.google_places_api_key,
            "X-Goog-FieldMask": DETAILS_FIELD_MASK,
        }
        try:
            resp = httpx.get(
                PLACES_DETAILS_URL.format(place_id=lead.source_ref),
                headers=headers,
                timeout=10.0,
            )
            resp.raise_for_status()
            details = resp.json()
        except Exception as exc:
            logger.warning("Could not fetch place details for %s: %s", lead.source_ref, exc)
            details = {}

        lead.raw_contact_info = {
            "phone": details.get("internationalPhoneNumber"),
            "website": details.get("websiteUri"),
            "formatted_address": details.get("formattedAddress"),
            "price_level": details.get("priceLevel"),
            "rating": details.get("rating"),
            "user_rating_count": details.get("userRatingCount"),
            "regular_opening_hours": details.get("regularOpeningHours"),
            "editorial_summary": details.get("editorialSummary"),
            "google_maps_uri": details.get("googleMapsUri"),
        }

    reservation = LeadReservation(
        lead_id=lead.id,
        user_id=user_id,
        platform_fee_paise=50000,
        event_date=event_date,
        guest_count=guest_count,
        phone=phone,
        notes=notes,
    )
    db.add(reservation)
    db.commit()
    db.refresh(reservation)
    return reservation


def get_user_reservations(db: Session, user_id: UUID) -> list[dict]:
    from sqlalchemy.orm import joinedload

    reservations = (
        db.query(LeadReservation)
        .options(joinedload(LeadReservation.lead))
        .filter(LeadReservation.user_id == user_id)
        .order_by(LeadReservation.created_at.desc())
        .all()
    )

    result = []
    for res in reservations:
        result.append(
            {
                "id": res.id,
                "status": res.status.value,
                "event_date": res.event_date.isoformat() if res.event_date else None,
                "guest_count": res.guest_count,
                "phone": res.phone,
                "notes": res.notes,
                "created_at": res.created_at,
                "lead": _to_public_lead(res.lead),
            }
        )
    return result
