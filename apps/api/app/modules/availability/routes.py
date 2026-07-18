from datetime import date, datetime
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.modules.auth.dependencies import AuthContext, require_owner
from app.modules.availability import service
from app.modules.availability.schemas import (
    AvailabilityResponse,
    CalendarResponse,
    ValidationResponse,
)
from app.modules.venue.schemas import BookingType, PricingQuote

router = APIRouter()


@router.get(
    "/venues/{venue_id}/availability",
    response_model=AvailabilityResponse,
)
def availability_for_date_query(
    venue_id: str,
    availability_date: date = Query(..., alias="date"),
    booking_type: BookingType = Query(...),
    db: Session = Depends(get_db),
):
    return service.get_availability_for_date(
        db=db,
        venue_id=venue_id,
        booking_date=availability_date,
        booking_type=booking_type.value,
    )


@router.get(
    "/venues/{venue_id}/calendar",
    response_model=CalendarResponse,
)
def calendar(
    venue_id: UUID,
    start_date: date = Query(...),
    end_date: date = Query(...),
    booking_type: BookingType = Query(...),
    db: Session = Depends(get_db),
):
    return service.get_calendar(
        db=db,
        venue_id=venue_id,
        start_date=start_date,
        end_date=end_date,
        booking_type=booking_type.value,
    )


@router.get(
    "/venues/{venue_id}/calendar/owner",
    response_model=CalendarResponse,
)
def owner_calendar(
    venue_id: UUID,
    start_date: date = Query(...),
    end_date: date = Query(...),
    auth: AuthContext = Depends(require_owner),
    db: Session = Depends(get_db),
):
    return service.get_owner_calendar(
        db=db,
        venue_id=venue_id,
        owner_id=auth.user_id,
        start_date=start_date,
        end_date=end_date,
        allow_admin=auth.is_admin(),
    )


@router.get(
    "/venues/{venue_id}/date/{booking_date}",
    response_model=AvailabilityResponse,
)
def availability_for_date(
    venue_id: str,
    booking_date: date,
    booking_type: BookingType = Query(...),
    db: Session = Depends(get_db),
):
    return service.get_availability_for_date(
        db=db,
        venue_id=venue_id,
        booking_date=booking_date,
        booking_type=booking_type.value,
    )


@router.get(
    "/venues/{venue_id}/quote",
    response_model=PricingQuote,
)
def pricing_quote(
    venue_id: str,
    starts_at: datetime = Query(...),
    ends_at: datetime = Query(...),
    booking_type: BookingType = Query(...),
    db: Session = Depends(get_db),
):
    return service.get_pricing_quote(
        db=db,
        venue_id=venue_id,
        starts_at=starts_at,
        ends_at=ends_at,
        booking_type=booking_type.value,
    )


@router.post(
    "/venues/{venue_id}/validate",
    response_model=ValidationResponse,
)
def validate_slot(
    venue_id: str,
    booking_type: str,
    starts_at: datetime | None = Query(None),
    ends_at: datetime | None = Query(None),
    booking_date: date | None = Query(None),
    guest_count: int | None = Query(None, gt=0),
    db: Session = Depends(get_db),
):
    return service.validate_slot(
        db=db,
        venue_id=venue_id,
        booking_type=booking_type,
        starts_at=starts_at,
        ends_at=ends_at,
        booking_date=booking_date,
        guest_count=guest_count,
    )
