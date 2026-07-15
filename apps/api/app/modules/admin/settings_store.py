"""Registry + accessors for admin-editable business settings.

Each setting lives as a row in platform_settings (key/value), read through a
Redis cache-aside layer (same fail-open pattern as
app.modules.deep_research.query_cache — Redis is optional infra, never a hard
dependency). Writes go through set_settings(), which upserts the DB rows and
deletes the affected cache keys in the same call so the next read repopulates
from the DB rather than serving a stale value. There is no cache write-through
on update — only invalidation — so a rolled-back transaction can never leave a
stale-but-wrong value cached from a write that never committed.

Call sites that used to import bare module-level constants (e.g.
USER_PAYMENT_HOLD_HOURS) now call get_setting(db, key) instead, falling back
to the hardcoded default in SETTINGS below if no admin override exists yet.
"""

import json
import logging
from dataclasses import dataclass
from typing import Literal

from sqlalchemy.orm import Session

from app.core import redis as redis_client
from app.modules.admin.models import PlatformSetting

logger = logging.getLogger(__name__)

CACHE_PREFIX = "settings:"
CACHE_TTL_SECONDS = 3600  # backstop only — writes invalidate explicitly


@dataclass(frozen=True)
class SettingSpec:
    default: float | int | bool
    value_type: Literal["int", "float", "bool"]
    min_value: float | None
    max_value: float | None
    label: str
    description: str


# Business-tunable settings surfaced on the admin Settings page. Keys match
# the PlatformSettingsResponse field names 1:1.
SETTINGS: dict[str, SettingSpec] = {
    "default_platform_commission_pct": SettingSpec(
        default=10.00,
        value_type="float",
        min_value=0,
        max_value=100,
        label="Default Platform Commission",
        description=(
            "Applied to every newly created venue. Owners can be given a "
            "different rate per venue afterwards."
        ),
    ),
    "token_payment_hold_hours": SettingSpec(
        default=24,
        value_type="int",
        min_value=1,
        max_value=168,
        label="Token Payment Hold Window",
        description=(
            "Time an accepted booking request has to complete the token "
            "advance before its hold expires."
        ),
    ),
    "instant_booking_payment_timeout_minutes": SettingSpec(
        default=15,
        value_type="int",
        min_value=1,
        max_value=1440,
        label="Instant Booking Payment Timeout",
        description="Time window to complete payment on an instant booking before it is released.",
    ),
    "booking_request_expiry_days": SettingSpec(
        default=7,
        value_type="int",
        min_value=1,
        max_value=90,
        label="Booking Request Expiry",
        description="An unanswered booking request automatically expires after this many days.",
    ),
    "max_deadline_extensions": SettingSpec(
        default=2,
        value_type="int",
        min_value=0,
        max_value=10,
        label="Max Deadline Extensions",
        description="Maximum number of times an owner can extend a booking's payment deadline.",
    ),
    "payment_reminder_hours_before_expiry": SettingSpec(
        default=12,
        value_type="int",
        min_value=1,
        max_value=72,
        label="Payment Reminder Lead Time",
        description=(
            "Users are reminded to pay the token advance this long before their hold expires."
        ),
    ),
    "balance_overdue_action_window_hours": SettingSpec(
        default=48,
        value_type="int",
        min_value=24,
        max_value=72,
        label="Balance Overdue Action Window",
        description=(
            "Default time an owner has to act on an overdue balance before "
            "auto-cancellation. Venues can override this."
        ),
    ),
    "deep_research_rate_limit_per_minute": SettingSpec(
        default=5,
        value_type="int",
        min_value=1,
        max_value=100,
        label="Deep Research Rate Limit (per minute)",
        description="Per-user limit on external venue-discovery searches per minute.",
    ),
    "deep_research_daily_limit": SettingSpec(
        default=4,
        value_type="int",
        min_value=1,
        max_value=1000,
        label="Deep Research Daily Limit",
        description="Per-user daily cap on external venue-discovery searches.",
    ),
}


