from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.booking import Booking
from app.models.payment import Payment
from app.models.user import User
from app.models.venue import Venue
from app.schemas.booking import BookingCreate


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
        "status": booking.status,
        "amount": float(booking.amount),
        "payment_status": payment_status,
        "created_at": booking.created_at,
    }


def create_booking(db: Session, current_user: User, data: BookingCreate):
    if current_user.role != "user":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only users can create bookings",
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
    if data.booking_date < datetime.now(timezone.utc).date():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Booking date cannot be in the past",
        )
    clash = (
        db.query(Booking)
        .filter(
            Booking.venue_id == data.venue_id,
            Booking.booking_date == data.booking_date,
            Booking.time_slot == data.time_slot,
            Booking.status != "cancelled",
        )
        .first()
    )
    if clash:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This slot is already booked",
        )
    booking = Booking(
        user_id=current_user.id,
        venue_id=data.venue_id,
        booking_date=data.booking_date,
        time_slot=data.time_slot,
        notes=data.notes,
        amount=venue.price_per_day,
        status="pending_payment",
        owner_status="pending",
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking


def get_my_bookings(
    db: Session,
    current_user: User,
    status_filter: str | None = None,
    page: int = 1,
    limit: int = 20,
) -> dict:
    if current_user.role != "user":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only users can view order history",
        )

    query = (
        db.query(Booking, Venue.name, Venue.location)
        .join(Venue, Booking.venue_id == Venue.id)
        .filter(Booking.user_id == current_user.id)
    )
    if status_filter:
        query = query.filter(Booking.status == status_filter)

    total = query.count()
    rows = (
        query.order_by(Booking.created_at.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    data = []
    for booking, venue_name, venue_location in rows:
        payment = _latest_payment(db, booking.id)
        data.append(
            _to_list_item(
                booking,
                venue_name,
                venue_location,
                payment.status if payment else None,
            )
        )

    total_pages = max(1, (total + limit - 1) // limit)
    return {
        "data": data,
        "pagination": {
            "page": page,
            "limit": limit,
            "total_items": total,
            "total_pages": total_pages,
        },
    }


def get_booking_detail(db: Session, current_user: User, booking_id: int) -> dict:
    row = (
        db.query(Booking, Venue.name, Venue.location, Venue.owner_id)
        .join(Venue, Booking.venue_id == Venue.id)
        .filter(Booking.id == booking_id)
        .first()
    )
    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")

    booking, venue_name, venue_location, owner_id = row
    venue = Venue(id=booking.venue_id, owner_id=owner_id)
    if not _can_access_booking(current_user, booking, venue):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    payment = _latest_payment(db, booking.id)
    item = _to_list_item(
        booking,
        venue_name,
        venue_location,
        payment.status if payment else None,
    )
    item["user_id"] = booking.user_id
    item["notes"] = booking.notes
    item["cancellation_reason"] = booking.cancellation_reason
    item["cancelled_at"] = booking.cancelled_at
    if payment:
        item["payment"] = {
            "payment_id": payment.payment_id,
            "status": payment.status,
            "paid_at": payment.paid_at,
        }
    else:
        item["payment"] = None
    return item


def cancel_booking(
    db: Session,
    current_user: User,
    booking_id: int,
    reason: str | None = None,
) -> Booking:
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")
    if booking.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    if booking.status == "cancelled":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Booking is already cancelled",
        )
    if booking.booking_date < datetime.now(timezone.utc).date():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot cancel a booking that has already passed",
        )

    booking.status = "cancelled"
    booking.cancellation_reason = reason
    booking.cancelled_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(booking)
    return booking
