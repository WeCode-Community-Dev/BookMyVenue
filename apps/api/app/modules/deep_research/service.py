"""Deep Research orchestration.

Phase 1: Query Understanding → Internal Retrieval (hybrid search) → persisted
query log (breakdown + result summary for admin observability).

Phase 2 (this file): External discovery via Google Places. Runs as a single
async request — no job queue, no polling. Cloudinary photo uploads are
concurrent (asyncio.gather), so total wait time ≈ 1× upload rather than N×.
"""

import asyncio
import logging
import math
from uuid import UUID

from sqlalchemy.orm import Session

from app.core.config import settings
from app.modules.deep_research.models import (
    DeepResearchQuery,
    ExternalDiscoveryRequest,
    ExternalVenueLead,
    LeadReservation,
    LeadReservationStatus,
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
    category_id: UUID,
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
        category_id=category_id,
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


# ─── Admin conversion workflow ────────────────────────────────────────────────
# Converts an external reservation into an onboarded owner + venue + normal
# Venue404 booking. See docs/Venue404_External_Reservation_Onboarding_PRD.md

def sync_reservation_status_for_venue(db: Session, venue_id: UUID, new_venue_status) -> None:
    """Advances the linked LeadReservation's status when its venue is
    submitted for review or approved. Called from venue/admin service code
    on the same transaction, before that caller's commit — no commit here.
    """
    from app.modules.venue.models import VenueStatus

    mapping = {
        VenueStatus.pending_approval: LeadReservationStatus.VENUE_PENDING_APPROVAL,
        VenueStatus.approved: LeadReservationStatus.VENUE_APPROVED,
    }
    target = mapping.get(new_venue_status)
    if target is None:
        return

    reservation = db.query(LeadReservation).filter(LeadReservation.venue_id == venue_id).first()
    if reservation and reservation.status != target:
        reservation.status = target


def list_external_reservations(
    db: Session, status: str | None, page: int, page_size: int
) -> dict:
    from sqlalchemy.orm import joinedload
    from app.modules.profile.models import Profile

    query = (
        db.query(LeadReservation)
        .options(joinedload(LeadReservation.lead))
        .order_by(LeadReservation.created_at.desc())
    )
    if status:
        query = query.filter(LeadReservation.status == LeadReservationStatus(status))

    total = query.count()
    reservations = query.offset((page - 1) * page_size).limit(page_size).all()

    from app.modules.venue.models import VenueCategory

    customer_ids = {r.user_id for r in reservations}
    customers = {
        p.id: p for p in db.query(Profile).filter(Profile.id.in_(customer_ids)).all()
    } if customer_ids else {}

    category_ids = {r.category_id for r in reservations if r.category_id}
    categories = {
        c.id: c for c in db.query(VenueCategory).filter(VenueCategory.id.in_(category_ids)).all()
    } if category_ids else {}

    items = []
    for r in reservations:
        customer = customers.get(r.user_id)
        category = categories.get(r.category_id) if r.category_id else None
        contact_info = r.lead.raw_contact_info or {}
        items.append({
            "id": r.id,
            "status": r.status.value,
            "lead_name": r.lead.name,
            "lead_city": r.lead.city,
            "lead_formatted_address": r.lead.formatted_address,
            "lead_category_guess": r.lead.category_guess,
            "lead_cover_photo_url": r.lead.cover_photo_url,
            "lead_phone": contact_info.get("phone"),
            "lead_website": contact_info.get("website"),
            "lead_rating": contact_info.get("rating"),
            "lead_google_maps_uri": contact_info.get("google_maps_uri"),
            "customer_name": customer.full_name if customer else None,
            "customer_email": customer.email if customer else None,
            "customer_phone": r.phone,
            "customer_notes": r.notes,
            "category_id": r.category_id,
            "category_label": category.label if category else None,
            "guest_count": r.guest_count,
            "event_date": r.event_date.isoformat() if r.event_date else None,
            "owner_id": r.owner_id,
            "venue_id": r.venue_id,
            "booking_id": r.booking_id,
            "contact_method": r.contact_method,
            "contact_notes": r.contact_notes,
            "follow_up_date": r.follow_up_date.isoformat() if r.follow_up_date else None,
            "owner_invited_at": r.owner_invited_at,
            "booking_created_at": r.booking_created_at,
            "created_at": r.created_at,
        })

    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": max(1, math.ceil(total / page_size)),
    }


