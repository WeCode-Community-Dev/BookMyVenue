from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.booking import BookingCreate, BookingOut
from app.services import booking_service 

router = APIRouter(prefix="/bookings", tags=["Bookings"]) 

@router.post("", response_model=BookingOut)
def create_booking(
    data: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return booking_service.create_booking(db, current_user, data) 

    