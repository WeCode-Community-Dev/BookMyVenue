from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
from typing import Optional
from datetime import datetime, timezone, date
from decimal import Decimal

from app.models.booking import Booking
from app.models.payment import Payment
from app.models.refund import Refund, generate_refund_id
from app.models.review import Review
from app.models.user import User
from app.models.venue import Venue
from app.schemas.booking import BookingCreate
from app.services.notification_service import create_notification
from app.services.cancellation_policy_service import evaluate_policy
from app.services.booking_lock import acquire_range_lock
from app.services.booking_dates import (
    MAX_BOOKING_DAYS,
    booking_end_dt,
    booking_start_dt,
    combine_dt,
    count_days,
    intervals_overlap,
)


def get_venue(db: Session, venue_id: int):
    return db.query(Venue).filter(Venue.id == venue_id).first()


def _latest_payment(db: Session, booking_id: int) -> Payment | None:
    return (
        db.query(Payment)
        .filter(Payment.booking_id == booking_id)
        .order_by(Payment.created_at.desc())
        .first()
    )


def _can_access_booking(user: User, booking: Booking, venue: Venue | None) -> bool:
    if user.role == "admin":
        return True
    if booking.user_id == user.id:
        return True
    if user.role in ("host", "owner") and venue and venue.owner_id == user.id:
        return True
    return False


def _to_list_item(booking: Booking, venue_name: str | None, venue_location: str | None, payment_status: str | None) -> dict:
    return {
        "id": booking.id,
        "venue_id": booking.venue_id,
        "venue_name": venue_name,
        "venue_location": venue_location,
        "booking_date": booking.booking_date,
        "time_slot": booking.time_slot,
        "check_in_date": booking.check_in_date,
        "check_in_time": booking.check_in_time,
        "check_out_date": booking.check_out_date,
        "check_out_time": booking.check_out_time,
        "num_days": booking.num_days,
        "status": booking.status,
        "amount": float(booking.amount),
        "payment_status": payment_status,
        "created_at": booking.created_at,
    }


def _payload_matches(booking: Booking, data: BookingCreate) -> bool:
    return (
        booking.venue_id == data.venue_id
        and booking.check_in_date == data.check_in_date
        and booking.check_in_time == data.check_in_time
        and booking.check_out_date == data.check_out_date
        and booking.check_out_time == data.check_out_time
        and booking.notes == data.notes
        and booking.event_type == data.event_type
        and booking.guest_count == data.guest_count
    )


def _has_overlap(
    db: Session,
    venue_id: int,
    start_dt: datetime,
    end_dt: datetime,
    *,
    exclude_booking_id: int | None = None,
) -> Booking | None:
    bookings = (
        db.query(Booking)
        .filter(
            Booking.venue_id == venue_id,
            Booking.status != "cancelled",
        )
        .all()
    )
    for existing in bookings:
        if exclude_booking_id is not None and existing.id == exclude_booking_id:
            continue
        if intervals_overlap(
            start_dt,
            end_dt,
            booking_start_dt(existing),
            booking_end_dt(existing),
        ):
            return existing
    return None


def _validate_booking_interval(data: BookingCreate) -> tuple[datetime, datetime, int]:
    start_dt = combine_dt(data.check_in_date, data.check_in_time)
    end_dt = combine_dt(data.check_out_date, data.check_out_time)

    if end_dt <= start_dt:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Check-out must be after check-in",
        )

    today = datetime.now(timezone.utc).date()
    if data.check_in_date < today:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Check-in date cannot be in the past",
        )

    num_days = count_days(data.check_in_date, data.check_out_date)
    if num_days > MAX_BOOKING_DAYS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Booking range cannot exceed {MAX_BOOKING_DAYS} days",
        )

    return start_dt, end_dt, num_days