def _cache_key(key: str) -> str:
    return f"{CACHE_PREFIX}{key}"


def _coerce(value, value_type: str):
    if value_type == "int":
        return int(value)
    if value_type == "float":
        return float(value)
    return bool(value)


def get_setting(db: Session, key: str):
    """Redis -> DB -> hardcoded default, in that order. Fails open to the
    hardcoded default on any Redis or DB error so a settings outage never
    breaks booking/payment flows.
    """
    spec = SETTINGS[key]

    if redis_client.is_configured():
        try:
            raw = redis_client.get_redis().get(_cache_key(key))
            if raw is not None:
                return _coerce(json.loads(raw), spec.value_type)
        except Exception:
            logger.warning(
                "settings_store.get_setting cache read failed for %s", key, exc_info=True
            )

    try:
        row = db.get(PlatformSetting, key)
        value = _coerce(row.value, spec.value_type) if row is not None else spec.default
    except Exception:
        logger.warning("settings_store.get_setting DB read failed for %s", key, exc_info=True)
        return spec.default

    if redis_client.is_configured():
        try:
            redis_client.get_redis().set(_cache_key(key), json.dumps(value), ex=CACHE_TTL_SECONDS)
        except Exception:
            logger.warning(
                "settings_store.get_setting cache write failed for %s", key, exc_info=True
            )

    return value


def get_settings(db: Session) -> dict:
    return {key: get_setting(db, key) for key in SETTINGS}


def validate_settings(updates: dict) -> dict:
    """Validates and coerces a partial update dict. Raises ValueError with a
    human-readable message on the first invalid field.
    """
    coerced: dict = {}
    for key, value in updates.items():
        if key not in SETTINGS:
            raise ValueError(f"Unknown setting: {key}")
        spec = SETTINGS[key]
        try:
            coerced_value = _coerce(value, spec.value_type)
        except (TypeError, ValueError) as exc:
            raise ValueError(f"{key} must be a {spec.value_type}") from exc
        if spec.min_value is not None and coerced_value < spec.min_value:
            raise ValueError(f"{key} must be >= {spec.min_value}")
        if spec.max_value is not None and coerced_value > spec.max_value:
            raise ValueError(f"{key} must be <= {spec.max_value}")
        coerced[key] = coerced_value
    return coerced


def set_settings(db: Session, *, updated_by, updates: dict) -> None:
    """Upserts each key's row and deletes its cache entry. Caller is
    responsible for committing the transaction and for audit logging.
    """
    for key, value in updates.items():
        row = db.get(PlatformSetting, key)
        if row is None:
            db.add(PlatformSetting(key=key, value=value, updated_by=updated_by))
        else:
            row.value = value
            row.updated_by = updated_by

    db.flush()

    if redis_client.is_configured():
        for key in updates:
            try:
                redis_client.get_redis().delete(_cache_key(key))
            except Exception:
                logger.warning(
                    "settings_store.set_settings cache invalidation failed for %s",
                    key,
                    exc_info=True,
                )


def seed_platform_settings(db: Session) -> None:
    """Idempotent. Inserts a row for any key in SETTINGS that doesn't have one
    yet, using its hardcoded default — so platform_settings reflects the
    values the platform is actually running with instead of staying empty
    until an admin first edits something. Never overwrites an existing row
    (an admin override always wins). Run at app startup, same pattern as
    seed_super_admin().
    """
    existing_keys = {row.key for row in db.query(PlatformSetting.key).all()}
    missing = [key for key in SETTINGS if key not in existing_keys]
    if not missing:
        return

    for key in missing:
        db.add(PlatformSetting(key=key, value=SETTINGS[key].default, updated_by=None))
    db.commit()
    logger.info("seed_platform_settings: inserted %d default row(s): %s", len(missing), missing)
