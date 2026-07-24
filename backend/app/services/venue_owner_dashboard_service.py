from datetime import date, datetime, timedelta, timezone
from calendar import monthrange

from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException, status

from app.models.venue import Venue
from app.models.booking import Booking
from app.models.payment import Payment
from app.services.booking_dates import iter_dates_in_range
from app.services.check_in_service import ensure_check_in_token


def _owner_venue_ids(db: Session, owner_id: int) -> list[int]:
    rows = db.query(Venue.id).filter(Venue.owner_id == owner_id).all()
    return [r[0] for r in rows]


def _month_bounds(year: int, month: int) -> tuple[date, date]:
    last_day = monthrange(year, month)[1]
    return date(year, month, 1), date(year, month, last_day)


def get_dashboard_summary(db: Session, owner_id: int) -> dict:
    venue_ids = _owner_venue_ids(db, owner_id)

    total_venues = len(venue_ids)
    active_venues = db.query(Venue).filter(Venue.owner_id == owner_id, Venue.approval_status == "approved").count()
    pending_venues = db.query(Venue).filter(Venue.owner_id == owner_id, Venue.approval_status == "pending").count()

    if not venue_ids:
        return {
            "total_venues": 0, "active_venues": 0, "pending_venues": 0,
            "booking_requests_total": 0, "booking_requests_new": 0, "booking_requests_pending": 0,
            "upcoming_events_count": 0, "next_event_date": None,
            "monthly_revenue": 0.0, "monthly_revenue_change_pct": 0.0,
        }

    now = datetime.now(timezone.utc)
    pending_query = db.query(Booking).filter(Booking.venue_id.in_(venue_ids), Booking.owner_status == "pending")
    booking_requests_total = pending_query.count()
    booking_requests_new = pending_query.filter(Booking.created_at >= now - timedelta(hours=24)).count()
    booking_requests_pending = booking_requests_total - booking_requests_new

    upcoming_query = db.query(Booking).filter(
        Booking.venue_id.in_(venue_ids),
        Booking.owner_status == "accepted",
        Booking.status != "cancelled",
        Booking.check_out_date >= date.today(),
    )
    upcoming_events_count = upcoming_query.count()
    next_event = upcoming_query.order_by(Booking.check_in_date.asc()).first()
    next_event_date = next_event.check_in_date if next_event else None

    today = date.today()
    this_month_start, this_month_end = _month_bounds(today.year, today.month)
    booking_ids_subquery = db.query(Booking.id).filter(Booking.venue_id.in_(venue_ids)).subquery()

    this_month_total = db.query(func.coalesce(func.sum(Payment.amount), 0)).filter(
        Payment.booking_id.in_(booking_ids_subquery), Payment.status == "paid",
        func.date(Payment.paid_at) >= this_month_start, func.date(Payment.paid_at) <= this_month_end,
    ).scalar()

    prev_month_date = this_month_start - timedelta(days=1)
    prev_month_start, prev_month_end = _month_bounds(prev_month_date.year, prev_month_date.month)
    prev_month_total = db.query(func.coalesce(func.sum(Payment.amount), 0)).filter(
        Payment.booking_id.in_(booking_ids_subquery), Payment.status == "paid",
        func.date(Payment.paid_at) >= prev_month_start, func.date(Payment.paid_at) <= prev_month_end,
    ).scalar()

    this_month_total = float(this_month_total or 0)
    prev_month_total = float(prev_month_total or 0)

    if prev_month_total > 0:
        change_pct = round(((this_month_total - prev_month_total) / prev_month_total) * 100, 1)
    else:
        change_pct = 0.0

    return {
        "total_venues": total_venues, "active_venues": active_venues, "pending_venues": pending_venues,
        "booking_requests_total": booking_requests_total, "booking_requests_new": booking_requests_new,
        "booking_requests_pending": booking_requests_pending,
        "upcoming_events_count": upcoming_events_count, "next_event_date": next_event_date,
        "monthly_revenue": this_month_total, "monthly_revenue_change_pct": change_pct,
    }


def get_booking_requests(db: Session, owner_id: int) -> list[dict]:
    venue_ids = _owner_venue_ids(db, owner_id)
    if not venue_ids:
        return []
    rows = (
        db.query(Booking, Venue)
        .join(Venue, Booking.venue_id == Venue.id)
        .filter(Booking.venue_id.in_(venue_ids), Booking.owner_status == "pending")
        .order_by(Booking.created_at.desc())
        .all()
    )
    return [
        {
            "id": booking.id, "venue_name": venue.name, "event_type": booking.event_type,
            "event_date": booking.check_in_date, "event_time": booking.check_in_time,
            "check_out_date": booking.check_out_date, "check_out_time": booking.check_out_time,
            "num_days": booking.num_days,
            "guest_count": booking.guest_count, "price": float(booking.amount),
            "owner_status": booking.owner_status,
        }
        for booking, venue in rows
    ]


def _get_owned_booking_or_404(db: Session, booking_id: int, owner_id: int) -> Booking:
    booking = (
        db.query(Booking)
        .join(Venue, Booking.venue_id == Venue.id)
        .filter(Booking.id == booking_id, Venue.owner_id == owner_id)
        .first()
    )
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking request not found")
    if booking.owner_status != "pending":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"This request was already {booking.owner_status}.")
    return booking


def accept_booking_request(db: Session, booking_id: int, owner_id: int) -> Booking:
    booking = _get_owned_booking_or_404(db, booking_id, owner_id)
    booking.owner_status = "accepted"
    ensure_check_in_token(booking)
    db.commit()
    db.refresh(booking)
    return booking


def verify_check_in(db: Session, owner_id: int, check_in_token: str) -> dict:
    booking = (
        db.query(Booking)
        .options(joinedload(Booking.venue), joinedload(Booking.user))
        .join(Venue, Booking.venue_id == Venue.id)
        .filter(
            Booking.check_in_token == check_in_token,
            Venue.owner_id == owner_id,
        )
        .first()
    )

    if not booking:
        raise HTTPException(status_code=404, detail="Invalid check-in code")

    if booking.owner_status != "accepted":
        raise HTTPException(status_code=400, detail="This booking is not approved")

    if booking.status == "cancelled":
        raise HTTPException(status_code=400, detail="This booking was cancelled")

    if booking.status == "pending_payment":
        raise HTTPException(status_code=400, detail="Payment is not completed yet")

    payment_fields = {
        "amount": float(booking.amount),
        "amount_paid": float(booking.amount_paid or 0),
        "balance_due": float(
            booking.balance_due if booking.balance_due is not None else booking.amount
        ),
        "payment_option": booking.payment_option,
    }

    if booking.checked_in_at:
        return {
            "booking_id": booking.id,
            "venue_name": booking.venue.name,
            "guest_name": booking.user.name or "Guest",
            "guest_count": booking.guest_count,
            "event_type": booking.event_type,
            "check_in_date": booking.check_in_date,
            "checked_in_at": booking.checked_in_at,
            "already_checked_in": True,
            "message": "Guest was already checked in",
            **payment_fields,
        }

    booking.checked_in_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(booking)

    return {
        "booking_id": booking.id,
        "venue_name": booking.venue.name,
        "guest_name": booking.user.name or "Guest",
        "guest_count": booking.guest_count,
        "event_type": booking.event_type,
        "check_in_date": booking.check_in_date,
        "checked_in_at": booking.checked_in_at,
        "already_checked_in": False,
        "message": "Guest checked in successfully",
        **payment_fields,
    }


def reject_booking_request(db: Session, booking_id: int, owner_id: int) -> Booking:
    booking = _get_owned_booking_or_404(db, booking_id, owner_id)
    booking.owner_status = "rejected"
    booking.status = "cancelled"
    booking.cancellation_reason = "Rejected by venue owner"
    booking.cancelled_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(booking)
    return booking


def get_availability_calendar(db: Session, owner_id: int, month: str, venue_id: int | None = None, ) -> dict:
    venue_ids = _owner_venue_ids(db, owner_id)
    if not venue_ids:
        return {"month": month, "days": {}}
    
    if venue_id is not None:
        if venue_id not in venue_ids:
            raise HTTPException(status_code=403, detail="You do not own this venue.")
        venue_ids = [venue_id]

    year, mon = map(int, month.split("-"))
    start, end = _month_bounds(year, mon)

    bookings = db.query(Booking).filter(
        Booking.venue_id.in_(venue_ids),
        Booking.check_in_date <= end,
        Booking.check_out_date >= start,
        Booking.owner_status != "rejected",
        Booking.status != "cancelled",
    ).all()

    days: dict[str, dict] = {}
    for b in bookings:
        status_val = "booked" if b.owner_status == "accepted" else "pending"
        for day in iter_dates_in_range(
            max(b.check_in_date, start),
            min(b.check_out_date, end),
        ):
            key = day.isoformat()
            if key in days and days[key]["status"] == "booked":
                continue
            days[key] = {
                "status": status_val,
                "booking_id": b.id,
                "venue_name": b.venue.name if b.venue else None,
                "event_type": b.event_type,
                "guest_count": b.guest_count,
                "time_slot": b.check_in_time.strftime("%I:%M %p") if b.check_in_time else None,
                "check_out_time": b.check_out_time.strftime("%I:%M %p") if b.check_out_time else None,
                "num_days": b.num_days,
                "amount": float(b.amount),
            }

    return {"month": month, "days": days}


def get_revenue_overview(db: Session, owner_id: int, range_: str = "this_month") -> dict:
    venue_ids = _owner_venue_ids(db, owner_id)
    today = date.today()

    ref = (today.replace(day=1) - timedelta(days=1)) if range_ == "last_month" else today
    start, end = _month_bounds(ref.year, ref.month)

    if not venue_ids:
        return {"range": range_, "total_revenue": 0.0, "change_pct": 0.0, "previous_total": 0.0, "series": []}

    booking_ids_subquery = db.query(Booking.id).filter(Booking.venue_id.in_(venue_ids)).subquery()

    daily_rows = (
        db.query(func.date(Payment.paid_at).label("day"), func.sum(Payment.amount).label("total"))
        .filter(
            Payment.booking_id.in_(booking_ids_subquery), Payment.status == "paid",
            func.date(Payment.paid_at) >= start, func.date(Payment.paid_at) <= end,
        )
        .group_by(func.date(Payment.paid_at))
        .order_by(func.date(Payment.paid_at))
        .all()
    )

    series = [{"date": row.day, "revenue": float(row.total)} for row in daily_rows]
    total_revenue = sum(p["revenue"] for p in series)

    prev_ref = start - timedelta(days=1)
    prev_start, prev_end = _month_bounds(prev_ref.year, prev_ref.month)
    previous_total = db.query(func.coalesce(func.sum(Payment.amount), 0)).filter(
        Payment.booking_id.in_(booking_ids_subquery), Payment.status == "paid",
        func.date(Payment.paid_at) >= prev_start, func.date(Payment.paid_at) <= prev_end,
    ).scalar()
    previous_total = float(previous_total or 0)

    change_pct = (
        round(((total_revenue - previous_total) / previous_total) * 100, 1)
        if previous_total > 0 else 0.0
    )

    return {
        "range": range_, "total_revenue": total_revenue, "change_pct": change_pct,
        "previous_total": previous_total, "series": series,
    }