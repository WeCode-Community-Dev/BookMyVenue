from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from datetime import datetime, timezone
from app.models.booking import Booking
from app.models.user import User
from app.models.venue import Venue
from app.schemas.booking import BookingCreate 
from app.services.notification_service import create_notification

def get_venue(db: Session, venue_id: int):
    return db.query(Venue).filter(Venue.id == venue_id).first()

def create_booking(db: Session, current_user: User, data: BookingCreate): 
    # 1. only normal users can book
    if current_user.role != "user":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only users can create bookings",
        )
    # 2. venue must exist and be approved
    venue = get_venue(db, data.venue_id)
    if venue is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Venue not found",
        )
    if venue.approval_status != "approved":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Venue is not available for booking",
        )
    # 3. booking date cannot be in the past
    if data.booking_date < datetime.now(timezone.utc).date():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Booking date cannot be in the past",
        )
    # 4. slot must be free (ignore cancelled bookings)
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
    # 5. create the booking (price comes from the venue)
    booking = Booking(
        user_id=current_user.id,
        venue_id=data.venue_id,
        booking_date=data.booking_date,
        time_slot=data.time_slot,
        notes=data.notes,
        event_type=data.event_type,
        guest_count=data.guest_count,
        amount=venue.price_per_day,
        status="pending_payment",
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    
    
    create_notification(
        db,
        user_id=venue.owner_id,
        type="booking_request",
        message="New booking request received",
        venue_id=venue.id,
        booking_id=booking.id,
    )
    
    return booking



def get_my_bookings(db: Session, current_user: User, page: int = 1, limit: int = 20) -> dict:
    page = max(page, 1)
    limit = max(min(limit, 100), 1)

    base_query = db.query(Booking).filter(Booking.user_id == current_user.id)

    total = base_query.count()
    items = (
        base_query.order_by(Booking.created_at.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    return {"items": items, "total": total, "page": page, "limit": limit}


def _get_own_booking_or_404(db: Session, current_user: User, booking_id: int) -> Booking:
    booking = (
        db.query(Booking)
        .filter(Booking.id == booking_id, Booking.user_id == current_user.id)
        .first()
    )
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")
    return booking


def get_booking_detail(db: Session, current_user: User, booking_id: int) -> Booking:
    return _get_own_booking_or_404(db, current_user, booking_id)


def cancel_booking(db: Session, current_user: User, booking_id: int, cancellation_reason: str | None) -> Booking:
    booking = _get_own_booking_or_404(db, current_user, booking_id)

    if booking.status == "cancelled":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="This booking is already cancelled")

    booking.status = "cancelled"
    booking.cancellation_reason = cancellation_reason
    booking.cancelled_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(booking)
    return booking