def _get_reservation_or_404(db: Session, reservation_id: UUID) -> LeadReservation:
    from app.core.exceptions import NotFoundError

    reservation = db.get(LeadReservation, reservation_id)
    if reservation is None:
        raise NotFoundError("External reservation not found")
    return reservation


def contact_reservation(
    db: Session,
    *,
    admin_id: UUID,
    reservation_id: UUID,
    contact_method: str,
    notes: str,
    follow_up_date,
) -> None:
    from app.core.exceptions import ConflictError
    from app.modules.admin.models import AdminAction

    reservation = _get_reservation_or_404(db, reservation_id)
    if reservation.status not in (LeadReservationStatus.NEW, LeadReservationStatus.CONTACTED):
        raise ConflictError(f"Cannot log contact in status '{reservation.status.value}'")

    reservation.contact_method = contact_method
    reservation.contact_notes = notes
    reservation.follow_up_date = follow_up_date
    reservation.status = LeadReservationStatus.CONTACTED

    db.add(AdminAction(
        admin_id=admin_id, action_type="external_reservation_contacted",
        target_type="external_reservation", target_id=reservation_id, reason=notes or None,
    ))
    db.commit()


def mark_owner_interested(db: Session, *, admin_id: UUID, reservation_id: UUID, reason: str = "") -> None:
    from app.core.exceptions import ConflictError
    from app.modules.admin.models import AdminAction

    reservation = _get_reservation_or_404(db, reservation_id)
    if reservation.status != LeadReservationStatus.CONTACTED:
        raise ConflictError("Owner can only be marked interested after being contacted")

    reservation.status = LeadReservationStatus.OWNER_INTERESTED
    db.add(AdminAction(
        admin_id=admin_id, action_type="external_reservation_owner_interested",
        target_type="external_reservation", target_id=reservation_id, reason=reason or None,
    ))
    db.commit()


def invite_owner_for_reservation(
    db: Session,
    *,
    admin_id: UUID,
    reservation_id: UUID,
    venue_name: str,
    owner_name: str | None,
    email: str,
    phone: str | None,
    category_id: UUID | None = None,
) -> tuple[LeadReservation, str]:
    from datetime import datetime, time, timezone

    from app.core.exceptions import ConflictError
    from app.modules.admin.models import AdminAction
    from app.modules.auth.dependencies import get_auth_provider
    from app.modules.profile.models import Profile, ProfileStatus, UserRole, UserRoleAssignment
    from app.modules.venue.schemas import CreateVenueRequest
    from app.modules.venue.service import create_venue

    reservation = _get_reservation_or_404(db, reservation_id)
    if reservation.status != LeadReservationStatus.OWNER_INTERESTED:
        raise ConflictError("Owner must be marked interested before inviting them")

    resolved_category_id = category_id or reservation.category_id
    if resolved_category_id is None:
        raise ConflictError("This reservation has no category — pass category_id to invite the owner")

    provider_user, action_link = get_auth_provider().create_invite_link(
        email, full_name=owner_name, phone=phone,
        redirect_to=f"{settings.owner_portal_base_url}/accept-invite",
    )

    profile = db.get(Profile, provider_user.id)
    if profile is None:
        raise ConflictError("Invited account was not provisioned — try again")
    if owner_name:
        profile.full_name = owner_name
    if phone:
        profile.phone = phone
    profile.status = ProfileStatus.active

    if not db.query(UserRoleAssignment).filter(
        UserRoleAssignment.user_id == provider_user.id,
        UserRoleAssignment.role == UserRole.venue_owner,
    ).first():
        db.add(UserRoleAssignment(user_id=provider_user.id, role=UserRole.venue_owner))

    # Same creation path (and same defaults) an owner uses through CreateVenueWizard —
    # the draft is a completely ordinary `venues` row that the owner later edits and
    # submits through the normal owner-portal flow.
    from app.modules.venue.schemas import BookingType

    lead = reservation.lead
    venue = create_venue(
        db,
        owner_id=provider_user.id,
        body=CreateVenueRequest(
            name=venue_name,
            category_id=resolved_category_id,
            address_line1=lead.formatted_address or venue_name,
            city=lead.city or "Unknown",
            state="Unknown",
            max_capacity=reservation.guest_count or 100,
            open_time=time(9, 0),
            close_time=time(23, 0),
            # Single booking type keeps this consistent with the default
            # pricing_mode ('flat'), which in turn requires a starting price —
            # both are placeholders the owner fills in for real before submitting.
            allowed_booking_types=[BookingType.full_day],
            starting_price_paise=0,
        ),
    )

    reservation.owner_id = provider_user.id
    reservation.venue_id = venue.id
    reservation.owner_invited_at = datetime.now(timezone.utc)
    reservation.status = LeadReservationStatus.OWNER_INVITED

    db.add(AdminAction(
        admin_id=admin_id, action_type="external_reservation_owner_invited",
        target_type="external_reservation", target_id=reservation_id,
        reason=f"Invited {email} for venue '{venue_name}'",
    ))
    db.commit()
    db.refresh(reservation)

    # Best-effort — email delivery must never undo the invite/venue/role work
    # above, which already succeeded and is committed by this point.
    try:
        from app.core.email import send_email
        from app.modules.notification.templates import render_owner_invite_email

        subject, html = render_owner_invite_email(owner_name, venue_name, action_link)
        send_email(email, subject, html)
    except Exception:
        logger.warning("Could not email invite link to %s — admin must share it manually", email, exc_info=True)

    return reservation, action_link


