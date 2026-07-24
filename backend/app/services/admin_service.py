from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status
from sqlalchemy import func, or_
from sqlalchemy.orm import Session, joinedload

from app.models.booking import Booking
from app.models.payment import Payment
from app.models.user import User
from app.models.venue import Venue
from app.models.venue_owner import VenueOwner
from app.models.venue_type import VenueType
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
    venue_type = getattr(venue, "venue_type", None)
    return {
        "id": venue.id,
        "owner_id": venue.owner_id,
        "owner_name": owner_name,
        "name": venue.name,
        "location": venue.location,
        "price_per_day": float(venue.price_per_day),
        "venue_type_id": venue.venue_type_id,
        "venue_type_name": venue_type.name if venue_type else None,
        "capacity": venue.capacity,
        "image_url": venue.image_url,
        "google_maps_url": venue.google_maps_url,
        "description": venue.description,
        "approval_status": venue.approval_status,
        "rejection_reason": venue.rejection_reason,
        "is_active": venue.is_active,
        "created_at": venue.created_at,
        "updated_at": venue.updated_at,
    }


def _user_to_admin_out(user: User) -> dict:
    profile = user.venue_owner_profile
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "phone_number": user.phone_number,
        "role": user.role,
        "is_active": user.is_active,
        "created_at": user.created_at,
        "is_venue_owner": profile is not None,
        "business_name": profile.business_name if profile else None,
        "business_address": profile.business_address if profile else None,
        "business_type": profile.business_type if profile else None,
        "business_phone": profile.business_phone if profile else None,
        "business_email": profile.business_email if profile else None,
        "gst_number": profile.gst_number if profile else None,
    }


def _normalize_owner_role(role: str | None) -> str | None:
    if role is None:
        return None
    return "owner" if role == "host" else role


def _ensure_owner_profile(
    db: Session,
    user: User,
    *,
    business_name: str | None = None,
    business_address: str | None = None,
    business_type: str | None = None,
    business_phone: str | None = None,
    business_email: str | None = None,
    gst_number: str | None = None,
) -> VenueOwner:
    profile = user.venue_owner_profile
    if profile is None:
        profile = VenueOwner(
            user_id=user.id,
            business_name=(business_name or user.name or "Business").strip(),
            business_address=(business_address or "Address pending").strip(),
            business_type=business_type,
            contact_person=user.name,
            business_phone=business_phone or user.phone_number,
            business_email=business_email or user.email,
            gst_number=gst_number,
        )
        db.add(profile)
    else:
        if business_name is not None:
            profile.business_name = business_name.strip() or profile.business_name
        if business_address is not None:
            profile.business_address = business_address.strip() or profile.business_address
        if business_type is not None:
            profile.business_type = business_type
        if business_phone is not None:
            profile.business_phone = business_phone
        if business_email is not None:
            profile.business_email = business_email
        if gst_number is not None:
            profile.gst_number = gst_number
    return profile


def _get_venue_or_404(db: Session, venue_id: int) -> Venue:
    venue = (
        db.query(Venue)
        .options(joinedload(Venue.venue_type))
        .filter(Venue.id == venue_id)
        .first()
    )
    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")
    return venue


def _get_user_or_404(db: Session, user_id: int) -> User:
    user = (
        db.query(User)
        .options(joinedload(User.venue_owner_profile))
        .filter(User.id == user_id)
        .first()
    )
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


def _pct(value: int, total: int) -> int:
    if total <= 0:
        return 0
    return round((value / total) * 100)



def get_dashboard_stats(db: Session) -> dict:
    owner_user_ids = db.query(VenueOwner.user_id)
    total_users = (
        db.query(User)
        .filter(User.role == "user", ~User.id.in_(owner_user_ids))
        .count()
    )
    total_owners = (
        db.query(User)
        .outerjoin(VenueOwner)
        .filter(or_(User.role.in_(["owner", "host"]), VenueOwner.id.isnot(None)))
        .distinct()
        .count()
    )
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
    results = []
    for venue, owner_name in rows:
        if venue.venue_type_id and venue.venue_type is None:
            db.refresh(venue, attribute_names=["venue_type"])
        results.append(_venue_to_admin_out(venue, owner_name))
    return results


def approve_venue(db: Session, venue_id: int) -> dict:
    venue = _get_venue_or_404(db, venue_id)
    venue.approval_status = "approved"
    venue.rejection_reason = None
    venue.is_active = True
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
    results = []
    for venue, owner_name in rows:
        if venue.venue_type_id:
            _ = venue.venue_type
        results.append(_venue_to_admin_out(venue, owner_name))
    return results


def create_venue_admin(db: Session, data: VenueAdminCreate) -> dict:
    owner = _get_user_or_404(db, data.owner_id)
    if owner.role not in ("owner", "host") and owner.venue_owner_profile is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Owner must be a host or owner account",
        )
    venue_type = db.query(VenueType).filter(VenueType.id == data.venue_type_id).first()
    if not venue_type:
        raise HTTPException(status_code=400, detail="Invalid venue type")

    venue = Venue(
        owner_id=data.owner_id,
        name=data.name,
        location=data.location,
        price_per_day=data.price_per_day,
        venue_type_id=data.venue_type_id,
        capacity=data.capacity,
        image_url=data.image_url,
        google_maps_url=data.google_maps_url,
        description=data.description,
        approval_status=data.approval_status,
        is_active=True,
    )
    db.add(venue)
    db.commit()
    venue = _get_venue_or_404(db, venue.id)
    return _venue_to_admin_out(venue, owner.name)


