"""
Owner dashboard service.

Returns a single aggregated response containing:
  - KPI counts (pending requests, active bookings, completed, cancelled)
  - Financial stats (reuses ledger logic from payment service)
  - Monthly performance chart data (last 6 months)
  - Upcoming confirmed events (next 5)
"""

from datetime import UTC, datetime, timedelta
from uuid import UUID

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.modules.booking.models import Booking, BookingSlot, BookingStatus
from app.modules.owner.schemas import (
    ChartDataPoint,
    DashboardStats,
    UpcomingEventOut,
)
from app.modules.payment.models import LedgerEntry
from app.modules.venue.models import Venue, VenueStatus

# Statuses considered "cancelled/terminal non-success"
CANCELLED_STATUSES = [
    BookingStatus.conflict_cancelled,
    BookingStatus.user_cancelled,
    BookingStatus.admin_cancelled,
    BookingStatus.owner_rejected,
    BookingStatus.balance_overdue_cancelled,
    BookingStatus.hold_expired,
    BookingStatus.request_expired,
]


def get_dashboard_stats(db: Session, owner_id: UUID) -> DashboardStats:
    # ------------------------------------------------------------------ #
    # 1. Booking counts — one query, grouped by status
    # ------------------------------------------------------------------ #
    active_venues = (
        db.query(func.count(Venue.id))
        .filter(
            Venue.owner_id == owner_id,
            Venue.is_active,
            Venue.status == VenueStatus.approved,
            Venue.deleted_at.is_(None),
        )
        .scalar()
        or 0
    )

    status_counts: dict[str, int] = {}

    rows = (
        db.query(Booking.status, func.count(Booking.id).label("cnt"))
        .join(Venue, Booking.venue_id == Venue.id)
        .filter(
            Venue.owner_id == owner_id,
            Booking.deleted_at.is_(None),
        )
        .group_by(Booking.status)
        .all()
    )
    for status_val, cnt in rows:
        status_counts[status_val] = cnt

    pending_requests = status_counts.get(BookingStatus.requested, 0)
    active_bookings = status_counts.get(BookingStatus.confirmed, 0)
    completed_bookings = status_counts.get(BookingStatus.completed, 0)
    cancelled_bookings = sum(status_counts.get(s, 0) for s in CANCELLED_STATUSES)

    # ------------------------------------------------------------------ #
    # 2. Financial stats — from ledger entries
    # ------------------------------------------------------------------ #
    ledger_rows = (
        db.query(
            LedgerEntry.entry_type,
            LedgerEntry.direction,
            func.sum(LedgerEntry.amount_paise).label("total"),
        )
        .filter(LedgerEntry.owner_id == owner_id)
        .group_by(LedgerEntry.entry_type, LedgerEntry.direction)
        .all()
    )

    gross_volume = 0
    platform_fees = 0
    refunds_issued = 0
    payouts_completed = 0

    for entry_type, direction, total in ledger_rows:
        val = int(total or 0)
        if entry_type == "charge" and direction == "credit":
            gross_volume += val
        elif entry_type == "platform_fee" and direction == "debit":
            platform_fees += val
        elif entry_type == "platform_fee_reversal" and direction == "credit":
            platform_fees -= val  # fee was returned to owner on cancellation
        elif entry_type == "refund" and direction == "debit":
            refunds_issued += val
        elif entry_type == "payout" and direction == "debit":
            payouts_completed += val

    net_revenue = gross_volume - platform_fees - refunds_issued
    available_balance = net_revenue - payouts_completed

    stats = DashboardStats(
        active_venues=active_venues,
        pending_requests=pending_requests,
        active_bookings=active_bookings,
        completed_bookings=completed_bookings,
        cancelled_bookings=cancelled_bookings,
        gross_volume_paise=gross_volume,
        net_revenue_paise=net_revenue,
        available_balance_paise=available_balance,
        platform_fees_paise=platform_fees,
        refunds_issued_paise=refunds_issued,
        payouts_completed_paise=payouts_completed,
    )

    return stats


