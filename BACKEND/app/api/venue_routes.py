from app.core.dependencies import get_current_user
from typing import Optional
from app.db.session import get_db

from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from app.schema.venue import (
    VenueDetailsCreate,
    VenueAmenitiesCreate
)
from app.services.venue_service import ( 
    get_venues, 
    get_venue_details_by_id,
    add_venue,
    add_venue_amenities,
    add_venue_images
)

from fastapi import APIRouter, HTTPException, status, UploadFile, File
from typing import List
from app.services.cloudinary_service import upload_images


router = APIRouter(
    prefix="/venues",
    tags=["Venues"]
)

@router.get("/")
def venues(
    db: Session = Depends(get_db),
    page_no: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Records per page"),
    action: Optional[str] = Query(None, description="Filter by action"),
    location: Optional[str] = Query(None, description="Filter by location"),
    avaialability: Optional[str] = Query(None, description="Filter by location"),
):
    try:
        return get_venues(
            db,
            page_no,
            limit,
            action,
            location,
            avaialability
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

@router.get("/details/{venue_id}")
def venues(
    venue_id: int,
    db: Session = Depends(get_db),
):
    try:
        return get_venue_details_by_id(
            db,
            venue_id
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

@router.post("/basic-details")
def venues(
    payload: VenueDetailsCreate,
    db: Session = Depends(get_db),
):
    try:
        return add_venue(
            db,
            user_id=payload.user_id,    
            venue_name=payload.venue_name,
            venue_description=payload.venue_description,
            location=payload.location,
            capacity=payload.capacity,
            venue_price=payload.venue_price,
            venue_availabilty=payload.venue_availabilty,
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

@router.post("/{venue_id}/amenities")
def venues(
    payload: VenueAmenitiesCreate,
    venue_id: int,
    db: Session = Depends(get_db),
):
    try:
        return add_venue_amenities(
            db=db,
            venue_id=venue_id,
            wifi=payload.wifi,
            kitchen=payload.kitchen,
            parking=payload.parking,
            ac=payload.ac,
            wheel_chair=payload.wheel_chair,
            av_equipements=payload.av_equipements,
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

@router.post("/{venue_id}/images")
async def upload_venue_images(
    venue_id: int,
    images: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
):
    try:
        images_urls = await upload_images(
            images=images,
            venue_id=venue_id
        )
        print(images_urls)

        return add_venue_images(
            db=db,
            images_urls=images_urls,
            venue_id=venue_id
        )


        return images_urls
            

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
