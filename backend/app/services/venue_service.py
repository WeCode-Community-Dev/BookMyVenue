from datetime import date, datetime, time, timezone

from fastapi import HTTPException
from sqlalchemy.orm import Session, joinedload, selectinload

from app.models.booking import Booking
from app.models.user import User
from app.models.venue import Venue
from app.schemas.venue import VenueCreate
from app.services.notification_service import create_notification
from app.services.venue_image_service import seed_gallery, sync_cover
from app.services.cancellation_policy_service import validate_cancellation_policy_fields
from app.services.booking_dates import (
    booking_end_dt,
    booking_start_dt,
    combine_dt,
    intervals_overlap,
)


def _fetch_full(db: Session, venue_id: int) -> Venue:
    venue = (
        db.query(Venue)
        .options(
            joinedload(Venue.venue_type),
            joinedload(Venue.amenities),
            selectinload(Venue.images),
        )
        .filter(Venue.id == venue_id)
        .first()
    )
    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")
    return venue


def _public_venue_query(db: Session):
    return (
        db.query(Venue)
        .options(
            joinedload(Venue.venue_type),
            joinedload(Venue.amenities),
            selectinload(Venue.images),
        )
        .filter(
            Venue.approval_status == "approved",
            Venue.is_active.is_(True),
        )
    )


def _get_bookable_venue(db: Session, venue_id: int) -> Venue:
    venue = (
        db.query(Venue)
        .filter(
            Venue.id == venue_id,
            Venue.approval_status == "approved",
            Venue.is_active.is_(True),
        )
        .first()
    )
    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")
    return venue


def _find_overlap(
    db: Session,
    venue_id: int,
    start_dt: datetime,
    end_dt: datetime,
) -> Booking | None:
    bookings = (
        db.query(Booking)
        .filter(
            Booking.venue_id == venue_id,
            Booking.status != "cancelled",
        )
        .all()
    )
    for booking in bookings:
        if intervals_overlap(
            start_dt,
            end_dt,
            booking_start_dt(booking),
            booking_end_dt(booking),
        ):
            return booking
    return None


def _validate_google_maps_url(url: str | None) -> None:
    if not url or not url.strip():
        return
    allowed = ("google.com/maps", "maps.app.goo.gl", "goo.gl/maps")
    if not any(part in url for part in allowed):
        raise HTTPException(
            status_code=400,
            detail="Google Maps URL must be a valid Google Maps share link",
        )


def _validate_google_review_url(url: str | None) -> None:
    if not url or not url.strip():
        return
    allowed = (
        "search.google.com/local/writereview",
        "g.page/r/",
        "google.com/maps",
        "maps.app.goo.gl",
        "goo.gl/maps",
    )
    if not any(part in url for part in allowed):
        raise HTTPException(
            status_code=400,
            detail="Google review URL must be a valid Google write-a-review or Maps link",
        )


def create_venue(db: Session, venue_data: VenueCreate, current_user: User) -> Venue:
    _validate_google_maps_url(venue_data.google_maps_url)
    _validate_google_review_url(venue_data.google_review_url)
    validate_cancellation_policy_fields(
        venue_data.refund_50_days_before,
        venue_data.refund_25_days_before,
        venue_data.cancel_cutoff_days_before,
    )
    new_venue = Venue(
        owner_id=current_user.id,
        name=venue_data.name,
        location=venue_data.location,
        google_maps_url=venue_data.google_maps_url,
        google_review_url=venue_data.google_review_url,
        price_per_day=venue_data.price_per_day,
        venue_type_id=venue_data.venue_type_id,
        capacity=venue_data.capacity,
        image_url=venue_data.image_url,
        description=venue_data.description,
        refund_50_days_before=venue_data.refund_50_days_before,
        refund_25_days_before=venue_data.refund_25_days_before,
        cancel_cutoff_days_before=venue_data.cancel_cutoff_days_before,
        advance_percent=venue_data.advance_percent,
        allow_pay_at_venue=venue_data.allow_pay_at_venue,
    )

    db.add(new_venue)
    db.flush()

    gallery_urls = list(venue_data.image_urls or [])
    if not gallery_urls and venue_data.image_url:
        gallery_urls = [venue_data.image_url]
    if gallery_urls:
        seed_gallery(db, new_venue, gallery_urls)

    db.commit()
    return _fetch_full(db, new_venue.id)


def get_venues(
    db: Session,
    location: str | None = None,
    search: str | None = None,
    skip: int = 0,
    limit: int = 10,
):
    query = _public_venue_query(db)

    if location:
        query = query.filter(Venue.location.ilike(f"%{location}%"))

    if search:
        query = query.filter(Venue.name.ilike(f"%{search}%"))

    return query.order_by(Venue.created_at.desc()).offset(skip).limit(limit).all()


def get_venue_by_id(db: Session, venue_id: int, *, public: bool = True):
    if public:
        venue = _public_venue_query(db).filter(Venue.id == venue_id).first()
    else:
        venue = _fetch_full(db, venue_id)

    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")

    return venue


