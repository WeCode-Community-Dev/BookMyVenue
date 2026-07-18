from datetime import date as date_type, datetime, UTC
from fastapi import APIRouter, status, Depends, HTTPException
from typing import Annotated
from sqlalchemy.orm import Session
from sqlalchemy import select, and_
from schemas.availability import AvailabilityOut, AvailabilityCreate, BookingTypeEnum, AvailabilityByDateResponse
from models.user import User, RoleEnum
from models.venue import Venue
from models.availability import Availability
from utils.dependencies import require_role
from database import get_db


router = APIRouter()


@router.post(
    "/",
    response_model=list[AvailabilityOut],
    status_code=status.HTTP_201_CREATED
)
def availability_create(
    create_availability: AvailabilityCreate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(require_role(RoleEnum.OWNER))]
):

    venue_query = db.execute(select(Venue).where(
        Venue.id == create_availability.venue_id)).scalars().first()

    if not venue_query:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Venue not found"
        )

    if venue_query.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )

    if create_availability.booking_type == BookingTypeEnum.HOURLY and not venue_query.supports_hourly:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This venue does not support hourly booking"
        )

    if create_availability.booking_type == BookingTypeEnum.DAILY and not venue_query.supports_daily:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This venue does not support daily booking"
        )

    # For daily: check if same date and daily type already exists
    if create_availability.booking_type == BookingTypeEnum.DAILY:
        already_exists = db.execute(select(Availability).where(
            Availability.venue_id == create_availability.venue_id,
            Availability.date == create_availability.date,
            Availability.booking_type == BookingTypeEnum.DAILY.value
        )).scalars().first()
        if already_exists:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Daily availability already set for this date"
            )

    # For hourly: check if any of the time slots overlap with existing ones
    if create_availability.booking_type == BookingTypeEnum.HOURLY and create_availability.slots:
        existing_slots = db.execute(select(Availability).where(
            Availability.venue_id == create_availability.venue_id,
            Availability.date == create_availability.date,
            Availability.booking_type == BookingTypeEnum.HOURLY.value
        )).scalars().all()

        for new_slot in create_availability.slots:
            for existing in existing_slots:
                if existing.start_time and existing.end_time and new_slot.start_time and new_slot.end_time:
                    # Check overlap: existing start < new end AND existing end > new start
                    if existing.start_time < new_slot.end_time and existing.end_time > new_slot.start_time:
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Time slot {new_slot.start_time}-{new_slot.end_time} overlaps with existing slot {existing.start_time}-{existing.end_time}"
                        )

    new_availability = []

    if create_availability.booking_type == BookingTypeEnum.DAILY:
        new_availability.append(
            Availability(
                venue_id=create_availability.venue_id,
                date=create_availability.date,
                booking_type=create_availability.booking_type.value,
                start_time=None,
                end_time=None
            )
        )
    elif create_availability.booking_type == BookingTypeEnum.HOURLY:
        if create_availability.slots is not None:
            for slot in create_availability.slots:
                new_availability.append(
                    Availability(
                        venue_id=create_availability.venue_id,
                        date=create_availability.date,
                        booking_type=create_availability.booking_type.value,
                        start_time=slot.start_time,
                        end_time=slot.end_time
                    )
                )
    db.add_all(new_availability)
    db.commit()

    for row in new_availability:
        db.refresh(row)

    return new_availability


@router.delete(
    "/{availability_id}",
    status_code=status.HTTP_200_OK
)
def delete_availability(
    availability_id: int,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(require_role(RoleEnum.OWNER))]
):
    availability = db.execute(select(Availability).where(
        Availability.id == availability_id
    )).scalars().first()

    if not availability:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Availability not found"
        )

    venue = db.execute(select(Venue).where(
        Venue.id == availability.venue_id
    )).scalars().first()

    if not venue or venue.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )

    if availability.is_booked:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete a booked availability slot"
        )

    db.delete(availability)
    db.commit()

    return {"message": "Availability deleted"}


@router.get(
    "/{venue_id}",
    response_model=list[AvailabilityByDateResponse],
    status_code=status.HTTP_200_OK
)
def get_availability(
    venue_id: int,
    db: Annotated[Session, Depends(get_db)],
    date: date_type | None = None
):

    venue = db.execute(select(Venue).where(
        Venue.id == venue_id)).scalars().first()

    if not venue:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Venue not found"
        )

    query = select(Availability).where(Availability.venue_id == venue_id)

    if date is not None:
        query = query.where(Availability.date == date)
    elif date is None:
        today = datetime.now(UTC).date()
        query = query.where(Availability.date >= today)

    query = query.order_by(
        Availability.date.asc(),
        Availability.start_time.asc()
    )

    availabilities = db.execute(query).scalars().all()

    grouped = {}

    for availability in availabilities:
        key = (availability.date, availability.booking_type)

        if key not in grouped:
            grouped[key] = {
                "date": availability.date,
                "booking_type": availability.booking_type,
                "slots": []
            }
        grouped[key]["slots"].append(availability)

    return list(grouped.values())
