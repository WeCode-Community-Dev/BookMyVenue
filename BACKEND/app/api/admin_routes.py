from app.core.dependencies import get_current_user
from typing import Optional
from app.db.session import get_db

from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from app.schema.venue import (
    VenueApprovalRequest
)
from app.services.venue_service import ( 
    update_venue_approval_status
)

from fastapi import APIRouter, HTTPException, status, UploadFile, File
from typing import List
from app.services.cloudinary_service import upload_images


router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)

@router.post("/update-venue-approval-status/{venue_id}")
def get_venue_by_id(
    payload: VenueApprovalRequest,
    venue_id: int,
    db: Session = Depends(get_db),
):
    try:
        return update_venue_approval_status(
            db,
            venue_id,
            payload.status,
            payload.reason,
            payload.user_id
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

