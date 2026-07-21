import json
import logging
import math
import urllib.request
import uuid
from datetime import UTC, datetime, timedelta
from pathlib import Path

from sqlalchemy import case, cast, func, text
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, contains_eager, joinedload

from app.core.config import settings
from app.core.database import SessionLocal
from app.core.exceptions import BadRequestError, ConflictError, ForbiddenError, NotFoundError
from app.core.storage import delete_image_from_cloudinary, upload_image_to_cloudinary
from app.modules.admin import settings_store
from app.modules.admin.models import AdminAction
from app.modules.admin.schemas import (
    AmenityUpdateRequest,
    CategoryUpdateRequest,
    DeepResearchQueryDetail,
    DeepResearchQueryListResponse,
    DeepResearchQuerySummary,
    DeepResearchStatsResponse,
    PlatformSettingsUpdateRequest,
)
from app.modules.booking.models import Booking, BookingSlot, BookingStatus
from app.modules.deep_research.models import DeepResearchQuery
from app.modules.profile.models import Profile, ProfileStatus, UserRole, UserRoleAssignment
from app.modules.venue.models import Amenity, Venue, VenueAmenity, VenueCategory, VenueStatus

logger = logging.getLogger(__name__)


# Descriptions and queue mechanism are business/implementation knowledge, not
# something a cron schedule encodes, so they stay hardcoded here. The actual
# `schedule` label for each job is looked up from schedule.json at request
# time — see _job_schedule_labels() — so it can't drift from the real
# GitHub Actions trigger in .github/workflows/jobs.yml.
_JOB_CATALOG = [
    {
        "name": "hold_expiry",
        "description": "Expires accepted bookings whose 24-hour token-payment hold has passed.",
        "queue_type": "Polling sweep",
    },
    {
        "name": "request_expiry",
        "description": "Expires unanswered booking requests older than the request-expiry window.",
        "queue_type": "Polling sweep",
    },
    {
        "name": "completion",
        "description": (
            "Marks confirmed, fully-paid bookings completed once the event date has passed."
        ),
        "queue_type": "Polling sweep",
    },
    {
        "name": "payment_reminders",
        "description": (
            "Reminds accepted-but-unpaid users to pay the token advance before their hold expires."
        ),
        "queue_type": "Polling sweep",
    },
    {
        "name": "overdue_flag",
        "description": "Flags bookings with an overdue balance and opens the owner action window.",
        "queue_type": "Polling sweep",
    },
    {
        "name": "overdue_autocancel",
        "description": (
            "Auto-cancels bookings whose owner action window has expired (forfeits advance)."
        ),
        "queue_type": "Polling sweep",
    },
    {
        "name": "search_indexer",
        "description": "Processes queued venue search-index updates.",
        "queue_type": "Queued (Redis + DB fallback, retries with backoff)",
    },
    {
        "name": "payment_pending_expiry",
        "description": "Releases instant bookings whose payment window expired unpaid.",
        "queue_type": "Polling sweep",
    },
    {
        "name": "invoice_generator",
        "description": "Generates invoices for completed and confirmed bookings.",
        "queue_type": "Queued (Redis + DB fallback, retries with backoff)",
    },
]

_SCHEDULE_FILE = Path(__file__).resolve().parents[2] / "jobs" / "schedule.json"


def _job_schedule_labels() -> dict[str, str]:
    """
    Map each job name to its human-readable schedule label, derived from
    app/jobs/schedule.json — the single source of truth also read by
    .github/workflows/jobs.yml. Falls back to "Unscheduled" if a job is
    missing from the file rather than failing the whole settings request.
    """
    data = json.loads(_SCHEDULE_FILE.read_text())
    labels: dict[str, str] = {}
    for entry in data["schedules"]:
        for job_name in entry["jobs"]:
            labels[job_name] = entry["label"]
    return labels


def get_platform_settings(db: Session) -> dict:
    """
    Platform-wide booking/commission rules (admin-editable, DB-backed via
    settings_store) plus deployment-level operational config (still sourced
    from env/config.py) and the background-job catalog. There is no live
    job-run history — see _JOB_CATALOG.
    """
    schedule_labels = _job_schedule_labels()
    jobs = [
        {**job, "schedule": schedule_labels.get(job["name"], "Unscheduled")} for job in _JOB_CATALOG
    ]

    return {
        **settings_store.get_settings(db),
        "environment": settings.environment,
        "currency": settings.stripe_currency.upper(),
        "background_jobs_enabled": settings.enable_jobs,
        "job_runner_configured": bool(settings.job_runner_token),
        "search_diagnostics_enabled": settings.search_diagnostics_enabled,
        "jobs": jobs,
    }


def get_settings_metadata() -> dict:
    """Static registry metadata, grouped by category, for the admin settings
    form. Pure code lookup — no DB/cache involved.
    """
    by_category: dict[str, list[dict]] = {}
    for key, spec in settings_store.SETTINGS.items():
        by_category.setdefault(spec.category, []).append(
            {
                "key": key,
                "label": spec.label,
                "description": spec.description,
                "value_type": spec.value_type,
                "min_value": spec.min_value,
                "max_value": spec.max_value,
            }
        )

    return {
        "categories": [
            {
                "key": category,
                "label": settings_store.CATEGORY_LABELS[category],
                "fields": fields,
            }
            for category, fields in by_category.items()
        ]
    }


def update_platform_settings(
    db: Session,
    *,
    admin_id: uuid.UUID,
    body: PlatformSettingsUpdateRequest,
) -> dict:
    updates = body.model_dump(exclude_unset=True, exclude_none=True)
    if not updates:
        return get_platform_settings(db)

    try:
        coerced = settings_store.validate_settings(updates)
    except ValueError as exc:
        raise BadRequestError(str(exc)) from exc

    settings_store.set_settings(db, updated_by=admin_id, updates=coerced)

    db.add(
        AdminAction(
            admin_id=admin_id,
            action_type="settings_updated",
            target_type="settings",
            target_id=admin_id,
            action_metadata={"changed": coerced},
        )
    )
    db.commit()

    return get_platform_settings(db)


def _month_start(year: int, month: int) -> datetime:
    return datetime(year, month, 1, tzinfo=UTC)


def _add_months(dt: datetime, n: int) -> datetime:
    total = dt.year * 12 + (dt.month - 1) + n
    y, m = divmod(total, 12)
    return _month_start(y, m + 1)


