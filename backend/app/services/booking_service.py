from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException, status
from typing import Optional
from datetime import datetime, timezone, date
from app.models.booking import Booking
from app.models.payment import Payment
from app.models.user import User
from app.models.venue import Venue
from app.schemas.booking import BookingCreate 
from app.services.notification_service import create_notification

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
        event_type=data.event_type,
        guest_count=data.guest_count,
        amount=venue.price_per_day,
        status="pending_payment",
        owner_status="pending",
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




def get_owner_bookings(
    db: Session,
    current_user: User,
    tab: str = "all",      
    page: int = 1,
    limit: int = 10,
    venue_id: Optional[int] = None,
) -> dict:
    today = date.today()
 
    # Base: only bookings for venues owned by this user
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
            Booking.booking_date >= today,
            Booking.status != "cancelled",
        )
    elif tab == "past":
        base = base.filter(
            Booking.booking_date < today,
            Booking.status != "cancelled",
        )
    elif tab == "cancelled":
        base = base.filter(Booking.status == "cancelled")
    # "all" → no extra filter
 
    total = base.count()
    items = (
        base.order_by(Booking.created_at.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )
 
    return {"items": items, "total": total, "page": page, "limit": limit}
 
 