def create_booking(
    db: Session,
    current_user: User,
    data: BookingCreate,
    idempotency_key: str,
) -> tuple[Booking, bool]:
    if not idempotency_key or len(idempotency_key) > 128:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Idempotency-Key header is required (max 128 characters)",
        )

    existing = (
        db.query(Booking)
        .filter(
            Booking.user_id == current_user.id,
            Booking.idempotency_key == idempotency_key,
        )
        .first()
    )
    if existing:
        if not _payload_matches(existing, data):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Idempotency key was already used with different booking data",
            )
        return existing, False

    if current_user.role != "user":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only users can create bookings",
        )
    if current_user.venue_owner_profile is not None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Venue owners cannot create customer bookings",
        )

    venue = get_venue(db, data.venue_id)
    if venue is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Venue not found")
    if venue.approval_status != "approved":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Venue is not available for booking",
        )
    if not venue.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Venue is not available for booking",
        )

    start_dt, end_dt, num_days = _validate_booking_interval(data)

    acquire_range_lock(db, data.venue_id, data.check_in_date, data.check_out_date)

    conflict = _has_overlap(db, data.venue_id, start_dt, end_dt)
    if conflict:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This time range overlaps with an existing booking",
        )

    amount = Decimal(str(venue.price_per_day)) * num_days

    booking = Booking(
        user_id=current_user.id,
        venue_id=data.venue_id,
        booking_date=data.check_in_date,
        time_slot=data.check_in_time,
        check_in_date=data.check_in_date,
        check_in_time=data.check_in_time,
        check_out_date=data.check_out_date,
        check_out_time=data.check_out_time,
        num_days=num_days,
        notes=data.notes,
        event_type=data.event_type,
        guest_count=data.guest_count,
        amount=amount,
        amount_paid=Decimal("0.00"),
        balance_due=amount,
        status="pending_payment",
        owner_status="pending",
        idempotency_key=idempotency_key,
    )
    db.add(booking)

    try:
        db.commit()
        db.refresh(booking)
    except IntegrityError:
        db.rollback()
        replay = (
            db.query(Booking)
            .filter(
                Booking.user_id == current_user.id,
                Booking.idempotency_key == idempotency_key,
            )
            .first()
        )
        if replay:
            if _payload_matches(replay, data):
                return replay, False
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Idempotency key was already used with different booking data",
            )
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This time range overlaps with an existing booking",
        )

    create_notification(
        db,
        user_id=venue.owner_id,
        type="booking_request",
        message="New booking request received",
        venue_id=venue.id,
        booking_id=booking.id,
    )

    return booking, True


def maybe_complete_booking(db: Session, booking: Booking) -> bool:
    if booking.status != "booked" or booking.owner_status != "accepted":
        return False

    now = datetime.now()
    end_dt = booking_end_dt(booking)
    if now >= end_dt:
        booking.status = "completed"
        db.commit()
        db.refresh(booking)
        return True
    return False


def _review_flags(db: Session, booking: Booking) -> tuple[bool, bool]:
    has_review = (
        db.query(Review.id)
        .filter(Review.booking_id == booking.id)
        .first()
        is not None
    )
    can_review = booking.status == "completed" and not has_review
    return can_review, has_review


def _serialize_list_item(
    db: Session,
    booking: Booking,
    venue: Venue | None,
    payment: Payment | None,
) -> dict:
    can_review, has_review = _review_flags(db, booking)
    return {
        "id": booking.id,
        "venue_id": booking.venue_id,
        "venue_name": venue.name if venue else None,
        "venue_location": venue.location if venue else None,
        "booking_date": booking.booking_date,
        "time_slot": booking.time_slot,
        "check_in_date": booking.check_in_date,
        "check_in_time": booking.check_in_time,
        "check_out_date": booking.check_out_date,
        "check_out_time": booking.check_out_time,
        "num_days": booking.num_days,
        "status": booking.status,
        "owner_status": booking.owner_status,
        "amount": float(booking.amount),
        "payment_option": booking.payment_option,
        "amount_paid": float(booking.amount_paid or 0),
        "balance_due": float(booking.balance_due if booking.balance_due is not None else booking.amount),
        "payment_status": payment.status if payment else None,
        "can_review": can_review,
        "has_review": has_review,
        "created_at": booking.created_at,
    }


def _check_in_qr_fields(booking: Booking) -> dict:
    show_qr = (
        booking.owner_status == "accepted"
        and booking.status == "booked"
        and booking.check_in_token is not None
    )
    return {
        "check_in_token": booking.check_in_token if show_qr else None,
        "checked_in_at": booking.checked_in_at,
        "show_check_in_qr": show_qr,
    }


def _latest_refund(db: Session, payment_id: int | None) -> Refund | None:
    if not payment_id:
        return None
    return (
        db.query(Refund)
        .filter(Refund.payment_id == payment_id)
        .order_by(Refund.created_at.desc())
        .first()
    )


def _serialize_detail(db: Session, booking: Booking, venue: Venue | None, payment: Payment | None) -> dict:
    can_review, has_review = _review_flags(db, booking)
    policy = evaluate_policy(venue, booking)
    cancellation_policy = None
    if policy["refund_50_deadline"] is not None:
        cancellation_policy = {
            "refund_50_deadline": policy["refund_50_deadline"],
            "refund_25_deadline": policy["refund_25_deadline"],
            "last_cancel_date": policy["last_cancel_date"],
        }

    refund = _latest_refund(db, payment.id if payment else None)
    refund_status = refund.status if refund else None
    refund_percent = policy["refund_percent"]
    refund_amount = policy["refund_amount"]
    if booking.status == "cancelled" and refund:
        refund_amount = float(refund.amount)
        if booking.amount and float(booking.amount) > 0:
            refund_percent = int(round(float(refund.amount) / float(booking.amount) * 100))
        else:
            refund_percent = 0

    return {
        "id": booking.id,
        "venue_id": booking.venue_id,
        "booking_date": booking.booking_date,
        "time_slot": booking.time_slot,
        "check_in_date": booking.check_in_date,
        "check_in_time": booking.check_in_time,
        "check_out_date": booking.check_out_date,
        "check_out_time": booking.check_out_time,
        "num_days": booking.num_days,
        "notes": booking.notes,
        "event_type": booking.event_type,
        "guest_count": booking.guest_count,
        "status": booking.status,
        "owner_status": booking.owner_status,
        "amount": float(booking.amount),
        "payment_option": booking.payment_option,
        "amount_paid": float(booking.amount_paid or 0),
        "balance_due": float(booking.balance_due if booking.balance_due is not None else booking.amount),
        "created_at": booking.created_at,
        "venue_name": venue.name if venue else None,
        "venue_location": venue.location if venue else None,
        "google_maps_url": venue.google_maps_url if venue else None,
        "advance_percent": venue.advance_percent if venue else 30,
        "allow_pay_at_venue": bool(venue.allow_pay_at_venue) if venue else True,
        "payment_status": payment.status if payment else None,
        "can_review": can_review,
        "has_review": has_review,
        "can_cancel": policy["can_cancel"],
        "refund_percent_if_cancelled": refund_percent,
        "refund_amount_if_cancelled": refund_amount,
        "refund_status": refund_status,
        "cancellation_policy": cancellation_policy,
        "cancellation_reason": booking.cancellation_reason,
        "cancelled_at": booking.cancelled_at,
        **_check_in_qr_fields(booking),
    }


