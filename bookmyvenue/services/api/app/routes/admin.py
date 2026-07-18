from sqlalchemy import select, desc, func
from sqlalchemy.orm import Session, selectinload
from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import Annotated

from database import get_db
from models.user import User, RoleEnum
from models.venue import Venue, StatusEnum, VenueCategory
from schemas.venue import VenueCategoryOut, VenueOut
from schemas.auth import UserOut
from schemas.booking import BookingOut
from models.booking import Booking, BookingStatusEnum, BookingTypeEnum, PaymentEnum
from models.booking_slot import BookingSlot
from schemas.admin import VenueStatusUpdate, CategoryStatusUpdate, PaginatedResponse
from utils.dependencies import require_role

DEFAULT_PAGE = 1
DEFAULT_LIMIT = 20

router = APIRouter()


def paginated_response(items, total, page, limit):
    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": (total + limit - 1) // limit,
    }


@router.get("/stats", status_code=status.HTTP_200_OK)
def get_admin_stats(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(require_role(RoleEnum.ADMIN))],
):
    total_users = db.execute(select(func.count(User.id))).scalar_one()
    total_owners = db.execute(
        select(func.count(User.id)).where(User.role == RoleEnum.OWNER.value)
    ).scalar_one()
    total_bookers = db.execute(
        select(func.count(User.id)).where(User.role == RoleEnum.BOOKER.value)
    ).scalar_one()

    total_venues = db.execute(select(func.count(Venue.id))).scalar_one()
    active_venues = db.execute(
        select(func.count(Venue.id)).where(
            Venue.status == StatusEnum.ACTIVE.value)
    ).scalar_one()

    total_bookings = db.execute(select(func.count(Booking.id))).scalar_one()
    hourly_bookings = db.execute(
        select(func.count(Booking.id)).where(
            Booking.booking_type == BookingTypeEnum.HOURLY.value)
    ).scalar_one()
    daily_bookings = db.execute(
        select(func.count(Booking.id)).where(
            Booking.booking_type == BookingTypeEnum.DAILY.value)
    ).scalar_one()
    pending_bookings = db.execute(
        select(func.count(Booking.id)).where(
            Booking.status == BookingStatusEnum.PENDING.value)
    ).scalar_one()
    confirmed_bookings = db.execute(
        select(func.count(Booking.id)).where(
            Booking.status == BookingStatusEnum.CONFIRMED.value)
    ).scalar_one()
    rejected_bookings = db.execute(
        select(func.count(Booking.id)).where(
            Booking.status == BookingStatusEnum.REJECTED.value)
    ).scalar_one()

    total_revenue = db.execute(
        select(func.coalesce(func.sum(Booking.total_amount), 0)).where(
            Booking.status == BookingStatusEnum.CONFIRMED.value)
    ).scalar_one()
    paid_count = db.execute(
        select(func.count(Booking.id)).where(
            Booking.payment_status == PaymentEnum.PAID.value)
    ).scalar_one()
    unpaid_count = db.execute(
        select(func.count(Booking.id)).where(
            Booking.payment_status == PaymentEnum.UNPAID.value)
    ).scalar_one()

    return {
        "total_users": total_users,
        "total_owners": total_owners,
        "total_bookers": total_bookers,
        "total_venues": total_venues,
        "active_venues": active_venues,
        "total_bookings": total_bookings,
        "hourly_bookings": hourly_bookings,
        "daily_bookings": daily_bookings,
        "pending_bookings": pending_bookings,
        "confirmed_bookings": confirmed_bookings,
        "rejected_bookings": rejected_bookings,
        "total_revenue": float(total_revenue),
        "paid_bookings": paid_count,
        "unpaid_bookings": unpaid_count,
    }


@router.get("/users", status_code=status.HTTP_200_OK)
def get_all_users(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(require_role(RoleEnum.ADMIN))],
    role: str | None = Query(default=None),
    page: int = Query(default=DEFAULT_PAGE, ge=1),
    limit: int = Query(default=DEFAULT_LIMIT, ge=1, le=100),
):
    q = select(User).order_by(User.created_at.desc())
    if role:
        q = q.where(User.role == role)
    total = db.execute(select(func.count()).select_from(User).where(
        *([User.role == role] if role else []))).scalar_one()
    offset = (page - 1) * limit
    users = db.execute(q.offset(offset).limit(limit)).scalars().all()
    return paginated_response([UserOut.model_validate(u) for u in users], total, page, limit)


@router.get("/venues", status_code=status.HTTP_200_OK)
def get_all_venues(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(require_role(RoleEnum.ADMIN))],
    venue_status: StatusEnum | None = Query(default=None, alias="status"),
    page: int = Query(default=DEFAULT_PAGE, ge=1),
    limit: int = Query(default=DEFAULT_LIMIT, ge=1, le=100),
):
    q = select(Venue).options(selectinload(Venue.images)
                              ).order_by(desc(Venue.created_at))
    where_clauses = []
    if venue_status:
        where_clauses.append(Venue.status == venue_status)
    if where_clauses:
        q = q.where(*where_clauses)
    total = db.execute(select(func.count()).select_from(Venue).where(
        *where_clauses)).scalar_one()
    offset = (page - 1) * limit
    venues = db.execute(q.offset(offset).limit(limit)).scalars().all()
    return paginated_response([VenueOut.model_validate(v) for v in venues], total, page, limit)


@router.put("/venues/{id}/status", response_model=VenueOut, status_code=status.HTTP_200_OK)
def update_venue_status(
    id: int,
    venue_status: VenueStatusUpdate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(require_role(RoleEnum.ADMIN))],
):
    venue = db.execute(
        select(Venue).options(selectinload(Venue.images)).where(Venue.id == id)
    ).scalars().first()
    if not venue:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Venue not found")
    venue.status = venue_status.status
    db.commit()
    db.refresh(venue)
    return venue


@router.get("/bookings", status_code=status.HTTP_200_OK)
def get_all_bookings(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(require_role(RoleEnum.ADMIN))],
    status: BookingStatusEnum | None = Query(default=None),
    page: int = Query(default=DEFAULT_PAGE, ge=1),
    limit: int = Query(default=DEFAULT_LIMIT, ge=1, le=100),
):
    q = select(Booking).options(
        selectinload(Booking.slots).selectinload(BookingSlot.availability),
        selectinload(Booking.venue),
        selectinload(Booking.booker),
    ).order_by(desc(Booking.created_at))
    where_clauses = []
    if status:
        where_clauses.append(Booking.status == status)
    if where_clauses:
        q = q.where(*where_clauses)
    total = db.execute(select(func.count()).select_from(Booking).where(
        *where_clauses)).scalar_one()
    offset = (page - 1) * limit
    bookings = db.execute(q.offset(offset).limit(limit)).scalars().all()
    return paginated_response([BookingOut.model_validate(b) for b in bookings], total, page, limit)


@router.put("/categories/{id}/status", response_model=VenueCategoryOut, status_code=status.HTTP_200_OK)
def update_category_status(
    id: int,
    category_status: CategoryStatusUpdate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(require_role(RoleEnum.ADMIN))]
):
    category = db.execute(select(VenueCategory).where(
        VenueCategory.id == id)).scalars().first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    category.is_active = category_status.is_active
    db.commit()
    db.refresh(category)
    return category
