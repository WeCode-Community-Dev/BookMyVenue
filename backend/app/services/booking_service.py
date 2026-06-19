from sqlalchemy.orm import Session
from sqlalchemy import text
from fastapi import HTTPException, status
from datetime import datetime, timezone
from app.models.booking import Booking
from app.models.user import User
from app.schemas.booking import BookingCreate 

def get_venue(db: Session, venue_id: int):

    row = db.execute(
        text(
            "SELECT id, price_per_day, approval_status "
            "FROM venues WHERE id = :vid"
        ),
        {"vid": venue_id},
    ).fetchone()
    return row 

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
        amount=venue.price_per_day,
        status="pending_payment",
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking