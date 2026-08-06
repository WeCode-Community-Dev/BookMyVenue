from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.security import require_admin
from app.db.deps import get_db
from app.models.user import User
from app.schemas.admin import (
    BookingAdminOut,
    DashboardStats,
    UserAdminCreate,
    UserAdminOut,
    UserAdminUpdate,
    VenueAdminCreate,
    VenueAdminOut,
    VenueAdminUpdate,
    VenueRejectRequest,
)
from app.services import admin_service

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/dashboard", response_model=DashboardStats)
def dashboard(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    return admin_service.get_dashboard_stats(db)


@router.get("/pending-venues", response_model=list[VenueAdminOut])
def pending_venues(
    skip: int = Query(default=0),
    limit: int = Query(default=100, le=200),
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    return admin_service.get_pending_venues(db, skip=skip, limit=limit)


@router.patch("/venues/{venue_id}/approve", response_model=VenueAdminOut)
def approve_venue(
    venue_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    return admin_service.approve_venue(db, venue_id)


@router.patch("/venues/{venue_id}/reject", response_model=VenueAdminOut)
def reject_venue(
    venue_id: int,
    body: VenueRejectRequest | None = None,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    reason = body.rejection_reason if body else None
    return admin_service.reject_venue(db, venue_id, reason)


@router.post("/venues", response_model=VenueAdminOut, status_code=201)
def create_venue(
    data: VenueAdminCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    return admin_service.create_venue_admin(db, data)


@router.get("/venues", response_model=list[VenueAdminOut])
def all_venues(
    approval_status: str | None = Query(default=None),
    skip: int = Query(default=0),
    limit: int = Query(default=100, le=200),
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    return admin_service.get_all_venues(
        db, approval_status=approval_status, skip=skip, limit=limit
    )


@router.get("/venues/{venue_id}", response_model=VenueAdminOut)
def venue_detail(
    venue_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    return admin_service.get_venue_admin(db, venue_id)


@router.put("/venues/{venue_id}", response_model=VenueAdminOut)
def update_venue(
    venue_id: int,
    data: VenueAdminUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    return admin_service.update_venue_admin(db, venue_id, data)


@router.delete("/venues/{venue_id}", response_model=VenueAdminOut)
def block_venue(
    venue_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    return admin_service.block_venue(db, venue_id)


@router.patch("/venues/{venue_id}/unblock", response_model=VenueAdminOut)
def unblock_venue(
    venue_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    return admin_service.unblock_venue(db, venue_id)


@router.get("/bookings", response_model=list[BookingAdminOut])
def all_bookings(
    skip: int = Query(default=0),
    limit: int = Query(default=100, le=200),
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    return admin_service.get_all_bookings(db, skip=skip, limit=limit)


@router.get("/users", response_model=list[UserAdminOut])
def all_users(
    role: str | None = Query(default=None),
    is_active: bool | None = Query(default=None),
    skip: int = Query(default=0),
    limit: int = Query(default=100, le=200),
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    return admin_service.get_all_users(
        db, role=role, is_active=is_active, skip=skip, limit=limit
    )


@router.get("/users/{user_id}", response_model=UserAdminOut)
def user_detail(
    user_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    return admin_service.get_user_admin(db, user_id)


@router.post("/users", response_model=UserAdminOut, status_code=201)
def create_user(
    data: UserAdminCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    return admin_service.create_user_admin(db, data)


@router.put("/users/{user_id}", response_model=UserAdminOut)
def update_user(
    user_id: int,
    data: UserAdminUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    return admin_service.update_user_admin(db, user_id, data)


@router.delete("/users/{user_id}", response_model=UserAdminOut)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    return admin_service.delete_user_admin(db, user_id)


@router.patch("/users/{user_id}/activate", response_model=UserAdminOut)
def activate_user(
    user_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    return admin_service.set_user_active(db, user_id, active=True)


@router.patch("/users/{user_id}/deactivate", response_model=UserAdminOut)
def deactivate_user(
    user_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    return admin_service.set_user_active(db, user_id, active=False)