# ─── Dashboard stats cache-aside ─────────────────────────────────────────────
# Short TTL only (no explicit invalidation) for booking/growth stats — the
# number of booking-status-transition call sites across the codebase makes
# exhaustive invalidation impractical, and a dashboard chart being up to a
# minute stale is an acceptable tradeoff. Venue/owner stats DO get explicit
# invalidation (see invalidate_venue_stats_cache/invalidate_owner_stats_cache)
# since their write paths are few and well-defined (approve/reject/suspend/
# reactivate), so those stay always-fresh.
_STATS_CACHE_TTL_SECONDS = 60


def invalidate_venue_stats_cache() -> None:
    from app.core.cache import cache_delete

    cache_delete("admin:stats:venues")


def invalidate_owner_stats_cache() -> None:
    from app.core.cache import cache_delete

    cache_delete("admin:stats:owners")


def _invalidate_venue_caches(venue: Venue) -> None:
    """Call after any commit that changes a venue's status — invalidates both
    its public detail cache and the admin venue-stats aggregate."""
    from app.modules.venue import service as venue_service

    venue_service.invalidate_venue_cache(venue)
    invalidate_venue_stats_cache()


def _invalidate_amenities_cache() -> None:
    from app.modules.venue import service as venue_service

    venue_service.invalidate_amenities_cache()


def _invalidate_categories_cache() -> None:
    from app.modules.venue import service as venue_service

    venue_service.invalidate_categories_cache()


def get_growth_stats(db: Session, period: str = "6m") -> dict:
    import json
    from datetime import timedelta

    from app.core.cache import cache_get, cache_set

    now = datetime.now(UTC)

    # Parse period → build (start, end, label) buckets + trunc unit
    VALID = {"7d", "30d", "3m", "6m", "12m"}
    if period not in VALID:
        period = "6m"

    cache_key = f"admin:stats:growth:{period}"
    cached = cache_get(cache_key)
    if cached is not None:
        return json.loads(cached)

    use_days = period.endswith("d")
    buckets: list[tuple[datetime, datetime, str]] = []

    if use_days:
        n_days = int(period[:-1])
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        for i in range(n_days - 1, -1, -1):
            start = today_start - timedelta(days=i)
            end = start + timedelta(days=1)
            label = f"{start.day} {start.strftime('%b')}"
            buckets.append((start, end, label))
        trunc = "day"
    else:
        n_months = int(period[:-1])
        for i in range(n_months - 1, -1, -1):
            start = _month_start(now.year, now.month)
            start = _add_months(start, -i)
            end = _add_months(start, 1)
            label = start.strftime("%b %y")
            buckets.append((start, end, label))
        trunc = "month"

    period_start = buckets[0][0]

    def baseline(model, extra_filter=None):
        q = db.query(func.count(model.id)).filter(model.created_at < period_start)
        if extra_filter is not None:
            q = q.filter(extra_filter)
        return q.scalar() or 0

    def bucket_new(model, extra_filter=None):
        q = db.query(
            func.date_trunc(trunc, model.created_at).label("bucket"),
            func.count(model.id).label("cnt"),
        ).filter(model.created_at >= period_start)
        if extra_filter is not None:
            q = q.filter(extra_filter)
        rows = q.group_by("bucket").all()
        return {r.bucket.replace(tzinfo=UTC): r.cnt for r in rows}

    base_users = baseline(Profile)
    base_owners = baseline(UserRoleAssignment, UserRoleAssignment.role == UserRole.venue_owner)
    base_venues = baseline(Venue, Venue.deleted_at.is_(None))
    base_bookings = baseline(Booking, Booking.deleted_at.is_(None))

    new_users = bucket_new(Profile)
    new_owners = bucket_new(UserRoleAssignment, UserRoleAssignment.role == UserRole.venue_owner)
    new_venues = bucket_new(Venue, Venue.deleted_at.is_(None))
    new_bookings = bucket_new(Booking, Booking.deleted_at.is_(None))

    labels, users_s, owners_s, venues_s, bookings_s = [], [], [], [], []
    cum_u = base_users
    cum_o = base_owners
    cum_v = base_venues
    cum_b = base_bookings

    for start, _end, label in buckets:
        cum_u += new_users.get(start, 0)
        cum_o += new_owners.get(start, 0)
        cum_v += new_venues.get(start, 0)
        cum_b += new_bookings.get(start, 0)
        labels.append(label)
        users_s.append(cum_u)
        owners_s.append(cum_o)
        venues_s.append(cum_v)
        bookings_s.append(cum_b)

    result = {
        "labels": labels,
        "users": users_s,
        "owners": owners_s,
        "venues": venues_s,
        "bookings": bookings_s,
        "totals": {
            "users": users_s[-1] if users_s else 0,
            "owners": owners_s[-1] if owners_s else 0,
            "venues": venues_s[-1] if venues_s else 0,
            "bookings": bookings_s[-1] if bookings_s else 0,
        },
    }
    cache_set(cache_key, json.dumps(result), _STATS_CACHE_TTL_SECONDS)
    return result


def get_venue_stats(db: Session) -> dict:
    import json

    from app.core.cache import cache_get, cache_set

    cached = cache_get("admin:stats:venues")
    if cached is not None:
        return json.loads(cached)

    row = (
        db.query(Venue)
        .filter(Venue.deleted_at.is_(None))
        .with_entities(
            func.count(Venue.id).label("total"),
            func.count(case((Venue.status == VenueStatus.pending_approval, 1))).label(
                "pending_approval"
            ),
            func.count(case((Venue.status == VenueStatus.approved, 1))).label("approved"),
            func.count(case((Venue.status == VenueStatus.rejected, 1))).label("rejected"),
            func.count(case((Venue.status == VenueStatus.suspended, 1))).label("suspended"),
            func.count(case((Venue.status == VenueStatus.draft, 1))).label("draft"),
        )
        .one()
    )
    result = {
        "total": row.total,
        "pending_approval": row.pending_approval,
        "approved": row.approved,
        "rejected": row.rejected,
        "suspended": row.suspended,
        "draft": row.draft,
    }
    cache_set("admin:stats:venues", json.dumps(result), _STATS_CACHE_TTL_SECONDS)
    return result


