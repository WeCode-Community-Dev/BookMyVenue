from app.core.dependencies import get_current_user
from typing import Optional
from app.db.session import get_db

from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from app.schema.venue import (
    VenueDetailsCreate,
    VenueAmenitiesCreate,
    VenueAmenitiesUpdate,
    VenueActiveStatusRequest,
    VenueDetailsUpdate,
    VenueAvailabilityCreate
)
from app.services.venue_service import ( 
    get_venues, 
    get_venue_details_by_id,
    add_venue,
    add_venue_amenities,
    add_venue_images,
    update_venue_active_status,
    edit_venue,
    edit_venue_amenities,
    search_venues,
    add_venue_availability
)

from fastapi import APIRouter, HTTPException, status, UploadFile, File
from typing import List
from app.services.cloudinary_service import upload_images


router = APIRouter(
    prefix="/venues",
    tags=["Venues"]
)

@router.get("/")
def get_venues_route(
    db: Session = Depends(get_db),
    page_no: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Records per page"),
):
    try:
        return get_venues(
            db,
            page_no,
            limit,
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

@router.get("/details/{venue_id}")
def get_venue_by_id(
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
def upload_venue_details(
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
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

@router.post("/{venue_id}/amenities")
def upload_venue_amenities(
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

@router.patch("/active-status/{venue_id}")
def update_venue_status(
    venue_id: int,
    payload: VenueActiveStatusRequest,
    db: Session = Depends(get_db),
):
    try:
        return update_venue_active_status(
            db=db,
            venue_id=venue_id,
            status=payload.status,
            reason=payload.reason
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.put("/{venue_id}/basic-details")
def update_venue_basic_details(
    venue_id: int,
    payload: VenueDetailsUpdate,
    db: Session = Depends(get_db),
):
    try:
        return edit_venue(
            db=db,
            venue_id=venue_id,
            venue_name=payload.venue_name,
            venue_description=payload.venue_description,
            location=payload.location,
            capacity=payload.capacity,
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

@router.put("/{venue_id}/amenities")
def update_venue_amenities(
    venue_id: int,
    payload: VenueAmenitiesUpdate,
    db: Session = Depends(get_db),
):
    try:
        return edit_venue_amenities(
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

@router.get("/search")
def search_venues_route(
    db: Session = Depends(get_db),
    q: Optional[str] = Query(None, description="Search text"),
    location: Optional[str] = Query(None),
    min_price: Optional[int] = Query(None),
    max_price: Optional[int] = Query(None),
    wifi: bool | None = Query(None),
    parking: bool | None = Query(None),
    ac: bool | None = Query(None),
    page_no: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
):
    return search_venues(
        db=db,
        q=q,
        location=location,
        min_price=min_price,
        max_price=max_price,
        wifi=wifi,
        parking=parking,
        ac=ac,
        page_no=page_no,
        limit=limit,
    )

@router.post("/{venue_id}/availability")
def upload_venue_availability(
    payload: VenueAvailabilityCreate,
    venue_id: int,
    db: Session = Depends(get_db),
):
    try:
        return add_venue_availability(
            db=db,
            venue_id=venue_id,
            booking_types=payload.booking_types,
            open_time=payload.open_time,
            closing_time=payload.closing_time,
            minimum_hours=payload.minimum_hours,
            gap_between_bookings=payload.gap_between_bookings,
            venue_price=payload.venue_price,
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )