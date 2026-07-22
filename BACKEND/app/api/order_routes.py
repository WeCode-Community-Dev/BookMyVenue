from fastapi import APIRouter, Depends, Query, Path, HTTPException
from app.core.dependencies import get_current_user
from sqlalchemy.orm import Session
from app.db.session import get_db
from typing import List, Optional
from app.services.order_service import (
    get_earnings
)

router = APIRouter(
    prefix="/order",
    tags=["Orders"]
)


@router.get("/total-earnings")
async def get_my_earnings(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
    venue_id: str = Path(...)
):
    """
    Get total earnings for the current user.
    """ 
    try:
        return get_earnings(
            db,
            user_id=current_user["sub"],
        ) 

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))