def get_my_bookings(
    db: Session,
    current_user: User,
    page: int = 1,
    limit: int = 20,
    status: str | None = None,
) -> dict:
    page = max(page, 1)
    limit = max(min(limit, 100), 1)

    base_query = db.query(Booking).filter(Booking.user_id == current_user.id)
    if status:
        base_query = base_query.filter(Booking.status == status)

    total = base_query.count()
    items = (
        base_query.order_by(Booking.created_at.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    venue_ids = {b.venue_id for b in items}
    venues = {
        v.id: v
        for v in db.query(Venue).filter(Venue.id.in_(venue_ids)).all()
    } if venue_ids else {}

    serialized = []
    for booking in items:
        maybe_complete_booking(db, booking)
        venue = venues.get(booking.venue_id)
        payment = _latest_payment(db, booking.id)
        serialized.append(_serialize_list_item(db, booking, venue, payment))

    return {"items": serialized, "total": total, "page": page, "limit": limit}


def _get_own_booking_or_404(db: Session, current_user: User, booking_id: int) -> Booking:
    booking = (
        db.query(Booking)
        .filter(Booking.id == booking_id, Booking.user_id == current_user.id)
        .first()
    )
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")
    return booking


def get_booking_detail(db: Session, current_user: User, booking_id: int) -> dict:
    booking = _get_own_booking_or_404(db, current_user, booking_id)
    maybe_complete_booking(db, booking)
    venue = get_venue(db, booking.venue_id)
    payment = _latest_payment(db, booking.id)
    return _serialize_detail(db, booking, venue, payment)


def cancel_booking(db: Session, current_user: User, booking_id: int, cancellation_reason: str | None) -> dict:
    booking = _get_own_booking_or_404(db, current_user, booking_id)

    if booking.status == "cancelled":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="This booking is already cancelled")

    venue = get_venue(db, booking.venue_id)
    policy = evaluate_policy(venue, booking)
    if not policy["can_cancel"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="CANCELLATION_NOT_ALLOWED",
        )

    payment = _latest_payment(db, booking.id)
    refund_status = None
    refund_percent = policy["refund_percent"]
    refund_amount = policy["refund_amount"]

    booking.status = "cancelled"
    booking.cancellation_reason = cancellation_reason
    booking.cancelled_at = datetime.now(timezone.utc)

    if payment and payment.status == "paid" and refund_amount > 0:
        refund = Refund(
            refund_id=generate_refund_id(),
            payment_id=payment.id,
            amount=Decimal(str(refund_amount)),
            reason=cancellation_reason or "Booking cancelled by customer",
            status="refund_pending",
            initiated_by=current_user.id,
        )
        db.add(refund)
        payment.status = "refund_pending"
        refund_status = "refund_pending"

    db.commit()
    db.refresh(booking)

    return {
        "id": booking.id,
        "venue_id": booking.venue_id,
        "booking_date": booking.booking_date,
        "time_slot": booking.time_slot,
        "check_in_date": booking.check_in_date,
        "check_in_time": booking.check_in_time,
        "check_out_date": booking.check_out_date,
        "check_out_time": booking.check_out_time,
        "num_days": booking.num_days,
        "notes": booking.notes,
        "event_type": booking.event_type,
        "guest_count": booking.guest_count,
        "status": booking.status,
        "owner_status": booking.owner_status,
        "amount": float(booking.amount),
        "payment_option": booking.payment_option,
        "amount_paid": float(booking.amount_paid or 0),
        "balance_due": float(booking.balance_due if booking.balance_due is not None else 0),
        "created_at": booking.created_at,
        "cancellation_reason": booking.cancellation_reason,
        "cancelled_at": booking.cancelled_at,
        "refund_status": refund_status,
        "refund_percent": refund_percent,
        "refund_amount": refund_amount,
    }


def get_owner_bookings(
    db: Session,
    current_user: User,
    tab: str = "all",
    page: int = 1,
    limit: int = 10,
    venue_id: Optional[int] = None,
) -> dict:
    today = date.today()

    base = (
        db.query(Booking)
        .join(Venue, Booking.venue_id == Venue.id)
        .options(joinedload(Booking.venue), joinedload(Booking.user))
        .filter(Venue.owner_id == current_user.id)
    )

    if venue_id is not None:
        base = base.filter(Booking.venue_id == venue_id)

    if tab == "upcoming":
        base = base.filter(
            Booking.check_out_date >= today,
            Booking.status != "cancelled",
        )
    elif tab == "past":
        base = base.filter(
            Booking.check_out_date < today,
            Booking.status != "cancelled",
        )
    elif tab == "cancelled":
        base = base.filter(Booking.status == "cancelled")

    total = base.count()
    items = (
        base.order_by(Booking.created_at.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    return {"items": items, "total": total, "page": page, "limit": limit}
