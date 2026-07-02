import re
import uuid
from datetime import datetime, timezone
from decimal import Decimal, ROUND_HALF_EVEN
from uuid import UUID

from sqlalchemy.orm import Session, joinedload, selectinload

from app.core.exceptions import NotFoundError, ForbiddenError, ConflictError
from app.modules.venue.models import Venue, VenueCategory, VenueStatus, VenueAvailability, VenueBlockedDate, VenueCancellationPolicy, VenueAmenity, Amenity, VenuePhoto
from app.modules.venue.schemas import (
    CreateVenueRequest,
    UpdateVenueRequest,
    PricingPreviewResponse,
    PricingDisplay,
    PricingQuote,
    VenueAvailabilityUpdate,
    CreateBlockedDateRequest,
    UpdateCancellationPolicyRequest,
    UpdateVenueAmenitiesRequest,
    BulkUpdateVenuePhotosRequest,
)
from app.modules.booking.models import BookingType, Booking, BookingStatus
from app.modules.payment.models import LedgerEntry
from sqlalchemy import func
from app.core.storage import upload_image_to_cloudinary, delete_image_from_cloudinary


# Default platform commission

DEFAULT_PLATFORM_COMMISSION_PCT = Decimal("10.00")


# Internal helpers

def _get_venue_or_404(db: Session, venue_id: str | UUID) -> Venue:
    try:
        vid = UUID(str(venue_id))
        venue = db.query(Venue).filter(
            Venue.id == vid,
            Venue.deleted_at.is_(None),
        ).first()
    except ValueError:
        venue = db.query(Venue).filter(
            Venue.slug == str(venue_id),
            Venue.deleted_at.is_(None),
        ).first()

    if not venue:
        raise NotFoundError("Venue not found")
    return venue

# Acquire exclusive write lock on Venue to serialize slot check and creation
def _get_active_venue_or_404(
    db: Session,
    venue_id: str | UUID,
    *,
    for_update: bool = False,
) -> Venue:
    query = db.query(Venue).filter(
        Venue.status == VenueStatus.approved,
        Venue.is_active.is_(True),
        Venue.deleted_at.is_(None),
    )

    try:
        vid = UUID(str(venue_id))
        query = query.filter(Venue.id == vid)
    except ValueError:
        query = query.filter(Venue.slug == str(venue_id))

    if for_update:
        query = query.with_for_update()

    venue = query.first()

    if not venue:
        raise NotFoundError("Venue not found")

    return venue


def _assert_owner(venue: Venue, owner_id: UUID) -> None:
    if venue.owner_id != owner_id:
        raise ForbiddenError("You do not own this venue")


def _banker_round(value: Decimal) -> int:
    """Banker's rounding to nearest integer for financial precision."""
    return int(value.quantize(Decimal('1'), rounding=ROUND_HALF_EVEN))


def _format_inr(paise: int) -> str:
    rupees = paise / 100
    return f"₹{rupees:,.0f}"


def _generate_slug(db: Session, name: str) -> str:
    base_slug = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')
    if not base_slug:
        base_slug = "venue"
    
    slug = base_slug
    counter = 1
    while db.query(Venue).filter(Venue.slug == slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1
    return slug


# Public service functions

def get_venue_categories(db: Session) -> list[VenueCategory]:
    return (
        db.query(VenueCategory)
        .filter(VenueCategory.is_active.is_(True), VenueCategory.deleted_at.is_(None))
        .order_by(VenueCategory.sort_order.asc(), VenueCategory.label.asc())
        .all()
    )


def get_platform_amenities(db: Session) -> list[Amenity]:
    return db.query(Amenity).filter(Amenity.deleted_at.is_(None)).order_by(Amenity.name.asc()).all()

def get_venue(db: Session, identifier: str) -> Venue:
    try:
        venue_id = UUID(identifier)
        return _get_active_venue_or_404(db, venue_id)
    except ValueError:
        venue = db.query(Venue).filter(
            Venue.slug == identifier,
            Venue.status == VenueStatus.approved,
            Venue.is_active.is_(True),
            Venue.deleted_at.is_(None),
        ).first()
        if not venue:
            raise NotFoundError("Venue not found")
        return venue


def get_pricing_preview(
    db: Session,
    venue_id: UUID,
    starts_at: datetime,
    ends_at: datetime,
    booking_type: BookingType,
) -> PricingPreviewResponse:

    venue = _get_active_venue_or_404(db, venue_id)

    if ends_at <= starts_at:
        raise ConflictError("ends_at must be after starts_at")

    # ── Pricing Logic ─────────────────────────────────────
    if booking_type == BookingType.full_day:
        days = (ends_at.date() - starts_at.date()).days + 1
        base = venue.starting_price_paise or 0
        quoted_price_paise = base * days
        used_mode = "flat"  # full_day always uses base price (per day)

    elif booking_type == BookingType.time_slot:
        duration_seconds = (ends_at - starts_at).total_seconds()
        duration_hours = Decimal(str(duration_seconds)) / Decimal("3600")
        quoted_price_paise = _banker_round(
            Decimal(str(venue.hourly_rate_paise or 0)) * duration_hours
        )
        used_mode = "hourly"

    else:
        raise ConflictError(f"Invalid booking_type: {booking_type}")

    platform_fee_paise = _banker_round(
        Decimal(str(quoted_price_paise))
        * Decimal(str(venue.platform_commission_pct))
        / Decimal("100")
    )

    owner_payout_paise = quoted_price_paise - platform_fee_paise

    advance_due_paise = _banker_round(
        Decimal(str(quoted_price_paise))
        * Decimal(str(venue.advance_pct))
        / Decimal("100")
    )

    balance_due_paise = quoted_price_paise - advance_due_paise

    return PricingPreviewResponse(
        pricing_mode=used_mode,  
        quoted_price_paise=quoted_price_paise,
        platform_commission_pct=float(venue.platform_commission_pct),
        platform_fee_paise=platform_fee_paise,
        owner_payout_paise=owner_payout_paise,
        advance_pct=float(venue.advance_pct),
        advance_due_paise=advance_due_paise,
        balance_due_paise=balance_due_paise,
        display=PricingDisplay(
            quoted_price=_format_inr(quoted_price_paise),
            advance_due=_format_inr(advance_due_paise),
            balance_due=_format_inr(balance_due_paise),
            platform_fee=_format_inr(platform_fee_paise),
            owner_payout=_format_inr(owner_payout_paise),
        ),
    )


# Owner service functions

def list_owner_venues(db: Session, owner_id: UUID) -> list[Venue]:
 
    return (
        db.query(Venue)
        .options(
            joinedload(Venue.category),
            selectinload(Venue.photos),
            selectinload(Venue.amenities),
            joinedload(Venue.cancellation_policy)
        )
        .filter(
            Venue.owner_id == owner_id,
            Venue.deleted_at.is_(None),
        )
        .order_by(Venue.created_at.desc())
        .all()
    )


def get_owner_venue(db: Session, venue_id: UUID, owner_id: UUID) -> Venue:
    venue = (
        db.query(Venue)
        .options(
            joinedload(Venue.category),
            selectinload(Venue.photos),
            selectinload(Venue.amenities),
            joinedload(Venue.cancellation_policy)
        )
        .filter(
            Venue.id == venue_id,
            Venue.owner_id == owner_id,
            Venue.deleted_at.is_(None),
        )
        .first()
    )
    if not venue:
        raise NotFoundError("Venue not found")
    return venue


def _get_category_or_400(db: Session, category_id: UUID) -> VenueCategory:
    cat = db.query(VenueCategory).filter(
        VenueCategory.id == category_id,
        VenueCategory.is_active.is_(True),
        VenueCategory.deleted_at.is_(None),
    ).first()
    if not cat:
        raise ConflictError("Invalid or inactive category")
    return cat


def create_venue(db: Session, owner_id: UUID, body: CreateVenueRequest) -> Venue:

    _get_category_or_400(db, body.category_id)

    venue = Venue(
        id=uuid.uuid4(),
        owner_id=owner_id,

        name=body.name,
        slug=_generate_slug(db, body.name),
        description=body.description,
        category_id=body.category_id,

        
        address_line1=body.address_line1,
        address_line2=body.address_line2,
        city=body.city,
        state=body.state,
        country=body.country,
        postal_code=body.postal_code,
        latitude=body.latitude,
        longitude=body.longitude,
        timezone=body.timezone,

        
        min_capacity=body.min_capacity,
        max_capacity=body.max_capacity,

        
        open_time=body.open_time,
        close_time=body.close_time,
        spans_next_day=body.spans_next_day,

        
        allowed_booking_types=[bt.value for bt in body.allowed_booking_types],
        min_booking_duration_minutes=body.min_booking_duration_minutes,
        max_booking_duration_minutes=body.max_booking_duration_minutes,
        slot_interval_minutes=body.slot_interval_minutes,

       
        pre_buffer_minutes=body.pre_buffer_minutes,
        post_buffer_minutes=body.post_buffer_minutes,

        
        pricing_mode=body.pricing_mode.value,
        starting_price_paise=body.starting_price_paise,
        hourly_rate_paise=body.hourly_rate_paise,

        
        platform_commission_pct=DEFAULT_PLATFORM_COMMISSION_PCT,

       
        advance_pct=body.advance_pct,
        balance_due_days_before_event=body.balance_due_days_before_event,
        owner_action_window_hours=body.owner_action_window_hours,
        overdue_advance_refund_pct=body.overdue_advance_refund_pct,

        
        status=VenueStatus.draft,

        last_completed_step=body.last_completed_step,
        
        is_active=True,
    )

    db.add(venue)
    db.flush()

    if body.cancellation_policy:
        policy = VenueCancellationPolicy(
            id=uuid.uuid4(),
            venue_id=venue.id,
            tier_1_hours=body.cancellation_policy.tier_1_hours,
            tier_1_refund_pct=body.cancellation_policy.tier_1_refund_pct,
            tier_2_hours=body.cancellation_policy.tier_2_hours,
            tier_2_refund_pct=body.cancellation_policy.tier_2_refund_pct,
            tier_3_hours=body.cancellation_policy.tier_3_hours,
            tier_3_refund_pct=body.cancellation_policy.tier_3_refund_pct,
            no_show_refund_pct=body.cancellation_policy.no_show_refund_pct,
            platform_fee_refundable=body.cancellation_policy.platform_fee_refundable,
            notes=body.cancellation_policy.notes,
        )
        db.add(policy)

    if body.amenity_ids:
        valid_amenities = db.query(Amenity).filter(
            Amenity.id.in_(body.amenity_ids),
            Amenity.deleted_at.is_(None),
        ).all()
        if len(valid_amenities) != len(set(body.amenity_ids)):
            raise ConflictError("One or more amenity IDs provided do not exist in the platform.")

        new_links = [VenueAmenity(venue_id=venue.id, amenity_id=am_id) for am_id in set(body.amenity_ids)]
        db.add_all(new_links)

    db.commit()
    db.refresh(venue)

    from app.modules.search.indexer import enqueue_job
    enqueue_job(db, venue.id, "create")

    return venue


def update_venue(
    db: Session,
    venue_id: UUID,
    owner_id: UUID,
    body: UpdateVenueRequest,
) -> Venue:
    
    venue = _get_venue_or_404(db, venue_id)
    _assert_owner(venue, owner_id)

    update_data = body.model_dump(exclude_unset=True)

    if "category_id" in update_data and update_data["category_id"] is not None:
        _get_category_or_400(db, update_data["category_id"])

    for field, value in update_data.items():
        
        if hasattr(value, "value"):
            value = value.value
        
        if isinstance(value, list) and value and hasattr(value[0], "value"):
            value = [item.value for item in value]
        setattr(venue, field, value)

    if venue.pricing_mode == "flat":
        if venue.starting_price_paise is None:
            raise ConflictError("starting_price_paise is required when pricing_mode is 'flat'")
        if venue.hourly_rate_paise is not None:
            raise ConflictError("hourly_rate_paise must be null when pricing_mode is 'flat'")
    elif venue.pricing_mode == "hourly":
        if venue.hourly_rate_paise is None:
            raise ConflictError("hourly_rate_paise is required when pricing_mode is 'hourly'")
        if venue.starting_price_paise is not None:
            raise ConflictError("starting_price_paise must be null when pricing_mode is 'hourly'")
    elif venue.pricing_mode == "mixed":
        if venue.starting_price_paise is None or venue.hourly_rate_paise is None:
            raise ConflictError("Both starting_price_paise and hourly_rate_paise are required when pricing_mode is 'mixed'")

    if venue.min_capacity is not None and venue.min_capacity > venue.max_capacity:
        raise ConflictError("min_capacity cannot exceed max_capacity")
    if venue.min_booking_duration_minutes > venue.max_booking_duration_minutes:
        raise ConflictError("min_booking_duration_minutes cannot exceed max_booking_duration_minutes")

    db.commit()
    db.refresh(venue)

    from app.modules.search.indexer import enqueue_job
    enqueue_job(db, venue.id, "update")

    return venue


def delete_venue(db: Session, venue_id: UUID, owner_id: UUID) -> None:

    venue = _get_venue_or_404(db, venue_id)
    _assert_owner(venue, owner_id)

    if venue.status not in (VenueStatus.draft, VenueStatus.rejected, VenueStatus.suspended):
        raise ConflictError(
            f"Venue cannot be deleted in status '{venue.status.value}'. "
            "Only draft, rejected, or suspended venues can be deleted."
        )

    venue.deleted_at = datetime.now(timezone.utc)
    db.commit()


def submit_venue(db: Session, venue_id: UUID, owner_id: UUID) -> Venue:
    
    venue = _get_venue_or_404(db, venue_id)
    _assert_owner(venue, owner_id)

    allowed_from = (VenueStatus.draft, VenueStatus.rejected)
    if venue.status not in allowed_from:
        raise ConflictError(
            f"Cannot submit venue in status '{venue.status.value}'. "
            "Only draft or rejected venues can be submitted for review."
        )

    venue.status = VenueStatus.pending_approval
    db.commit()
    db.refresh(venue)
    return venue


def get_venue_availability(db: Session, venue_id: UUID) -> list[VenueAvailability]:
    _get_active_venue_or_404(db, venue_id)
    return (
        db.query(VenueAvailability)
        .filter(
            VenueAvailability.venue_id == venue_id,
            VenueAvailability.deleted_at.is_(None),
        )
        .order_by(VenueAvailability.day_of_week.asc())
        .all()
    )


def bulk_update_availability(
    db: Session,
    venue_id: UUID,
    owner_id: UUID,
    availabilities: list[VenueAvailabilityUpdate],
) -> list[VenueAvailability]:
    
    venue = _get_venue_or_404(db, venue_id)
    _assert_owner(venue, owner_id)

    now = datetime.now(timezone.utc)
    db.query(VenueAvailability).filter(
        VenueAvailability.venue_id == venue_id,
        VenueAvailability.deleted_at.is_(None)
    ).update({"deleted_at": now}, synchronize_session=False)

    new_records = []
    for item in availabilities:
        new_record = VenueAvailability(
            id=uuid.uuid4(),
            venue_id=venue_id,
            day_of_week=item.day_of_week,
            is_available=item.is_available,
            opens_at=item.opens_at,
            closes_at=item.closes_at,
            spans_next_day=item.spans_next_day,
        )
        db.add(new_record)
        new_records.append(new_record)

    db.commit()
    for rec in new_records:
        db.refresh(rec)
    return sorted(new_records, key=lambda x: x.day_of_week)


def get_venue_blocked_dates(db: Session, venue_id: UUID) -> list[VenueBlockedDate]:
    _get_active_venue_or_404(db, venue_id)
    now = datetime.now(timezone.utc)
    return (
        db.query(VenueBlockedDate)
        .filter(
            VenueBlockedDate.venue_id == venue_id,
            VenueBlockedDate.deleted_at.is_(None),
            VenueBlockedDate.ends_at > now,
        )
        .order_by(VenueBlockedDate.starts_at.asc())
        .all()
    )


def create_blocked_date(
    db: Session,
    venue_id: UUID,
    owner_id: UUID,
    body: CreateBlockedDateRequest,
) -> VenueBlockedDate:
    venue = _get_venue_or_404(db, venue_id)
    _assert_owner(venue, owner_id)

    new_block = VenueBlockedDate(
        id=uuid.uuid4(),
        venue_id=venue_id,
        starts_at=body.starts_at,
        ends_at=body.ends_at,
        reason=body.reason,
        blocked_by=owner_id,
    )
    db.add(new_block)
    db.commit()
    db.refresh(new_block)
    return new_block


def delete_blocked_date(db: Session, venue_id: UUID, blocked_id: UUID, owner_id: UUID) -> None:
    venue = _get_venue_or_404(db, venue_id)
    _assert_owner(venue, owner_id)

    blocked_date = db.query(VenueBlockedDate).filter(
        VenueBlockedDate.id == blocked_id,
        VenueBlockedDate.venue_id == venue_id,
        VenueBlockedDate.deleted_at.is_(None),
    ).first()

    if not blocked_date:
        raise NotFoundError("Blocked date not found")

    blocked_date.deleted_at = datetime.now(timezone.utc)
    db.commit()


def get_venue_cancellation_policy(db: Session, venue_id: UUID) -> VenueCancellationPolicy:
    _get_active_venue_or_404(db, venue_id)
    policy = db.query(VenueCancellationPolicy).filter(
        VenueCancellationPolicy.venue_id == venue_id
    ).first()
    
    if not policy:
        raise NotFoundError("Cancellation policy not found for this venue")
    
    return policy


def put_venue_cancellation_policy(
    db: Session,
    venue_id: UUID,
    owner_id: UUID,
    body: UpdateCancellationPolicyRequest,
) -> VenueCancellationPolicy:
    venue = _get_venue_or_404(db, venue_id)
    _assert_owner(venue, owner_id)

    policy = db.query(VenueCancellationPolicy).filter(
        VenueCancellationPolicy.venue_id == venue_id
    ).first()

    if not policy:
        policy = VenueCancellationPolicy(
            id=uuid.uuid4(),
            venue_id=venue_id,
        )
        db.add(policy)

    policy.tier_1_hours = body.tier_1_hours
    policy.tier_1_refund_pct = body.tier_1_refund_pct
    policy.tier_2_hours = body.tier_2_hours
    policy.tier_2_refund_pct = body.tier_2_refund_pct
    policy.tier_3_hours = body.tier_3_hours
    policy.tier_3_refund_pct = body.tier_3_refund_pct
    policy.no_show_refund_pct = body.no_show_refund_pct
    policy.platform_fee_refundable = body.platform_fee_refundable
    policy.notes = body.notes

    db.commit()
    db.refresh(policy)
    return policy


def update_venue_amenities(
    db: Session,
    venue_id: UUID,
    owner_id: UUID,
    body: UpdateVenueAmenitiesRequest,
) -> list[Amenity]:
    venue = _get_venue_or_404(db, venue_id)
    _assert_owner(venue, owner_id)

    if body.amenity_ids:
        valid_amenities = db.query(Amenity).filter(
            Amenity.id.in_(body.amenity_ids),
            Amenity.deleted_at.is_(None),
        ).all()
        if len(valid_amenities) != len(set(body.amenity_ids)):
            raise ConflictError("One or more amenity IDs provided do not exist in the platform.")

    db.query(VenueAmenity).filter(VenueAmenity.venue_id == venue_id).delete(synchronize_session=False)

    new_links = []
    for am_id in set(body.amenity_ids):
        new_links.append(VenueAmenity(venue_id=venue_id, amenity_id=am_id))
    
    if new_links:
        db.add_all(new_links)
        
    db.commit()
    db.refresh(venue)
    return venue.amenities


def add_venue_photo(
    db: Session,
    venue_id: UUID,
    owner_id: UUID,
    file_bytes: bytes,
) -> VenuePhoto:
    venue = _get_venue_or_404(db, venue_id)
    _assert_owner(venue, owner_id)

   
    image_url = upload_image_to_cloudinary(file_bytes, folder=f"venues/{venue_id}")

    
    existing_photos = db.query(VenuePhoto).filter(
        VenuePhoto.venue_id == venue_id,
        VenuePhoto.deleted_at.is_(None)
    ).all()

    sort_order = len(existing_photos)
    is_cover = True if sort_order == 0 else False

    photo = VenuePhoto(
        id=uuid.uuid4(),
        venue_id=venue_id,
        image_url=image_url,
        sort_order=sort_order,
        is_cover=is_cover
    )
    db.add(photo)
    db.commit()
    db.refresh(photo)
    return photo


def bulk_update_venue_photos(
    db: Session,
    venue_id: UUID,
    owner_id: UUID,
    body: BulkUpdateVenuePhotosRequest,
) -> list[VenuePhoto]:
    venue = _get_venue_or_404(db, venue_id)
    _assert_owner(venue, owner_id)

    cover_count = sum(1 for p in body.photos if p.is_cover)
    if cover_count != 1:
        raise ConflictError("Exactly one photo must be marked as the cover photo.")

    photo_ids_in_request = {p.photo_id for p in body.photos}
    
    
    existing_photos = db.query(VenuePhoto).filter(
        VenuePhoto.venue_id == venue_id,
        VenuePhoto.deleted_at.is_(None)
    ).all()

    existing_photo_map = {p.id: p for p in existing_photos}

    if len(photo_ids_in_request) != len(existing_photos):
        raise ConflictError("The request must include all active photos for this venue.")

    for p_id in photo_ids_in_request:
        if p_id not in existing_photo_map:
            raise NotFoundError(f"Photo with ID {p_id} not found in this venue")

    
    
    for photo in existing_photos:
        photo.is_cover = False
    db.flush()

    
    for item in body.photos:
        photo = existing_photo_map[item.photo_id]
        photo.sort_order = item.sort_order
        photo.is_cover = item.is_cover

    db.commit()

    return sorted(existing_photos, key=lambda p: p.sort_order)


def delete_venue_photo(db: Session, venue_id: UUID, photo_id: UUID, owner_id: UUID) -> None:
    venue = _get_venue_or_404(db, venue_id)
    _assert_owner(venue, owner_id)

    photo = db.query(VenuePhoto).filter(
        VenuePhoto.id == photo_id,
        VenuePhoto.venue_id == venue_id,
        VenuePhoto.deleted_at.is_(None)
    ).first()

    if not photo:
        raise NotFoundError("Photo not found")

    photo.deleted_at = datetime.now(timezone.utc)

    if photo.is_cover:
        photo.is_cover = False
        next_photo = db.query(VenuePhoto).filter(
            VenuePhoto.venue_id == venue_id,
            VenuePhoto.id != photo_id,
            VenuePhoto.deleted_at.is_(None)
        ).order_by(VenuePhoto.sort_order.asc()).first()

        if next_photo:
            next_photo.is_cover = True
            db.add(next_photo)

    db.commit()


def get_pricing_quote(
    db: Session,
    venue_id: UUID,
    starts_at: datetime,
    ends_at: datetime,
    booking_type: BookingType,
) -> PricingQuote:

    preview = get_pricing_preview(
        db=db,
        venue_id=venue_id,
        starts_at=starts_at,
        ends_at=ends_at,
        booking_type=booking_type,
    )

    return PricingQuote(
        quoted_price_paise=preview.quoted_price_paise,
        platform_commission_pct=preview.platform_commission_pct,
        platform_fee_paise=preview.platform_fee_paise,
        owner_payout_paise=preview.owner_payout_paise,
        advance_pct=preview.advance_pct,
        advance_due_paise=preview.advance_due_paise,
        balance_due_paise=preview.balance_due_paise,
        pricing_mode=preview.pricing_mode,
    )


def get_pricing_quote_for_slot(
    db: Session,
    venue_id: UUID,
    starts_at: datetime,
    ends_at: datetime,
    booking_type: str,
) -> PricingQuote:
    """
    Get pricing quote for a booking slot.
    For use by availability and booking modules.
    """

    return get_pricing_quote(
        db=db,
        venue_id=venue_id,
        starts_at=starts_at,
        ends_at=ends_at,
        booking_type=BookingType(booking_type),
    )

def get_venue_stats_this_month(db: Session, venue_id: UUID, owner_id: UUID) -> dict:
    venue = _get_venue_or_404(db, venue_id)
    if venue.owner_id != owner_id:
        raise ForbiddenError("Not your venue")

    now = datetime.now(timezone.utc)
    start_of_month = datetime(now.year, now.month, 1, tzinfo=timezone.utc)

    from app.modules.booking.models import BookingSlot

    active_bookings = (
        db.query(func.count(Booking.id))
        .join(Booking.slot)
        .filter(
            Booking.venue_id == venue_id,
            BookingSlot.ends_at >= now,
            Booking.status == BookingStatus.confirmed
        )
        .scalar() or 0
    )

    ledger_rows = (
        db.query(
            LedgerEntry.entry_type,
            LedgerEntry.direction,
            func.sum(LedgerEntry.amount_paise).label("total"),
        )
        .filter(
            LedgerEntry.venue_id == venue_id,
            LedgerEntry.created_at >= start_of_month,
        )
        .group_by(LedgerEntry.entry_type, LedgerEntry.direction)
        .all()
    )

    gross_volume = 0
    platform_fees = 0
    refunds_issued = 0

    for entry_type, direction, total in ledger_rows:
        val = int(total or 0)
        if entry_type == "charge" and direction == "credit":
            gross_volume += val
        elif entry_type == "platform_fee" and direction == "debit":
            platform_fees += val
        elif entry_type == "refund" and direction == "debit":
            refunds_issued += val

    net_revenue = gross_volume - platform_fees - refunds_issued

    return {
        "active_bookings": active_bookings,
        "revenue_this_month_paise": net_revenue
    }