def check_availability(
    db: Session,
    venue_id: int,
    booking_date: date,
    time_slot: time,
) -> dict:
    end_time = time(23, 59, 59)
    return check_availability_range(
        db,
        venue_id,
        booking_date,
        time_slot,
        booking_date,
        end_time,
    )


def check_availability_range(
    db: Session,
    venue_id: int,
    check_in_date: date,
    check_in_time: time,
    check_out_date: date,
    check_out_time: time,
) -> dict:
    _get_bookable_venue(db, venue_id)

    start_dt = combine_dt(check_in_date, check_in_time)
    end_dt = combine_dt(check_out_date, check_out_time)

    if end_dt <= start_dt:
        return {
            "venue_id": venue_id,
            "check_in_date": str(check_in_date),
            "check_in_time": str(check_in_time),
            "check_out_date": str(check_out_date),
            "check_out_time": str(check_out_time),
            "available": False,
            "reason": "Check-out must be after check-in",
        }

    conflict = _find_overlap(db, venue_id, start_dt, end_dt)
    result = {
        "venue_id": venue_id,
        "check_in_date": str(check_in_date),
        "check_in_time": str(check_in_time),
        "check_out_date": str(check_out_date),
        "check_out_time": str(check_out_time),
        "available": conflict is None,
    }
    if conflict:
        result["conflict_date"] = str(conflict.check_in_date)
        result["conflict_booking_id"] = conflict.id
    return result


def update_venue(db: Session, venue_id: int, venue_data, owner_id: int):
    venue = db.query(Venue).filter(Venue.id == venue_id).first()

    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")

    if venue.owner_id != owner_id:
        raise HTTPException(status_code=403, detail="You don't have permission to update this venue")

    _validate_google_maps_url(venue_data.google_maps_url)
    _validate_google_review_url(venue_data.google_review_url)
    validate_cancellation_policy_fields(
        venue_data.refund_50_days_before,
        venue_data.refund_25_days_before,
        venue_data.cancel_cutoff_days_before,
    )

    venue.name = venue_data.name
    venue.location = venue_data.location
    venue.google_maps_url = venue_data.google_maps_url
    venue.google_review_url = venue_data.google_review_url
    venue.price_per_day = venue_data.price_per_day
    venue.venue_type_id = venue_data.venue_type_id
    venue.description = venue_data.description
    venue.capacity = venue_data.capacity
    venue.refund_50_days_before = venue_data.refund_50_days_before
    venue.refund_25_days_before = venue_data.refund_25_days_before
    venue.cancel_cutoff_days_before = venue_data.cancel_cutoff_days_before
    venue.advance_percent = venue_data.advance_percent
    venue.allow_pay_at_venue = venue_data.allow_pay_at_venue

    # The gallery owns the cover image, so a venue with images ignores any
    # image_url in the payload and keeps mirroring its cover row instead.
    existing_images = sync_cover(db, venue)
    if not existing_images and venue_data.image_url:
        seed_gallery(db, venue, [venue_data.image_url])

    db.commit()
    return _fetch_full(db, venue_id)


def delete_venue(db: Session, venue_id: int, current_user: User):
    venue = db.query(Venue).filter(
        Venue.id == venue_id,
        Venue.owner_id == current_user.id,
    ).first()

    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")

    if venue.approval_status == "approved":
        raise HTTPException(
            status_code=400,
            detail="Approved venues cannot be hard deleted. Use deactivate instead.",
        )

    venue.amenities = []
    db.delete(venue)
    db.commit()
    return {"detail": "Venue deleted successfully"}


def deactivate_venue(db: Session, venue_id: int, current_user: User):
    venue = db.query(Venue).filter(
        Venue.id == venue_id,
        Venue.owner_id == current_user.id,
    ).first()

    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")

    if venue.approval_status != "approved":
        raise HTTPException(
            status_code=400,
            detail="Only approved venues can be deactivated. Delete pending/rejected venues instead.",
        )

    if not venue.is_active:
        raise HTTPException(status_code=400, detail="Venue is already deactivated")

    today = date.today()
    upcoming_bookings = (
        db.query(Booking)
        .filter(
            Booking.venue_id == venue_id,
            Booking.check_out_date >= today,
            Booking.status != "cancelled",
        )
        .all()
    )

    for booking in upcoming_bookings:
        booking.status = "cancelled"
        booking.cancellation_reason = "Venue deactivated by owner"
        booking.cancelled_at = datetime.now(timezone.utc)

        create_notification(
            db,
            user_id=booking.user_id,
            type="booking_cancelled",
            message=f"Your booking at {venue.name} has been cancelled because the venue is no longer available.",
            venue_id=venue.id,
            booking_id=booking.id,
        )

    venue.is_active = False
    db.commit()

    return {
        "detail": "Venue deactivated successfully",
        "cancelled_bookings": len(upcoming_bookings),
    }


def get_my_venues(db: Session, current_user: User):
    return (
        db.query(Venue)
        .options(
            joinedload(Venue.venue_type),
            joinedload(Venue.amenities),
            selectinload(Venue.images),
        )
        .filter(Venue.owner_id == current_user.id)
        .order_by(Venue.created_at.desc())
        .all()
    )