def list_admin_venues(
    db: Session,
    *,
    status: str | None = None,
    search: str | None = None,
    page: int = 1,
    page_size: int = 20,
) -> dict:
    base = db.query(Venue).filter(Venue.deleted_at.is_(None))

    stats_row = base.with_entities(
        func.count(Venue.id).label("total"),
        func.count(case((Venue.status == VenueStatus.pending_approval, 1))).label(
            "pending_approval"
        ),
        func.count(case((Venue.status == VenueStatus.approved, 1))).label("approved"),
        func.count(case((Venue.status == VenueStatus.rejected, 1))).label("rejected"),
        func.count(case((Venue.status == VenueStatus.suspended, 1))).label("suspended"),
        func.count(case((Venue.status == VenueStatus.draft, 1))).label("draft"),
    ).one()

    filtered = base
    if status:
        filtered = filtered.filter(Venue.status == VenueStatus(status))
    if search:
        safe = search.strip().replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")
        filtered = filtered.filter(Venue.name.ilike(f"%{safe}%"))

    total = filtered.with_entities(func.count(Venue.id)).scalar()
    venues = (
        filtered.options(
            joinedload(Venue.photos), joinedload(Venue.amenities), joinedload(Venue.category)
        )
        .order_by(Venue.updated_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    owner_ids = [v.owner_id for v in venues]
    profiles = db.query(Profile).filter(Profile.id.in_(owner_ids)).all()
    profile_by_id = {p.id: p for p in profiles}

    items = []
    for v in venues:
        cover = next((p.image_url for p in v.photos if p.is_cover and p.deleted_at is None), None)
        owner = profile_by_id.get(v.owner_id)
        items.append(
            {
                "id": v.id,
                "name": v.name,
                "slug": v.slug,
                "description": v.description,
                "category_slug": v.category.slug,
                "address_line1": v.address_line1,
                "city": v.city,
                "state": v.state,
                "country": v.country,
                "min_capacity": v.min_capacity,
                "max_capacity": v.max_capacity,
                "open_time": str(v.open_time),
                "close_time": str(v.close_time),
                "pricing_mode": v.pricing_mode,
                "starting_price_paise": v.starting_price_paise,
                "hourly_rate_paise": v.hourly_rate_paise,
                "advance_pct": float(v.advance_pct),
                "platform_commission_pct": float(v.platform_commission_pct),
                "status": v.status.value,
                "is_active": v.is_active,
                "cover_photo_url": cover,
                "amenities": [a.name for a in v.amenities],
                "owner": {
                    "id": owner.id if owner else v.owner_id,
                    "full_name": owner.full_name if owner else None,
                    "email": owner.email if owner else None,
                },
                "created_at": v.created_at,
                "updated_at": v.updated_at,
            }
        )

    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": math.ceil(total / page_size) if total else 1,
        "stats": {
            "total": stats_row.total,
            "pending_approval": stats_row.pending_approval,
            "approved": stats_row.approved,
            "rejected": stats_row.rejected,
            "suspended": stats_row.suspended,
            "draft": stats_row.draft,
        },
    }


def _get_venue_or_404(db: Session, venue_id: uuid.UUID) -> Venue:
    venue = db.query(Venue).filter(Venue.id == venue_id, Venue.deleted_at.is_(None)).first()
    if not venue:
        raise NotFoundError("Venue not found")
    return venue


def _check_no_active_bookings(db: Session, venue_id: uuid.UUID) -> None:
    # to_regclass returns NULL (not an error) when the table doesn't exist, so this query
    # never fails and never poisons the current transaction.
    table_exists = db.execute(text("SELECT to_regclass('public.bookings') IS NOT NULL")).scalar()
    if not table_exists:
        return  # Bookings not yet migrated — skip check
    try:
        from app.modules.booking.models import Booking, BookingStatus  # noqa: PLC0415

        count = (
            db.query(func.count(Booking.id))
            .filter(
                cast(Booking.venue_id, PGUUID) == venue_id,
                Booking.status.in_(
                    [
                        BookingStatus.requested,
                        BookingStatus.accepted,
                        BookingStatus.confirmed,
                    ]
                ),
            )
            .scalar()
        )
        if count and count > 0:
            raise ConflictError(f"Cannot suspend: venue has {count} active booking(s)")
    except ConflictError:
        raise
    except Exception as e:
        logger.warning("Booking check error for venue %s: %s", venue_id, e)


def approve_venue(
    db: Session,
    *,
    admin_id: uuid.UUID,
    venue_id: uuid.UUID,
    reason: str = "",
) -> None:
    venue = _get_venue_or_404(db, venue_id)
    if venue.status != VenueStatus.pending_approval:
        raise ConflictError("Venue is not pending approval")
    venue.status = VenueStatus.approved
    db.add(
        AdminAction(
            admin_id=admin_id,
            action_type="venue_approved",
            target_type="venue",
            target_id=venue_id,
            reason=reason or None,
        )
    )

    from app.modules.deep_research.service import sync_reservation_status_for_venue

    sync_reservation_status_for_venue(db, venue_id, VenueStatus.approved)

    from app.modules.notification import service as notifications
    from app.modules.notification.types import NotificationType

    notifications.notify(
        db,
        venue.owner_id,
        NotificationType.VENUE_APPROVED,
        context={"venue_name": venue.name},
    )

    db.commit()
    _invalidate_venue_caches(venue)

    from app.modules.search.indexer import enqueue_job

    enqueue_job(db, venue_id, "update")


def reject_venue(
    db: Session,
    *,
    admin_id: uuid.UUID,
    venue_id: uuid.UUID,
    reason: str = "",
) -> None:
    venue = _get_venue_or_404(db, venue_id)
    if venue.status not in (VenueStatus.pending_approval, VenueStatus.approved):
        raise ConflictError("Venue cannot be rejected in its current state")
    venue.status = VenueStatus.rejected
    db.add(
        AdminAction(
            admin_id=admin_id,
            action_type="venue_rejected",
            target_type="venue",
            target_id=venue_id,
            reason=reason or None,
        )
    )

    from app.modules.notification import service as notifications
    from app.modules.notification.types import NotificationType

    notifications.notify(
        db,
        venue.owner_id,
        NotificationType.VENUE_REJECTED,
        context={"venue_name": venue.name, "reason": reason or "No reason provided."},
    )

    db.commit()
    _invalidate_venue_caches(venue)


def suspend_venue(
    db: Session,
    *,
    admin_id: uuid.UUID,
    venue_id: uuid.UUID,
    reason: str,
) -> None:
    if not reason.strip():
        raise ConflictError("Reason is required to suspend a venue")
    venue = _get_venue_or_404(db, venue_id)
    if venue.status == VenueStatus.suspended:
        raise ConflictError("Venue is already suspended")
    if venue.status != VenueStatus.approved:
        raise ConflictError("Only approved venues can be suspended")
    _check_no_active_bookings(db, venue_id)
    venue.status = VenueStatus.suspended
    db.add(
        AdminAction(
            admin_id=admin_id,
            action_type="venue_suspended",
            target_type="venue",
            target_id=venue_id,
            reason=reason,
        )
    )

    from app.modules.notification import service as notifications
    from app.modules.notification.types import NotificationType

    notifications.notify(
        db,
        venue.owner_id,
        NotificationType.VENUE_SUSPENDED,
        context={"venue_name": venue.name, "reason": reason},
    )

    db.commit()
    _invalidate_venue_caches(venue)


def reactivate_venue(
    db: Session,
    *,
    admin_id: uuid.UUID,
    venue_id: uuid.UUID,
    reason: str = "",
) -> None:
    venue = _get_venue_or_404(db, venue_id)
    if venue.status not in (VenueStatus.suspended, VenueStatus.rejected):
        raise ConflictError("Only suspended or rejected venues can be reactivated")
    venue.status = VenueStatus.approved
    db.add(
        AdminAction(
            admin_id=admin_id,
            action_type="venue_reactivated",
            target_type="venue",
            target_id=venue_id,
            reason=reason or None,
        )
    )

    from app.modules.notification import service as notifications
    from app.modules.notification.types import NotificationType

    notifications.notify(
        db,
        venue.owner_id,
        NotificationType.VENUE_REACTIVATED,
        context={"venue_name": venue.name},
    )

    db.commit()
    _invalidate_venue_caches(venue)

    from app.modules.search.indexer import enqueue_job

    enqueue_job(db, venue_id, "update")


def approve_owner(
    db: Session,
    *,
    admin_id: uuid.UUID,
    user_id: uuid.UUID,
    reason: str = "",
) -> None:
    profile = (
        db.query(Profile)
        .filter(
            Profile.id == user_id,
            Profile.deleted_at.is_(None),
        )
        .first()
    )
    if not profile:
        raise NotFoundError("User not found")
    if profile.status != ProfileStatus.pending:
        raise ConflictError("User is not in pending status")

    profile.status = ProfileStatus.active
    db.add(
        AdminAction(
            admin_id=admin_id,
            action_type="venue_owner_approved",
            target_type="user",
            target_id=user_id,
            reason=reason or None,
        )
    )
    db.commit()
    invalidate_owner_stats_cache()

    # Best-effort — email delivery must never undo the approval above, which
    # already succeeded and is committed by this point.
    if profile.email:
        try:
            from app.core.email import send_email
            from app.modules.notification.templates import render_owner_approved_email

            subject, html = render_owner_approved_email(profile.full_name)
            send_email(profile.email, subject, html)
        except Exception:
            logger.warning(
                "Could not email owner-approved notice to %s", profile.email, exc_info=True
            )


def reject_owner(
    db: Session,
    *,
    admin_id: uuid.UUID,
    user_id: uuid.UUID,
    reason: str = "",
) -> None:
    profile = (
        db.query(Profile)
        .filter(
            Profile.id == user_id,
            Profile.deleted_at.is_(None),
        )
        .first()
    )
    if not profile:
        raise NotFoundError("User not found")
    if profile.status != ProfileStatus.pending:
        raise ConflictError("User is not in pending status")

    profile.status = ProfileStatus.rejected
    db.add(
        AdminAction(
            admin_id=admin_id,
            action_type="venue_owner_rejected",
            target_type="user",
            target_id=user_id,
            reason=reason or None,
        )
    )
    db.commit()
    invalidate_owner_stats_cache()

    # Best-effort — email delivery must never undo the rejection above, which
    # already succeeded and is committed by this point.
    if profile.email:
        try:
            from app.core.email import send_email
            from app.modules.notification.templates import render_owner_rejected_email

            subject, html = render_owner_rejected_email(profile.full_name, reason)
            send_email(profile.email, subject, html)
        except Exception:
            logger.warning(
                "Could not email owner-rejected notice to %s", profile.email, exc_info=True
            )


def _build_user_dict(
    profile: Profile,
    roles: list[str],
    email: str | None,
) -> dict:
    return {
        "id": profile.id,
        "full_name": profile.full_name,
        "email": email,
        "phone": profile.phone,
        "status": profile.status.value,
        "roles": roles,
        "created_at": profile.created_at,
        "is_super_admin": "super_admin" in roles,
    }


def get_owner_stats(db: Session) -> dict:
    import json

    from app.core.cache import cache_get, cache_set

    cached = cache_get("admin:stats:owners")
    if cached is not None:
        return json.loads(cached)

    owner_subq = (
        db.query(UserRoleAssignment.user_id)
        .filter(UserRoleAssignment.role == UserRole.venue_owner)
        .scalar_subquery()
    )
    base = db.query(Profile).filter(
        Profile.deleted_at.is_(None),
        Profile.id.in_(owner_subq),
    )
    row = base.with_entities(
        func.count(Profile.id).label("total"),
        func.count(case((Profile.status == ProfileStatus.pending, 1))).label("pending"),
        func.count(case((Profile.status == ProfileStatus.active, 1))).label("active"),
        func.count(case((Profile.status == ProfileStatus.rejected, 1))).label("rejected"),
        func.count(case((Profile.status == ProfileStatus.suspended, 1))).label("suspended"),
    ).one()
    result = {
        "total": row.total,
        "pending": row.pending,
        "active": row.active,
        "rejected": row.rejected,
        "suspended": row.suspended,
    }
    cache_set("admin:stats:owners", json.dumps(result), _STATS_CACHE_TTL_SECONDS)
    return result


def list_users(
    db: Session,
    *,
    page: int = 1,
    page_size: int = 20,
    search: str | None = None,
    status: str | None = None,
    role: str | None = None,
) -> dict:
    base = db.query(Profile).filter(Profile.deleted_at.is_(None))

    filtered = base
    if search:
        safe = search.strip().replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")
        pattern = f"%{safe}%"
        filtered = filtered.filter(Profile.full_name.ilike(pattern) | Profile.email.ilike(pattern))
    if status:
        filtered = filtered.filter(Profile.status == ProfileStatus(status))
    if role:
        role_subq = (
            db.query(UserRoleAssignment.user_id)
            .filter(UserRoleAssignment.role == UserRole(role))
            .scalar_subquery()
        )
        filtered = filtered.filter(Profile.id.in_(role_subq))

    total = filtered.with_entities(func.count(Profile.id)).scalar()

    # Global stats — always reflect platform-wide counts regardless of filters
    stats_row = base.with_entities(
        func.count(Profile.id).label("total"),
        func.count(case((Profile.status == ProfileStatus.active, 1))).label("active"),
        func.count(case((Profile.status == ProfileStatus.suspended, 1))).label("suspended"),
        func.count(case((Profile.status == ProfileStatus.pending, 1))).label("pending"),
        func.count(case((Profile.status == ProfileStatus.rejected, 1))).label("rejected"),
    ).one()

    profiles = (
        filtered.order_by(Profile.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    profile_ids = [p.id for p in profiles]

    role_rows = (
        db.query(UserRoleAssignment).filter(UserRoleAssignment.user_id.in_(profile_ids)).all()
    )
    roles_by_user: dict[uuid.UUID, list[str]] = {pid: [] for pid in profile_ids}
    for rr in role_rows:
        if rr.user_id in roles_by_user:
            roles_by_user[rr.user_id].append(rr.role.value)

    items = [_build_user_dict(p, roles_by_user.get(p.id, []), p.email) for p in profiles]

    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": math.ceil(total / page_size) if total else 1,
        "stats": {
            "total": stats_row.total,
            "active": stats_row.active,
            "suspended": stats_row.suspended,
            "pending": stats_row.pending,
            "rejected": stats_row.rejected,
        },
    }


def get_user(db: Session, user_id: uuid.UUID) -> dict:
    profile = (
        db.query(Profile)
        .filter(
            Profile.id == user_id,
            Profile.deleted_at.is_(None),
        )
        .first()
    )
    if not profile:
        raise NotFoundError("User not found")

    role_rows = (
        db.query(UserRoleAssignment)
        .filter(
            UserRoleAssignment.user_id == user_id,
        )
        .all()
    )
    roles = [r.role.value for r in role_rows]
    return _build_user_dict(profile, roles, profile.email)


def suspend_user(
    db: Session,
    *,
    admin_id: uuid.UUID,
    user_id: uuid.UUID,
    reason: str,
) -> None:
    if not reason.strip():
        raise ConflictError("Reason is required")

    profile = (
        db.query(Profile)
        .filter(
            Profile.id == user_id,
            Profile.deleted_at.is_(None),
        )
        .first()
    )
    if not profile:
        raise NotFoundError("User not found")

    is_super_admin = (
        db.query(UserRoleAssignment)
        .filter(
            UserRoleAssignment.user_id == user_id,
            UserRoleAssignment.role == UserRole.super_admin,
        )
        .first()
    )
    if is_super_admin:
        raise ForbiddenError("Super admin accounts cannot be suspended")

    if profile.status == ProfileStatus.suspended:
        raise ConflictError("User is already suspended")

    profile.status = ProfileStatus.suspended
    db.add(
        AdminAction(
            admin_id=admin_id,
            action_type="user_suspended",
            target_type="user",
            target_id=user_id,
            reason=reason,
        )
    )

    from app.modules.notification import service as notifications
    from app.modules.notification.types import NotificationType

    notifications.notify(
        db,
        user_id,
        NotificationType.USER_SUSPENDED,
        context={"reason": reason},
    )

    db.commit()
    invalidate_owner_stats_cache()


def reactivate_user(
    db: Session,
    *,
    admin_id: uuid.UUID,
    user_id: uuid.UUID,
    reason: str = "",
) -> None:
    profile = (
        db.query(Profile)
        .filter(
            Profile.id == user_id,
            Profile.deleted_at.is_(None),
        )
        .first()
    )
    if not profile:
        raise NotFoundError("User not found")

    if profile.status == ProfileStatus.active:
        raise ConflictError("User is already active")

    profile.status = ProfileStatus.active
    db.add(
        AdminAction(
            admin_id=admin_id,
            action_type="user_reactivated",
            target_type="user",
            target_id=user_id,
            reason=reason,
        )
    )

    from app.modules.notification import service as notifications
    from app.modules.notification.types import NotificationType

    notifications.notify(db, user_id, NotificationType.USER_REACTIVATED)

    db.commit()
    invalidate_owner_stats_cache()


def _get_amenity_or_404(db: Session, amenity_id: uuid.UUID) -> Amenity:
    amenity = db.query(Amenity).filter(Amenity.id == amenity_id).first()
    if not amenity:
        raise NotFoundError("Amenity not found")
    return amenity


def _count_active_venues(db: Session, amenity_id: uuid.UUID) -> int:
    return db.query(VenueAmenity).filter(VenueAmenity.amenity_id == amenity_id).count()


def _amenity_to_dict(amenity: Amenity, active_venue_count: int) -> dict:
    return {
        "id": amenity.id,
        "name": amenity.name,
        "icon": amenity.icon,
        "created_at": amenity.created_at,
        "deleted_at": amenity.deleted_at,
        "active_venue_count": active_venue_count,
    }


def list_amenities(db: Session, *, include_deleted: bool = False) -> dict:
    query = db.query(Amenity)
    if not include_deleted:
        query = query.filter(Amenity.deleted_at.is_(None))

    amenities = query.order_by(Amenity.name.asc()).all()
    amenity_ids = [a.id for a in amenities]

    count_rows = (
        (
            db.query(VenueAmenity.amenity_id, func.count(VenueAmenity.venue_id).label("cnt"))
            .filter(VenueAmenity.amenity_id.in_(amenity_ids))
            .group_by(VenueAmenity.amenity_id)
            .all()
        )
        if amenity_ids
        else []
    )
    counts = {row.amenity_id: row.cnt for row in count_rows}

    items = [_amenity_to_dict(a, counts.get(a.id, 0)) for a in amenities]
    return {"items": items, "total": len(items)}


def create_amenity(
    db: Session,
    *,
    admin_id: uuid.UUID,
    name: str,
    icon: str | None,
) -> dict:
    normalized = name.strip()
    # Serialize concurrent creates for the same name — prevents two transactions
    # from both reading "not found" and both inserting, which DB constraints alone can't stop.
    db.execute(text("SELECT pg_advisory_xact_lock(hashtext(:n))"), {"n": normalized.lower()})
    amenity = Amenity(name=normalized, icon=icon)
    db.add(amenity)
    try:
        db.flush()
    except IntegrityError:
        db.rollback()
        raise ConflictError("An amenity with this name already exists")

    db.add(
        AdminAction(
            admin_id=admin_id,
            action_type="amenity_created",
            target_type="amenity",
            target_id=amenity.id,
        )
    )
    db.commit()
    db.refresh(amenity)
    _invalidate_amenities_cache()
    return _amenity_to_dict(amenity, 0)


def update_amenity(
    db: Session,
    *,
    admin_id: uuid.UUID,
    amenity_id: uuid.UUID,
    body: AmenityUpdateRequest,
) -> dict:
    amenity = _get_amenity_or_404(db, amenity_id)
    if amenity.deleted_at is not None:
        raise ConflictError("Cannot update a deleted amenity")

    if "name" in body.model_fields_set and body.name is not None:
        normalized = body.name.strip()
        db.execute(text("SELECT pg_advisory_xact_lock(hashtext(:n))"), {"n": normalized.lower()})
        amenity.name = normalized
    if "icon" in body.model_fields_set:
        amenity.icon = body.icon

    try:
        db.flush()
    except IntegrityError:
        db.rollback()
        raise ConflictError("An amenity with this name already exists")

    db.add(
        AdminAction(
            admin_id=admin_id,
            action_type="amenity_updated",
            target_type="amenity",
            target_id=amenity.id,
        )
    )
    db.commit()
    db.refresh(amenity)
    _invalidate_amenities_cache()
    active_count = _count_active_venues(db, amenity.id)
    return _amenity_to_dict(amenity, active_count)


def delete_amenity(
    db: Session,
    *,
    admin_id: uuid.UUID,
    amenity_id: uuid.UUID,
) -> dict:
    amenity = _get_amenity_or_404(db, amenity_id)
    if amenity.deleted_at is not None:
        raise ConflictError("Amenity is already deleted")

    active_count = _count_active_venues(db, amenity.id)
    amenity.deleted_at = datetime.now(UTC)

    db.add(
        AdminAction(
            admin_id=admin_id,
            action_type="amenity_deleted",
            target_type="amenity",
            target_id=amenity.id,
        )
    )
    db.commit()
    _invalidate_amenities_cache()
    return {"deleted": True, "active_venue_count": active_count}


def _get_category_or_404(db: Session, category_id: uuid.UUID) -> VenueCategory:
    cat = db.query(VenueCategory).filter(VenueCategory.id == category_id).first()
    if not cat:
        raise NotFoundError("Category not found")
    return cat


def _count_category_venues(db: Session, category_id: uuid.UUID) -> int:
    return (
        db.query(Venue).filter(Venue.category_id == category_id, Venue.deleted_at.is_(None)).count()
    )


def _category_to_dict(cat: VenueCategory, venue_count: int) -> dict:
    return {
        "id": cat.id,
        "slug": cat.slug,
        "label": cat.label,
        "icon": cat.icon,
        "banner_image": cat.banner_image,
        "is_active": cat.is_active,
        "sort_order": cat.sort_order,
        "created_at": cat.created_at,
        "deleted_at": cat.deleted_at,
        "venue_count": venue_count,
    }


def list_categories(db: Session, *, include_deleted: bool = False) -> dict:
    query = db.query(VenueCategory)
    if not include_deleted:
        query = query.filter(VenueCategory.deleted_at.is_(None))
    cats = query.order_by(VenueCategory.sort_order.asc(), VenueCategory.label.asc()).all()

    cat_ids = [c.id for c in cats]
    count_rows = (
        (
            db.query(Venue.category_id, func.count(Venue.id).label("cnt"))
            .filter(Venue.category_id.in_(cat_ids), Venue.deleted_at.is_(None))
            .group_by(Venue.category_id)
            .all()
        )
        if cat_ids
        else []
    )
    counts = {row.category_id: row.cnt for row in count_rows}

    items = [_category_to_dict(c, counts.get(c.id, 0)) for c in cats]
    return {"items": items, "total": len(items)}


def create_category(
    db: Session,
    *,
    admin_id: uuid.UUID,
    slug: str,
    label: str,
    icon: str | None,
    sort_order: int,
) -> dict:
    normalized_slug = slug.strip().lower()
    db.execute(text("SELECT pg_advisory_xact_lock(hashtext(:s))"), {"s": normalized_slug})
    cat = VenueCategory(slug=normalized_slug, label=label.strip(), icon=icon, sort_order=sort_order)
    db.add(cat)
    try:
        db.flush()
    except IntegrityError:
        db.rollback()
        raise ConflictError("A category with this slug already exists")

    db.add(
        AdminAction(
            admin_id=admin_id,
            action_type="category_created",
            target_type="category",
            target_id=cat.id,
        )
    )
    db.commit()
    db.refresh(cat)
    _invalidate_categories_cache()
    return _category_to_dict(cat, 0)


def update_category(
    db: Session,
    *,
    admin_id: uuid.UUID,
    category_id: uuid.UUID,
    body: CategoryUpdateRequest,
) -> dict:
    cat = _get_category_or_404(db, category_id)
    if cat.deleted_at is not None:
        raise ConflictError("Cannot update a deleted category")

    if "label" in body.model_fields_set and body.label is not None:
        cat.label = body.label.strip()
    if "icon" in body.model_fields_set:
        cat.icon = body.icon
    if "sort_order" in body.model_fields_set and body.sort_order is not None:
        cat.sort_order = body.sort_order
    if "is_active" in body.model_fields_set and body.is_active is not None:
        cat.is_active = body.is_active

    db.add(
        AdminAction(
            admin_id=admin_id,
            action_type="category_updated",
            target_type="category",
            target_id=cat.id,
        )
    )
    db.commit()
    db.refresh(cat)
    _invalidate_categories_cache()
    venue_count = _count_category_venues(db, cat.id)
    return _category_to_dict(cat, venue_count)


def upload_category_banner(
    db: Session,
    *,
    admin_id: uuid.UUID,
    category_id: uuid.UUID,
    file_bytes: bytes,
) -> dict:
    cat = _get_category_or_404(db, category_id)
    if cat.deleted_at is not None:
        raise ConflictError("Cannot update a deleted category")

    if cat.banner_image:
        try:
            delete_image_from_cloudinary(cat.banner_image)
        except Exception:
            pass

    banner_url = upload_image_to_cloudinary(file_bytes, folder=f"categories/{category_id}")
    cat.banner_image = banner_url

    db.add(
        AdminAction(
            admin_id=admin_id,
            action_type="category_banner_updated",
            target_type="category",
            target_id=cat.id,
        )
    )
    db.commit()
    db.refresh(cat)
    _invalidate_categories_cache()
    return {"banner_image": cat.banner_image}


def delete_category_banner(
    db: Session,
    *,
    admin_id: uuid.UUID,
    category_id: uuid.UUID,
) -> dict:
    cat = _get_category_or_404(db, category_id)
    if cat.banner_image:
        try:
            delete_image_from_cloudinary(cat.banner_image)
        except Exception:
            pass
        cat.banner_image = None
        db.add(
            AdminAction(
                admin_id=admin_id,
                action_type="category_banner_deleted",
                target_type="category",
                target_id=cat.id,
            )
        )
        db.commit()
        _invalidate_categories_cache()
    return {"banner_image": None}


def delete_category(
    db: Session,
    *,
    admin_id: uuid.UUID,
    category_id: uuid.UUID,
) -> dict:
    cat = _get_category_or_404(db, category_id)
    if cat.deleted_at is not None:
        raise ConflictError("Category is already deleted")

    venue_count = _count_category_venues(db, cat.id)
    cat.deleted_at = datetime.now(UTC)
    cat.is_active = False

    db.add(
        AdminAction(
            admin_id=admin_id,
            action_type="category_deleted",
            target_type="category",
            target_id=cat.id,
        )
    )
    db.commit()
    _invalidate_categories_cache()
    return {"deleted": True, "venue_count": venue_count}


def list_actions(
    db: Session,
    *,
    page: int = 1,
    page_size: int = 20,
    target_type: str | None = None,
    action_type: str | None = None,
    # Legacy — used by dashboard summary (returns at most `limit` items, page 1)
    limit: int | None = None,
) -> dict:
    query = db.query(AdminAction)
    if target_type:
        query = query.filter(AdminAction.target_type == target_type)
    if action_type:
        query = query.filter(AdminAction.action_type == action_type)

    total = query.with_entities(func.count(AdminAction.id)).scalar()

    effective_page_size = limit if limit is not None else page_size
    offset = 0 if limit is not None else (page - 1) * page_size

    items = (
        query.order_by(AdminAction.created_at.desc())
        .offset(offset)
        .limit(effective_page_size)
        .all()
    )

    # Batch-enrich admin names
    admin_ids = list({a.admin_id for a in items})
    admin_profiles = db.query(Profile).filter(Profile.id.in_(admin_ids)).all()
    admin_name_by_id = {p.id: p.full_name for p in admin_profiles}

    # Batch-resolve target names grouped by target_type
    target_name_by_id: dict[uuid.UUID, str] = {}

    user_ids = [a.target_id for a in items if a.target_type == "user"]
    if user_ids:
        rows = db.query(Profile.id, Profile.full_name).filter(Profile.id.in_(user_ids)).all()
        target_name_by_id.update({r.id: r.full_name for r in rows if r.full_name})

    venue_ids = [a.target_id for a in items if a.target_type == "venue"]
    if venue_ids:
        rows = db.query(Venue.id, Venue.name).filter(Venue.id.in_(venue_ids)).all()
        target_name_by_id.update({r.id: r.name for r in rows})

    amenity_ids = [a.target_id for a in items if a.target_type == "amenity"]
    if amenity_ids:
        rows = db.query(Amenity.id, Amenity.name).filter(Amenity.id.in_(amenity_ids)).all()
        target_name_by_id.update({r.id: r.name for r in rows})

    enriched = [
        {
            "id": a.id,
            "admin_id": a.admin_id,
            "admin_name": admin_name_by_id.get(a.admin_id),
            "action_type": a.action_type,
            "target_type": a.target_type,
            "target_id": a.target_id,
            "target_name": target_name_by_id.get(a.target_id),
            "reason": a.reason,
            "created_at": a.created_at,
        }
        for a in items
    ]

    return {
        "items": enriched,
        "total": total,
        "page": 1 if limit is not None else page,
        "page_size": effective_page_size,
        "total_pages": math.ceil(total / effective_page_size) if total else 1,
    }


def seed_super_admin() -> None:
    """
    Idempotent. Creates the super admin user in Supabase on first run.
    Skipped entirely if SUPER_ADMIN_EMAIL or SUPER_ADMIN_PASSWORD
    are not set in the environment.
    """
    email = settings.super_admin_email
    password = settings.super_admin_password
    name = settings.super_admin_name

    if not email or not password:
        logger.info("SUPER_ADMIN_EMAIL/PASSWORD not set, skipping super admin seed")
        return

    db: Session = SessionLocal()
    try:
        _seed(db, email, password, name)
    finally:
        db.close()


def _seed(db: Session, email: str, password: str, name: str) -> None:
    auth_user_id = _resolve_supabase_user(email, password, name)

    profile = db.query(Profile).filter(Profile.id == auth_user_id).first()
    if not profile:
        profile = Profile(
            id=auth_user_id,
            full_name=name or "Super Admin",
            status=ProfileStatus.active,
        )
        db.add(profile)
        db.flush()
        logger.info("Created profile for super admin %s", email)
    elif name and profile.full_name != name:
        profile.full_name = name
        db.flush()
        logger.info("Updated full_name for super admin %s", email)

    role_exists = (
        db.query(UserRoleAssignment)
        .filter(
            UserRoleAssignment.user_id == auth_user_id,
            UserRoleAssignment.role == UserRole.super_admin,
        )
        .first()
    )

    if not role_exists:
        db.add(UserRoleAssignment(user_id=auth_user_id, role=UserRole.super_admin))
        logger.info("Assigned super_admin role to %s", email)

    db.commit()
    logger.info("Super admin seed complete for %s", email)


def _supabase_admin_request(method: str, path: str, body: dict | None = None) -> dict:
    """Makes a request to the Supabase Auth Admin REST API."""
    url = f"{settings.supabase_url}/auth/v1/admin/{path}"
    data = json.dumps(body).encode() if body else None
    req = urllib.request.Request(
        url,
        data=data,
        method=method,
        headers={
            "Authorization": f"Bearer {settings.supabase_service_role_key}",
            "apikey": settings.supabase_service_role_key,
            "Content-Type": "application/json",
        },
    )
    with urllib.request.urlopen(req, timeout=10) as resp:  # noqa: S310
        return json.loads(resp.read())


def _resolve_supabase_user(email: str, password: str, name: str = "") -> uuid.UUID:
    """
    Returns the UUID of the Supabase auth user, creating them if they
    don't exist. Uses the Admin API so no confirmation email is triggered.
    """
    # List users and search by email
    page = 1
    per_page = 1000
    while True:
        data = _supabase_admin_request("GET", f"users?page={page}&per_page={per_page}")
        users = data.get("users", [])
        for u in users:
            if u.get("email") == email:
                logger.info("Super admin already exists in Supabase: %s", email)
                return uuid.UUID(u["id"])
        if len(users) < per_page:
            break
        page += 1

    # Not found — create via Admin API (email_confirm skips verification email)
    result = _supabase_admin_request(
        "POST",
        "users",
        {
            "email": email,
            "password": password,
            "email_confirm": True,
            "user_metadata": {"full_name": name or "Super Admin"},
        },
    )
    logger.info("Created Supabase auth user for super admin: %s", email)
    return uuid.UUID(result["id"])


# ─── Booking admin service ─────────────────────────────────────────────────────

_CANCELLED_STATUSES = (
    BookingStatus.hold_expired,
    BookingStatus.request_expired,
    BookingStatus.conflict_cancelled,
    BookingStatus.user_cancelled,
    BookingStatus.admin_cancelled,
    BookingStatus.owner_rejected,
    BookingStatus.balance_overdue_cancelled,
)


def get_booking_stats(db: Session) -> dict:
    import json

    from app.core.cache import cache_get, cache_set

    cached = cache_get("admin:stats:bookings")
    if cached is not None:
        return json.loads(cached)

    row = (
        db.query(
            func.count(Booking.id).label("total"),
            func.count(case((Booking.status == BookingStatus.requested, 1))).label("requested"),
            func.count(case((Booking.status == BookingStatus.confirmed, 1))).label("confirmed"),
            func.count(case((Booking.status == BookingStatus.completed, 1))).label("completed"),
            func.count(case((Booking.status.in_(_CANCELLED_STATUSES), 1))).label("cancelled"),
        )
        .filter(Booking.deleted_at.is_(None))
        .one()
    )
    result = {
        "total": row.total,
        "requested": row.requested,
        "confirmed": row.confirmed,
        "completed": row.completed,
        "cancelled": row.cancelled,
    }
    cache_set("admin:stats:bookings", json.dumps(result), _STATS_CACHE_TTL_SECONDS)
    return result


def list_admin_bookings(
    db: Session,
    *,
    status: str | None = None,
    search: str | None = None,
    page: int = 1,
    page_size: int = 25,
) -> dict:
    stats = get_booking_stats(db)

    base = (
        db.query(Booking)
        .join(Venue, Venue.id == Booking.venue_id)
        .join(Profile, Profile.id == Booking.user_id)
        .options(contains_eager(Booking.venue), contains_eager(Booking.user))
        .filter(Booking.deleted_at.is_(None))
    )

    if status:
        if status == "cancelled":
            base = base.filter(Booking.status.in_(_CANCELLED_STATUSES))
        else:
            base = base.filter(Booking.status == BookingStatus(status))

    if search:
        safe = search.strip().replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")
        base = base.filter(Venue.name.ilike(f"%{safe}%") | Profile.full_name.ilike(f"%{safe}%"))

    total = base.count()
    total_pages = max(1, math.ceil(total / page_size))
    rows = (
        base.order_by(Booking.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    slot_map: dict = {}
    owner_map: dict = {}
    if rows:
        booking_ids = [b.id for b in rows]
        slots = db.query(BookingSlot).filter(BookingSlot.booking_id.in_(booking_ids)).all()
        slot_map = {s.booking_id: s for s in slots}

        owner_ids = list({b.venue.owner_id for b in rows})
        owners = db.query(Profile).filter(Profile.id.in_(owner_ids)).all()
        owner_map = {o.id: o for o in owners}

    items: list[dict] = []
    for b in rows:
        slot = slot_map.get(b.id)
        event_date = slot.starts_at.date().isoformat() if slot else ""
        owner = owner_map.get(b.venue.owner_id)
        items.append(
            {
                "id": b.id,
                "venue_id": b.venue_id,
                "venue_name": b.venue.name,
                "customer_name": b.user.full_name,
                "customer_email": b.user.email,
                "customer_phone": b.user.phone,
                "owner_id": b.venue.owner_id,
                "owner_name": owner.full_name if owner else None,
                "owner_email": owner.email if owner else None,
                "owner_phone": owner.phone if owner else None,
                "status": b.status.value,
                "payment_status": b.payment_status.value,
                "event_date": event_date,
                "guest_count": b.guest_count,
                "created_at": b.created_at,
            }
        )

    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
        "stats": stats,
    }


# ─── Deep Research observability ───────────────────────────────────────────────
# Read-only reporting over deep_research.models.DeepResearchQuery. No
# admin_actions audit entries here — nothing mutates state (contrast with
# Phase 3's lead/reservation admin endpoints, which will need audit logging).


def list_deep_research_queries(
    db: Session, page: int, page_size: int, search: str | None = None
) -> DeepResearchQueryListResponse:
    q = db.query(DeepResearchQuery)
    if search:
        q = q.filter(DeepResearchQuery.query_text.ilike(f"%{search}%"))

    total = q.count()
    rows = (
        q.order_by(DeepResearchQuery.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    return DeepResearchQueryListResponse(
        items=[DeepResearchQuerySummary.model_validate(r) for r in rows],
        total=total,
        page=page,
        page_size=page_size,
    )


def get_deep_research_query(db: Session, query_id: uuid.UUID) -> DeepResearchQueryDetail:
    row = db.query(DeepResearchQuery).filter(DeepResearchQuery.id == query_id).first()
    if not row:
        raise NotFoundError("Deep research query not found")
    return DeepResearchQueryDetail.model_validate(row)


def get_deep_research_stats(db: Session, days: int = 30) -> DeepResearchStatsResponse:
    now = datetime.now(UTC)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    period_start = today_start - timedelta(days=days - 1)

    rows = (
        db.query(
            func.date_trunc("day", DeepResearchQuery.created_at).label("bucket"),
            func.count(DeepResearchQuery.id).label("cnt"),
            func.avg(DeepResearchQuery.avg_match_score).label("avg_score"),
        )
        .filter(DeepResearchQuery.created_at >= period_start)
        .group_by("bucket")
        .all()
    )
    by_bucket = {r.bucket.replace(tzinfo=UTC): r for r in rows}

    labels: list[str] = []
    counts: list[int] = []
    avg_scores: list[float | None] = []
    for i in range(days - 1, -1, -1):
        day = today_start - timedelta(days=i)
        row = by_bucket.get(day)
        labels.append(f"{day.day} {day.strftime('%b')}")
        counts.append(row.cnt if row else 0)
        avg_scores.append(float(row.avg_score) if row and row.avg_score is not None else None)

    total_queries = db.query(func.count(DeepResearchQuery.id)).scalar() or 0
    avg_result_count = db.query(func.avg(DeepResearchQuery.result_count)).scalar()
    avg_match_score_overall = db.query(func.avg(DeepResearchQuery.avg_match_score)).scalar()

    return DeepResearchStatsResponse(
        labels=labels,
        query_counts=counts,
        avg_match_scores=avg_scores,
        total_queries=total_queries,
        avg_result_count=float(avg_result_count) if avg_result_count is not None else 0.0,
        avg_match_score_overall=(
            float(avg_match_score_overall) if avg_match_score_overall is not None else None
        ),
    )