def create_booking_for_reservation(db: Session, *, admin_id: UUID, reservation_id: UUID):
    from datetime import datetime, timedelta, timezone
    from zoneinfo import ZoneInfo

    from app.core.exceptions import ConflictError
    from app.modules.admin.models import AdminAction
    from app.modules.booking.schemas import BookingRequestIn
    from app.modules.booking.service import create_booking_request
    from app.modules.venue.models import Venue, VenuePhoto

    reservation = _get_reservation_or_404(db, reservation_id)
    if reservation.status != LeadReservationStatus.VENUE_APPROVED:
        raise ConflictError("Venue must be approved before creating a booking")
    if reservation.booking_id is not None:
        raise ConflictError("A booking already exists for this reservation")
    if reservation.venue_id is None:
        raise ConflictError("Reservation has no linked venue")
    if reservation.event_date is None:
        raise ConflictError("Reservation has no event date")

    venue = db.get(Venue, reservation.venue_id)
    cover_photo = db.query(VenuePhoto).filter(
        VenuePhoto.venue_id == venue.id, VenuePhoto.is_cover.is_(True), VenuePhoto.deleted_at.is_(None),
    ).first()

    # No frontend step computes starts_at/ends_at for this flow (unlike the normal
    # booking form), so derive them the same way it would: event_date + the venue's
    # own operating hours, localized to the venue's timezone.
    venue_tz = ZoneInfo(venue.timezone)
    starts_at = datetime.combine(reservation.event_date, venue.open_time, tzinfo=venue_tz)
    end_date = reservation.event_date
    if venue.spans_next_day and venue.close_time <= venue.open_time:
        end_date += timedelta(days=1)
    ends_at = datetime.combine(end_date, venue.close_time, tzinfo=venue_tz)

    booking = create_booking_request(
        db,
        user_id=reservation.user_id,
        payload=BookingRequestIn(
            venue_id=venue.id,
            venue_name=venue.name,
            venue_cover_image=cover_photo.image_url if cover_photo else None,
            booking_type="full_day",
            starts_at=starts_at,
            ends_at=ends_at,
            booking_date=reservation.event_date,
            guest_count=reservation.guest_count or 1,
            user_notes=reservation.notes,
        ),
    )

    reservation.booking_id = booking.id
    reservation.booking_created_at = datetime.now(timezone.utc)
    reservation.status = LeadReservationStatus.BOOKING_CREATED

    db.add(AdminAction(
        admin_id=admin_id, action_type="external_reservation_booking_created",
        target_type="external_reservation", target_id=reservation_id,
        reason=f"Booking {booking.id} created",
    ))
    db.commit()
    return booking
