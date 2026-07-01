from fastapi import HTTPException, status
from app.core.config import settings
from typing import List
from sqlalchemy.orm import Session
from app.model.bookings import Booking
from typing import Optional

def create_booking(
    db: Session,
    venue_id: int,
    order_id: str,
    booking_date: str,
    status: str,
    user_id: Optional[int] = None,
    start_time: Optional[str] = None,
    end_time: Optional[str] = None,
):
    try:
        print("here")
        new_booking = Booking(
            user_id=user_id,
            venue_id=venue_id,
            order_id=order_id,
            booking_date=booking_date,
            status=status,
            start_time=start_time,
            end_time=end_time
        )

        db.add(new_booking)
        db.commit()
        db.refresh(new_booking)

        return new_booking

    except Exception as e:
        raise HTTPException(
            status_code=400,
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

def cancel_booking(db: Session, booking_id: int):
    try:
        booking = db.query(Booking).filter(Booking.id == booking_id).first()
        if not booking:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Booking with ID {booking_id} not found."
            )

        booking.status = "cancelled"
        db.commit()
        db.refresh(booking)

        return booking

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error cancelling booking: {e}"
        )
    