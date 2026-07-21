from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.booking import Booking
from app.models.payment import Payment
from app.models.user import User
from app.models.venue import Venue
from app.schemas.admin import UserAdminCreate, UserAdminUpdate, VenueAdminCreate, VenueAdminUpdate
from app.services.auth_service import hash_password
from app.services.booking_dates import day_in_booking_range


def _bookings_covering_day(db: Session, day) -> int:
    return (
        db.query(Booking)
        .filter(Booking.check_in_date <= day, Booking.check_out_date >= day)
        .count()
    )


def _venue_to_admin_out(venue: Venue, owner_name: str | None = None) -> dict:
    return {
        "id": venue.id,
        "owner_id": venue.owner_id,
        "owner_name": owner_name,
        "name": venue.name,
        "location": venue.location,
        "price_per_day": float(venue.price_per_day),
        "description": venue.description,
        "approval_status": venue.approval_status,
        "rejection_reason": venue.rejection_reason,
        "is_active": venue.is_active,
        "created_at": venue.created_at,
        "updated_at": venue.updated_at,
    }


def _get_venue_or_404(db: Session, venue_id: int) -> Venue:
    venue = db.query(Venue).filter(Venue.id == venue_id).first()
    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")
    return venue


def _get_user_or_404(db: Session, user_id: int) -> User:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


def _pct(value: int, total: int) -> int:
    if total <= 0:
        return 0
    return round((value / total) * 100)


def get_dashboard_stats(db: Session) -> dict:
    total_users = db.query(User).filter(User.role == "user").count()
    total_owners = db.query(User).filter(User.role.in_(["owner", "host"])).count()
    total_venues = db.query(Venue).count()
    pending_venues = db.query(Venue).filter(Venue.approval_status == "pending").count()
    active_venues = db.query(Venue).filter(Venue.is_active.is_(True)).count()
    total_accounts = db.query(User).filter(User.role != "admin").count()
    active_users = db.query(User).filter(User.is_active.is_(True), User.role != "admin").count()
    total_bookings = db.query(Booking).count()
    booked_count = db.query(Booking).filter(Booking.status == "booked").count()
    total_revenue = (
        db.query(func.coalesce(func.sum(Payment.amount), 0))
        .filter(Payment.status == "paid")
        .scalar()
    )

    venue_breakdown = {
        "approved": db.query(Venue).filter(Venue.approval_status == "approved").count(),
        "pending": pending_venues,
        "rejected": db.query(Venue).filter(Venue.approval_status == "rejected").count(),
    }

    booking_status = {
        "booked": booked_count,
        "pending_payment": db.query(Booking).filter(Booking.status == "pending_payment").count(),
        "cancelled": db.query(Booking).filter(Booking.status == "cancelled").count(),
    }

    today = datetime.now(timezone.utc).date()
    today_bookings = _bookings_covering_day(db, today)
    today_revenue = (
        db.query(func.coalesce(func.sum(Payment.amount), 0))
        .join(Booking, Payment.booking_id == Booking.id)
        .filter(Booking.check_in_date <= today, Booking.check_out_date >= today, Payment.status == "paid")
        .scalar()
    )

    weekly_trend = []
    for i in range(6, -1, -1):
        day = today - timedelta(days=i)
        day_bookings = _bookings_covering_day(db, day)
        day_revenue = (
            db.query(func.coalesce(func.sum(Payment.amount), 0))
            .join(Booking, Payment.booking_id == Booking.id)
            .filter(Booking.check_in_date <= day, Booking.check_out_date >= day, Payment.status == "paid")
            .scalar()
        )
        weekly_trend.append(
            {
                "label": day.strftime("%a"),
                "date": str(day),
                "bookings": day_bookings,
                "revenue": float(day_revenue or 0),
            }
        )

    month_start = today.replace(day=1)
    month_bookings = (
        db.query(Booking)
        .filter(Booking.check_out_date >= month_start, Booking.check_in_date <= today)
        .all()
    )
    counts_by_date: dict[str, int] = {}
    cursor = month_start
    while cursor <= today:
        counts_by_date[str(cursor)] = sum(
            1 for b in month_bookings if day_in_booking_range(b, cursor)
        )
        cursor += timedelta(days=1)
    month_activity = []
    cursor = month_start
    while cursor <= today:
        month_activity.append(
            {"date": str(cursor), "bookings": counts_by_date.get(str(cursor), 0)}
        )
        cursor += timedelta(days=1)

    health_metrics = [
        {
            "label": "Venues live",
            "value": active_venues,
            "total": total_venues,
            "percent": _pct(active_venues, total_venues),
        },
        {
            "label": "Users active",
            "value": active_users,
            "total": total_accounts,
            "percent": _pct(active_users, total_accounts),
        },
        {
            "label": "Bookings confirmed",
            "value": booked_count,
            "total": total_bookings,
            "percent": _pct(booked_count, total_bookings),
        },
    ]

    return {
        "total_users": total_users,
        "total_owners": total_owners,
        "total_venues": total_venues,
        "pending_venues": pending_venues,
        "total_bookings": total_bookings,
        "total_revenue": float(total_revenue or 0),
        "active_users": active_users,
        "active_venues": active_venues,
        "today_bookings": today_bookings,
        "today_revenue": float(today_revenue or 0),
        "weekly_trend": weekly_trend,
        "venue_breakdown": venue_breakdown,
        "booking_status": booking_status,
        "month_activity": month_activity,
        "health_metrics": health_metrics,
    }