def get_venue_admin(db: Session, venue_id: int) -> dict:
    venue = _get_venue_or_404(db, venue_id)
    owner = db.query(User).filter(User.id == venue.owner_id).first()
    return _venue_to_admin_out(venue, owner.name if owner else None)


def update_venue_admin(db: Session, venue_id: int, data: VenueAdminUpdate) -> dict:
    venue = _get_venue_or_404(db, venue_id)
    venue.name = data.name
    venue.location = data.location
    venue.price_per_day = data.price_per_day

    if data.venue_type_id is not None:
        venue_type = db.query(VenueType).filter(VenueType.id == data.venue_type_id).first()
        if not venue_type:
            raise HTTPException(status_code=400, detail="Invalid venue type")
        venue.venue_type_id = data.venue_type_id

    if data.owner_id is not None and data.owner_id != venue.owner_id:
        owner = _get_user_or_404(db, data.owner_id)
        if owner.role not in ("owner", "host") and owner.venue_owner_profile is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Owner must be a host or owner account",
            )
        venue.owner_id = data.owner_id

    if data.capacity is not None:
        venue.capacity = data.capacity
    if data.image_url is not None:
        venue.image_url = data.image_url or None
    if data.google_maps_url is not None:
        venue.google_maps_url = data.google_maps_url or None
    if data.description is not None:
        venue.description = data.description
    if data.approval_status is not None:
        venue.approval_status = data.approval_status
    if data.is_active is not None:
        venue.is_active = data.is_active

    venue.updated_at = datetime.now(timezone.utc)
    db.commit()
    venue = _get_venue_or_404(db, venue.id)
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
) -> list[dict]:
    query = db.query(User).options(joinedload(User.venue_owner_profile))
    if role:
        if role in ("host", "owner"):
            query = query.outerjoin(VenueOwner).filter(
                or_(User.role.in_(["host", "owner"]), VenueOwner.id.isnot(None))
            )
        else:
            query = query.filter(User.role == role)
    if is_active is not None:
        query = query.filter(User.is_active == is_active)
    users = query.order_by(User.created_at.desc()).offset(skip).limit(limit).all()
    return [_user_to_admin_out(user) for user in users]


def get_user_admin(db: Session, user_id: int) -> dict:
    return _user_to_admin_out(_get_user_or_404(db, user_id))


def create_user_admin(db: Session, data: UserAdminCreate) -> dict:
    email = str(data.email).lower().strip()
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered",
        )
    role = _normalize_owner_role(data.role)
    user = User(
        name=data.name,
        email=email,
        phone_number=data.phone_number,
        hashed_password=hash_password(data.password),
        auth_provider="email",
        role=role,
        is_active=True,
    )
    db.add(user)
    db.flush()

    if role == "owner":
        _ensure_owner_profile(
            db,
            user,
            business_name=data.business_name,
            business_address=data.business_address,
            business_type=data.business_type,
            business_phone=data.business_phone,
            business_email=data.business_email,
            gst_number=data.gst_number,
        )

    db.commit()
    return _user_to_admin_out(_get_user_or_404(db, user.id))


def update_user_admin(db: Session, user_id: int, data: UserAdminUpdate) -> dict:
    user = _get_user_or_404(db, user_id)
    if user.role == "admin":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot modify admin account",
        )
    if data.email and str(data.email).lower().strip() != (user.email or "").lower():
        normalized = str(data.email).lower().strip()
        existing = db.query(User).filter(User.email == normalized).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email is already registered",
            )
        user.email = normalized
    if data.name is not None:
        user.name = data.name
    if data.phone_number is not None:
        user.phone_number = data.phone_number

    role = _normalize_owner_role(data.role) if data.role is not None else None
    if role is not None:
        user.role = role

    if data.password:
        user.hashed_password = hash_password(data.password)
    if data.is_active is not None:
        user.is_active = data.is_active

    effective_role = role if role is not None else user.role
    if effective_role == "owner" or user.venue_owner_profile is not None:
        if effective_role == "owner":
            _ensure_owner_profile(
                db,
                user,
                business_name=data.business_name,
                business_address=data.business_address,
                business_type=data.business_type,
                business_phone=data.business_phone,
                business_email=data.business_email,
                gst_number=data.gst_number,
            )
        elif user.venue_owner_profile is not None:
            _ensure_owner_profile(
                db,
                user,
                business_name=data.business_name,
                business_address=data.business_address,
                business_type=data.business_type,
                business_phone=data.business_phone,
                business_email=data.business_email,
                gst_number=data.gst_number,
            )

    db.commit()
    return _user_to_admin_out(_get_user_or_404(db, user.id))


def delete_user_admin(db: Session, user_id: int) -> dict:
    user = _get_user_or_404(db, user_id)
    if user.role == "admin":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete admin account",
        )
    user.is_active = False
    db.commit()
    return _user_to_admin_out(_get_user_or_404(db, user.id))


def set_user_active(db: Session, user_id: int, active: bool) -> dict:
    user = _get_user_or_404(db, user_id)
    if user.role == "admin":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot change admin account status",
        )
    user.is_active = active
    db.commit()
    return _user_to_admin_out(_get_user_or_404(db, user.id))
