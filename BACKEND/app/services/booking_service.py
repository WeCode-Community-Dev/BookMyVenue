from fastapi import HTTPException, status
from app.core.config import settings
from typing import List
from sqlalchemy.orm import Session
from app.model.bookings import Booking

def create_booking(
    db: Session,
    user_id: int,
    venue_id: int,
    order_id: str,
    booking_date: str,
    booking_time: str,
    status: str
):
    try:
        new_booking = Booking(
            user_id=user_id,
            venue_id=venue_id,
            order_id=order_id,
            booking_date=booking_date,
            booking_time=booking_time,
            status=status
        )

        db.add(new_booking)
        db.commit()
        db.refresh(new_booking)

        return new_booking

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating booking: {e}"
        )

def get_booking(
    db: Session,
    user_id: int = None,
    venue_id: int = None,
    page_no: int = 1,
    limit: int = 20
) -> List[Booking]:
    try:
        query = db.query(Booking)

        if user_id is not None:
            query = query.filter(Booking.user_id == user_id)

        if venue_id is not None:
            query = query.filter(Booking.venue_id == venue_id)

        # Apply pagination
        query = query.offset((page_no - 1) * limit).limit(limit)

        bookings = query.all()
        return bookings

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving bookings: {e}"
        )