def get_pending_venues(db: Session, skip: int = 0, limit: int = 20) -> list[dict]:
    rows = (
        db.query(Venue, User.name)
        .join(User, Venue.owner_id == User.id)
        .filter(Venue.approval_status == "pending")
        .order_by(Venue.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return [_venue_to_admin_out(venue, owner_name) for venue, owner_name in rows]


def approve_venue(db: Session, venue_id: int) -> dict:
    venue = _get_venue_or_404(db, venue_id)
    venue.approval_status = "approved"
    venue.rejection_reason = None
    venue.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(venue)
    owner = db.query(User).filter(User.id == venue.owner_id).first()
    return _venue_to_admin_out(venue, owner.name if owner else None)


def reject_venue(db: Session, venue_id: int, reason: str | None = None) -> dict:
    venue = _get_venue_or_404(db, venue_id)
    venue.approval_status = "rejected"
    venue.rejection_reason = reason
    venue.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(venue)
    owner = db.query(User).filter(User.id == venue.owner_id).first()
    return _venue_to_admin_out(venue, owner.name if owner else None)


def get_all_venues(
    db: Session,
    approval_status: str | None = None,
    skip: int = 0,
    limit: int = 20,
) -> list[dict]:
    query = db.query(Venue, User.name).join(User, Venue.owner_id == User.id)
    if approval_status:
        query = query.filter(Venue.approval_status == approval_status)
    rows = query.order_by(Venue.created_at.desc()).offset(skip).limit(limit).all()
    return [_venue_to_admin_out(venue, owner_name) for venue, owner_name in rows]


def create_venue_admin(db: Session, data: VenueAdminCreate) -> dict:
    owner = _get_user_or_404(db, data.owner_id)
    if owner.role not in ("owner", "host"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Owner must be a host or owner account",
        )
    venue = Venue(
        owner_id=data.owner_id,
        name=data.name,
        location=data.location,
        price_per_day=data.price_per_day,
        description=data.description,
        approval_status=data.approval_status,
        is_active=True,
    )
    db.add(venue)
    db.commit()
    db.refresh(venue)
    return _venue_to_admin_out(venue, owner.name)


def get_venue_admin(db: Session, venue_id: int) -> dict:
    row = (
        db.query(Venue, User.name)
        .join(User, Venue.owner_id == User.id)
        .filter(Venue.id == venue_id)
        .first()
    )
    if not row:
        raise HTTPException(status_code=404, detail="Venue not found")
    venue, owner_name = row
    return _venue_to_admin_out(venue, owner_name)


def update_venue_admin(db: Session, venue_id: int, data: VenueAdminUpdate) -> dict:
    venue = _get_venue_or_404(db, venue_id)
    venue.name = data.name
    venue.location = data.location
    venue.price_per_day = data.price_per_day
    if data.description is not None:
        venue.description = data.description
    if data.approval_status is not None:
        venue.approval_status = data.approval_status
    if data.is_active is not None:
        venue.is_active = data.is_active
    venue.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(venue)
    owner = db.query(User).filter(User.id == venue.owner_id).first()
    return _venue_to_admin_out(venue, owner.name if owner else None)


def block_venue(db: Session, venue_id: int) -> dict:
    venue = _get_venue_or_404(db, venue_id)
    venue.is_active = False
    venue.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(venue)
    owner = db.query(User).filter(User.id == venue.owner_id).first()
    return _venue_to_admin_out(venue, owner.name if owner else None)


def unblock_venue(db: Session, venue_id: int) -> dict:
    venue = _get_venue_or_404(db, venue_id)
    venue.is_active = True
    venue.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(venue)
    owner = db.query(User).filter(User.id == venue.owner_id).first()
    return _venue_to_admin_out(venue, owner.name if owner else None)


def get_all_bookings(db: Session, skip: int = 0, limit: int = 20) -> list[dict]:
    rows = (
        db.query(Booking, User.name, Venue.name)
        .join(User, Booking.user_id == User.id)
        .join(Venue, Booking.venue_id == Venue.id)
        .order_by(Booking.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    results = []
    for booking, user_name, venue_name in rows:
        payment = (
            db.query(Payment)
            .filter(Payment.booking_id == booking.id)
            .order_by(Payment.created_at.desc())
            .first()
        )
        results.append(
            {
                "id": booking.id,
                "user_id": booking.user_id,
                "user_name": user_name,
                "venue_id": booking.venue_id,
                "venue_name": venue_name,
                "booking_date": booking.booking_date,
                "time_slot": booking.time_slot,
                "check_in_date": booking.check_in_date,
                "check_in_time": booking.check_in_time,
                "check_out_date": booking.check_out_date,
                "check_out_time": booking.check_out_time,
                "num_days": booking.num_days,
                "status": booking.status,
                "amount": float(booking.amount),
                "payment_status": payment.status if payment else None,
                "created_at": booking.created_at,
            }
        )
    return results


def get_all_users(
    db: Session,
    role: str | None = None,
    is_active: bool | None = None,
    skip: int = 0,
    limit: int = 20,
) -> list[User]:
    query = db.query(User)
    if role:
        query = query.filter(User.role == role)
    if is_active is not None:
        query = query.filter(User.is_active == is_active)
    return query.order_by(User.created_at.desc()).offset(skip).limit(limit).all()


def get_user_admin(db: Session, user_id: int) -> User:
    return _get_user_or_404(db, user_id)


def create_user_admin(db: Session, data: UserAdminCreate) -> User:
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered",
        )
    user = User(
        name=data.name,
        email=data.email,
        phone_number=data.phone_number,
        hashed_password=hash_password(data.password),
        auth_provider="email",
        role=data.role,
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def update_user_admin(db: Session, user_id: int, data: UserAdminUpdate) -> User:
    user = _get_user_or_404(db, user_id)
    if user.role == "admin":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot modify admin account",
        )
    if data.email and data.email != user.email:
        existing = db.query(User).filter(User.email == data.email).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email is already registered",
            )
        user.email = data.email
    if data.name is not None:
        user.name = data.name
    if data.phone_number is not None:
        user.phone_number = data.phone_number
    if data.role is not None:
        user.role = data.role
    if data.password:
        user.hashed_password = hash_password(data.password)
    if data.is_active is not None:
        user.is_active = data.is_active
    db.commit()
    db.refresh(user)
    return user


def delete_user_admin(db: Session, user_id: int) -> User:
    user = _get_user_or_404(db, user_id)
    if user.role == "admin":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete admin account",
        )
    user.is_active = False
    db.commit()
    db.refresh(user)
    return user


def set_user_active(db: Session, user_id: int, active: bool) -> User:
    user = _get_user_or_404(db, user_id)
    if user.role == "admin":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot change admin account status",
        )
    user.is_active = active
    db.commit()
    db.refresh(user)
    return user
