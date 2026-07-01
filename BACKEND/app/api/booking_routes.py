from fastapi import APIRouter, Depends, Query, Path, HTTPException
from app.core.dependencies import get_current_user
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.booking_service import get_booking

router = APIRouter(
    prefix="/booking",
    tags=["Booking"]
)

@router.get("/my-bookings")
async def get_my_bookings(
    current_user: dict = Depends(get_current_user),
    page_no: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Records per page"),
    db: Session = Depends(get_db)
):
    """
    Get all bookings for the current user.
    """ 
    try:
        return get_booking(
            db,
            user_id=current_user["sub"],
            venue_id=None,
            page_no=page_no,
            limit=limit
        ) 

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/bookings/{venue_id}")
async def get_venue_bookings(
    current_user: dict = Depends(get_current_user),
    venue_id: int = Path(..., description="Venue ID"),
    page_no: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Records per page"),
    db: Session = Depends(get_db)
):
    """
    Get all bookings for the current user.
    """ 
    try:
        return get_booking(
            db,
            user_id=current_user["sub"],
            venue_id=venue_id,
            page_no=page_no,
            limit=limit
        ) 

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

