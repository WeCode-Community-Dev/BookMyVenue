from datetime import UTC, date, datetime, time, timedelta
from zoneinfo import ZoneInfo

import app.models  # noqa: F401 -- register every ORM model so Venue.reviews (a string forward-ref) resolves
import app.modules.venue.service as venue_service
from app.modules.availability.service import (
    compute_effective_range,
    expand_full_day_slot,
    resolve_operating_window,
)
from app.modules.booking.models import BookingType
from app.modules.venue.models import Venue


class _NoRulesQuery:
    def filter(self, *a, **kw):
        return self

    def all(self):
        return []


class _NoRulesDB:
    """Stub `db` for pure pricing-math tests: no venue has pricing rules configured."""

    def query(self, *a, **kw):
        return _NoRulesQuery()


def make_venue(tz="Asia/Kolkata"):
    v = Venue()
    v.timezone = tz
    v.open_time = time(9, 0)
    v.close_time = time(18, 0)
    v.spans_next_day = False
    v.pricing_mode = "hourly"
    v.hourly_rate_paise = 10000
    v.platform_commission_pct = 10.00
    v.advance_pct = 30.00
    return v


def test_resolve_and_expand_basic():
    v = make_venue()
    op = resolve_operating_window(v, date(2026, 6, 7))
    assert op.is_available is True
    assert op.opens_at == time(9, 0)

    starts_utc, ends_utc = expand_full_day_slot(v, date(2026, 6, 7))
    # Asia/Kolkata is UTC+5:30
    assert starts_utc.tzinfo is not None
    assert ends_utc.tzinfo is not None
    assert (ends_utc - starts_utc).seconds == (18 - 9) * 3600


def test_compute_effective_range():
    tz = ZoneInfo("Asia/Kolkata")
    starts = datetime(2026, 6, 7, 9, 0, tzinfo=tz)
    ends = datetime(2026, 6, 7, 18, 0, tzinfo=tz)
    es, ee = compute_effective_range(starts, ends, 15, 20)
    assert es == starts - timedelta(minutes=15)
    assert ee == ends + timedelta(minutes=20)


def test_pricing_quote_hourly(monkeypatch):
    v = make_venue()
    tz = ZoneInfo(v.timezone)
    starts = datetime(2026, 6, 7, 10, 0, tzinfo=tz).astimezone(UTC)
    ends = datetime(2026, 6, 7, 12, 30, tzinfo=tz).astimezone(UTC)

    # Pricing now resolves the venue from the DB; stub that lookup so we can
    # exercise the (DB-free) pricing math on our in-memory venue.
    monkeypatch.setattr(venue_service, "_get_active_venue_or_404", lambda db, venue_id: v)
    q = venue_service.get_pricing_quote(
        db=_NoRulesDB(), venue_id=None, starts_at=starts, ends_at=ends,
        booking_type=BookingType.time_slot,
    )
    # duration 2.5 hours * 10000 paise = 25000 paise
    assert q.quoted_price_paise == 25000
    assert q.advance_due_paise == int(25000 * 0.30)


def test_expand_full_day_handles_dst_forward():
    # London DST starts 2026-03-29 (clocks forward 1 hour) -> day length 23 hours
    v = make_venue(tz="Europe/London")
    v.open_time = time(0, 0)
    v.close_time = time(0, 0)
    v.spans_next_day = True

    starts_utc, ends_utc = expand_full_day_slot(v, date(2026, 3, 29))
    delta = ends_utc - starts_utc
    assert delta.total_seconds() == 23 * 3600


def test_expand_full_day_handles_dst_backward():
    # London DST ends 2026-10-25 (clocks back 1 hour) -> day length 25 hours
    v = make_venue(tz="Europe/London")
    v.open_time = time(0, 0)
    v.close_time = time(0, 0)
    v.spans_next_day = True

    starts_utc, ends_utc = expand_full_day_slot(v, date(2026, 10, 25))
    delta = ends_utc - starts_utc
    assert delta.total_seconds() == 25 * 3600
