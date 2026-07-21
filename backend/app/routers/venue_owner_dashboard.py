from app.models.venue_owner import VenueOwner
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.db.deps import get_db
from app.core.security import get_current_venue_owner
from app.models.user import User

from app.schemas.venue import VenueOut
from app.schemas.review import ReviewOut
from app.schemas.booking import PaginatedOwnerBookingsOut, OwnerBookingOut
from app.services import booking_service
from app.schemas.notification import NotificationOut
from app.schemas.venue_owner_dashboard import (
    DashboardSummaryOut,
    BookingRequestOut,
    AvailabilityCalendarOut,
    RevenueOverviewOut,
)

from app.services import venue_owner_dashboard_service as dashboard_service
from app.services.venue_service import get_my_venues
from app.services.review_service import get_recent_reviews_for_owner, get_review_dashboard_data
from app.services.notification_service import get_notifications_for_user


router = APIRouter(prefix="/venue-owners/dashboard", tags=["Venue Owner Dashboard"])


@router.get("/summary", response_model=DashboardSummaryOut)
def dashboard_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_venue_owner),
):
    return dashboard_service.get_dashboard_summary(db, current_user.id)


@router.get("/bookings/all", response_model=PaginatedOwnerBookingsOut)
def owner_all_bookings(
    tab: str = Query(default="all", regex="^(all|upcoming|past|cancelled)$"),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=100),
    venue_id: Optional[int] = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_venue_owner),
):
    return booking_service.get_owner_bookings(db, current_user, tab, page, limit, venue_id)

@router.get("/bookings/requests", response_model=list[BookingRequestOut])
def booking_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_venue_owner),
):
    return dashboard_service.get_booking_requests(db, current_user.id)


@router.patch("/bookings/{booking_id}/accept", response_model=BookingRequestOut)
def accept_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_venue_owner),
):
    booking = dashboard_service.accept_booking_request(db, booking_id, current_user.id)
    return {
        "id": booking.id,
        "venue_name": booking.venue.name if hasattr(booking, "venue") else None,
        "event_type": booking.event_type,
        "event_date": booking.booking_date,
        "event_time": booking.time_slot,
        "guest_count": booking.guest_count,
        "price": float(booking.amount),
        "owner_status": booking.owner_status,
    }


@router.patch("/bookings/{booking_id}/reject", response_model=BookingRequestOut)
def reject_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_venue_owner),
):
    booking = dashboard_service.reject_booking_request(db, booking_id, current_user.id)
    return {
        "id": booking.id,
        "venue_name": booking.venue.name if hasattr(booking, "venue") else None,
        "event_type": booking.event_type,
        "event_date": booking.booking_date,
        "event_time": booking.time_slot,
        "guest_count": booking.guest_count,
        "price": float(booking.amount),
        "owner_status": booking.owner_status,
    }


@router.get("/availability", response_model=AvailabilityCalendarOut)
def availability_calendar(
    month: str = Query(..., description="YYYY-MM, e.g. 2024-05"),
    venue_id: Optional[int] = Query(default=None, description="Filter by a specific venue"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_venue_owner),
):
    return dashboard_service.get_availability_calendar(db, current_user.id, month, venue_id)


@router.get("/venues", response_model=list[VenueOut])
def my_venues(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_venue_owner),
):
    return get_my_venues(db, current_user)


@router.get("/revenue", response_model=RevenueOverviewOut)
def revenue_overview(
    range: str = Query(default="this_month"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_venue_owner),
):
    return dashboard_service.get_revenue_overview(db, current_user.id, range)


@router.get("/reviews")
def get_owner_reviews(
    db: Session = Depends(get_db),
    current_owner: VenueOwner = Depends(get_current_venue_owner),
):
    return get_review_dashboard_data(db, owner_id=current_owner.id)


@router.get("/reviews/recent", response_model=list[ReviewOut])
def recent_reviews(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_venue_owner),
):
    return get_recent_reviews_for_owner(db, current_user.id)


@router.get("/notifications", response_model=list[NotificationOut])
def notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_venue_owner),
):
    rows = get_notifications_for_user(db, current_user.id)
    return [
        {
            "id": n.id,
            "type": n.type,
            "message": n.message,
            "venue_name": n.venue.name if n.venue else None,
            "booking_ref": f"#BKM{n.booking_id}" if n.booking_id else None,
            "is_read": n.is_read,
            "created_at": n.created_at,
        }
        for n in rows
    ]
