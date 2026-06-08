from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from pydantic import BaseModel
from core.database import get_db
from models.user import User
from models.venue import Venue, Booking
from schemas.user import UserResponse, UserUpdate
from schemas.venue import VenueResponse, BookingResponse
from core.security import get_password_hash
from api.dependencies import get_current_super_admin

router = APIRouter()

class VenueModerationReq(BaseModel):
    status: str



@router.get("/users", response_model=List[UserResponse])
async def list_users(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_super_admin),
):
    result = await db.execute(select(User))
    users = result.scalars().all()
    return users


@router.put("/users/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: int,
    user_req: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_super_admin),
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    update_data = user_req.model_dump(exclude_unset=True)
    if "password" in update_data and update_data["password"]:
        user.hashed_password = get_password_hash(update_data.pop("password"))

    for key, value in update_data.items():
        setattr(user, key, value)

    await db.commit()
    await db.refresh(user)
    return user


@router.delete("/users/{user_id}")
async def delete_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_super_admin),
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    await db.delete(user)
    await db.commit()
    return {"message": "User deleted"}


@router.get("/bookings", response_model=List[BookingResponse])
async def list_bookings(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_super_admin),
):
    result = await db.execute(select(Booking))
    bookings = result.scalars().all()
    return bookings


@router.get("/venues", response_model=List[VenueResponse])
async def list_all_venues(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_super_admin),
):
    result = await db.execute(select(Venue))
    venues = result.scalars().all()
    return venues


@router.delete("/venues/{venue_id}")
async def delete_venue(
    venue_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_super_admin),
):
    result = await db.execute(select(Venue).where(Venue.id == venue_id))
    venue = result.scalar_one_or_none()
    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")
    await db.delete(venue)
    await db.commit()
    return {"message": "Venue deleted"}

@router.put("/venues/{venue_id}/moderate", response_model=VenueResponse)
async def moderate_venue(
    venue_id: int,
    mod_req: VenueModerationReq,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_super_admin),
):
    result = await db.execute(select(Venue).where(Venue.id == venue_id))
    venue = result.scalar_one_or_none()
    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")

    valid_statuses = ["APPROVED", "REJECTED", "PENDING"]
    new_status = mod_req.status.upper()
    if new_status not in valid_statuses:
        raise HTTPException(status_code=400, detail="Invalid status")

    venue.status = new_status
    await db.commit()
    await db.refresh(venue)
    return venue