def get_dashboard_chart(
    db: Session, owner_id: UUID, time_range: str = "6M"
) -> list[ChartDataPoint]:
    # ------------------------------------------------------------------ #
    # Chart data — dynamic time range
    # ------------------------------------------------------------------ #
    now = datetime.now(UTC)
    is_daily = time_range in ("7D", "30D")

    num_buckets = 6
    if time_range == "7D":
        num_buckets = 7
    elif time_range == "30D":
        num_buckets = 30
    elif time_range == "3M":
        num_buckets = 3
    elif time_range == "12M":
        num_buckets = 12

    buckets: list[tuple[int, int, int]] = []

    if is_daily:
        for delta in range(num_buckets - 1, -1, -1):
            t = now - timedelta(days=delta)
            buckets.append((t.year, t.month, t.day))
        start_of_window = datetime(buckets[0][0], buckets[0][1], buckets[0][2], tzinfo=UTC)
    else:
        for delta in range(num_buckets - 1, -1, -1):
            y = now.year
            m = now.month - delta
            while m < 1:
                m += 12
                y -= 1
            buckets.append((y, m, 1))
        start_of_window = datetime(buckets[0][0], buckets[0][1], 1, tzinfo=UTC)

    if is_daily:
        group_fields = [
            func.extract("year", Booking.created_at).label("yr"),
            func.extract("month", Booking.created_at).label("mo"),
            func.extract("day", Booking.created_at).label("day"),
        ]
    else:
        group_fields = [
            func.extract("year", Booking.created_at).label("yr"),
            func.extract("month", Booking.created_at).label("mo"),
        ]

    chart_bookings = (
        db.query(Booking.status, func.count(Booking.id).label("cnt"), *group_fields)
        .join(Venue, Booking.venue_id == Venue.id)
        .filter(
            Venue.owner_id == owner_id,
            Booking.deleted_at.is_(None),
            Booking.created_at >= start_of_window,
        )
        .group_by(Booking.status, *group_fields)
        .all()
    )

    bucket_map: dict[tuple[int, int, int], dict[str, int]] = {
        b: {"enquiries": 0, "completed": 0, "cancelled": 0} for b in buckets
    }

    for row in chart_bookings:
        status_val = row.status
        cnt = row.cnt
        yr = int(row.yr)
        mo = int(row.mo)
        day = int(row.day) if is_daily else 1

        key = (yr, mo, day)
        if key not in bucket_map:
            continue

        # Every booking created is considered an enquiry, regardless of its final status
        bucket_map[key]["enquiries"] += cnt

        if status_val == BookingStatus.completed:
            bucket_map[key]["completed"] += cnt
        elif status_val in CANCELLED_STATUSES:
            bucket_map[key]["cancelled"] += cnt

    chart_data = []
    for b in buckets:
        dt = datetime(b[0], b[1], b[2])
        month_label = dt.strftime("%d %b") if is_daily else dt.strftime("%b %y")

        chart_data.append(
            ChartDataPoint(
                month=month_label,
                enquiries=bucket_map[b]["enquiries"],
                completed=bucket_map[b]["completed"],
                cancelled=bucket_map[b]["cancelled"],
            )
        )

    return chart_data


def get_upcoming_events(db: Session, owner_id: UUID) -> list[UpcomingEventOut]:
    # ------------------------------------------------------------------ #
    # Upcoming confirmed events — next 5
    # ------------------------------------------------------------------ #
    now = datetime.now(UTC)
    upcoming_rows = (
        db.query(Booking, BookingSlot, Venue)
        .join(BookingSlot, BookingSlot.booking_id == Booking.id)
        .join(Venue, Booking.venue_id == Venue.id)
        .filter(
            Venue.owner_id == owner_id,
            Booking.deleted_at.is_(None),
            Booking.status == BookingStatus.confirmed,
            BookingSlot.starts_at > now,
        )
        .order_by(BookingSlot.starts_at.asc())
        .limit(5)
        .all()
    )

    upcoming_events = [
        UpcomingEventOut(
            booking_id=str(booking.id),
            event_type=booking.event_type,
            venue_name=venue.name,
            status=booking.status,
            starts_at=slot.starts_at.isoformat() if slot.starts_at else None,
            guest_count=booking.guest_count,
        )
        for booking, slot, venue in upcoming_rows
    ]

    return upcoming_events
