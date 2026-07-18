from __future__ import annotations
from fastapi import APIRouter, HTTPException, Depends, status, Query
from typing import Annotated
from sqlalchemy import select, desc
from sqlalchemy.orm import Session, selectinload
from schemas.booking import BookingCreate, BookingOut, BookingStatusUpdate, BookingStatusEnum, PaymentEnum, BookingStatusEnum
from models.user import User, RoleEnum
from models.booking import Booking
from models.booking_slot import BookingSlot
from models.availability import Availability, Venue
from config import TAX_PERCENT, PLATFORM_FEE


from utils.dependencies import require_role
from database import get_db


router = APIRouter()


@router.post(
    "/",
    response_model=BookingOut,
    status_code=status.HTTP_200_OK
)
def create_booking(
        booking_create: BookingCreate,
        db: Annotated[Session, Depends(get_db)],
        current_user: Annotated[User, Depends(require_role(RoleEnum.BOOKER))]):

    availability_ids = list(set(booking_create.availability_ids))

    availability_rows = db.execute(select(Availability).where(
        Availability.id.in_(availability_ids))).scalars().all()

    if len(availability_rows) != len(availability_ids):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="One or more invalid availability slots"
        )
    venue_ids = {slot.venue_id for slot in availability_rows}
    if len(venue_ids) > 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="All slots must belong to the same venue"
        )

    slot_venue_id = next(iter(venue_ids))
    if slot_venue_id != booking_create.venue_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Slot venue does not match provided venue"
        )

    slot_type = {slot.booking_type for slot in availability_rows}
    if len(slot_type) > 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="All slots must be of the same booking type"
        )

    already_booked = any(slot.is_booked for slot in availability_rows)
    if already_booked:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="One or more slots are already booked"
        )

    current_venue = db.execute(select(Venue).where(
        Venue.id == booking_create.venue_id)).scalars().first()
    if not current_venue:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Venue not found"
        )

    booking_type = next(iter(slot_type))

    if hasattr(booking_type, "value"):
        booking_type_value = booking_type.value
    else:
        booking_type_value = booking_type

    number_of_slots = len(availability_ids)

    base_price = 0
    if booking_type_value == "hourly":
        base_price = current_venue.hourly_price * number_of_slots

    elif booking_type_value == "daily":
        base_price = current_venue.daily_price * number_of_slots

    tax_amount = base_price * (TAX_PERCENT/100)
    platform_fee = PLATFORM_FEE
    total_amount = base_price + tax_amount + platform_fee

    try:
        for slot in availability_rows:
            slot.is_booked = True

        new_booking = Booking(
            venue_id=booking_create.venue_id,
            booker_id=current_user.id,
            booking_type=booking_type,
            base_price=base_price,
            tax_amount=tax_amount,
            platform_fee=platform_fee,
            total_amount=total_amount,
            status=BookingStatusEnum.PENDING,
            payment_status=PaymentEnum.UNPAID,
        )
        db.add(new_booking)
        db.flush()

        for availability_id in availability_ids:
            new_booking_slot = BookingSlot(
                booking_id=new_booking.id,
                availability_id=availability_id
            )
            db.add(new_booking_slot)
        db.commit()
        db.refresh(new_booking)

        return new_booking

    except Exception as e:
        db.rollback()
        raise


@router.get(
    "/my",
    response_model=list[BookingOut],
    status_code=status.HTTP_200_OK
)
def get_my_bookings(db: Annotated[Session, Depends(get_db)],
                    current_user: Annotated[User, Depends(require_role(RoleEnum.BOOKER))]):

    all_bookings = db.execute(
        select(Booking)
        .options(
            selectinload(Booking.slots).selectinload(BookingSlot.availability),
            selectinload(Booking.venue)
        )
        .where(Booking.booker_id == current_user.id)
        .order_by(desc(Booking.created_at))
    ).scalars().all()
    return all_bookings


@router.get(
    "/owner",
    response_model=list[BookingOut],
    status_code=status.HTTP_200_OK
)
def get_owner_bookings(db: Annotated[Session, Depends(get_db)],
                       current_user: Annotated[User, Depends(require_role(RoleEnum.OWNER))]):
    owned_venue_ids = db.execute(select(Venue.id)
                                 .where(Venue.owner_id == current_user.id)
                                 ).scalars().all()
    if not owned_venue_ids:
        return []

    owner_bookings = db.execute(select(Booking)
                                .options(
        selectinload(Booking.slots).selectinload(
            BookingSlot.availability),
        selectinload(Booking.venue),
        selectinload(Booking.booker)
    )
        .where(Booking.venue_id.in_(list(owned_venue_ids)))
        .order_by(desc(Booking.created_at))
    ).scalars().all()

    return owner_bookings


@router.put(
    "/{id}/status",
    response_model=BookingOut,
    status_code=status.HTTP_200_OK
)
def booking_status_update(id: int,
                          booking_status_update: BookingStatusUpdate,
                          db: Annotated[Session, Depends(get_db)],
                          current_user: Annotated[User, Depends(require_role(RoleEnum.OWNER))]):

    current_booking = db.execute(select(Booking)
                                 .options(
                                     selectinload(Booking.slots).selectinload(
                                         BookingSlot.availability),
                                     selectinload(Booking.venue),
                                     selectinload(Booking.booker),
    )
        .where(Booking.id == id)).scalars().first()

    if not current_booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )

    booked_venue = current_booking.venue

    if not booked_venue:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No Venue associated with this booking"
        )
    if booked_venue.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Venue is not owned by logged in user"
        )
    if current_booking.status in (BookingStatusEnum.CONFIRMED, BookingStatusEnum.REJECTED):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Booking already finalized"
        )

    current_booking.status = booking_status_update.status

    if booking_status_update.status == BookingStatusEnum.REJECTED:
        for slot in current_booking.slots:
            if slot.availability:
                slot.availability.is_booked = False

    db.commit()
    db.refresh(current_booking)
    return current_booking
