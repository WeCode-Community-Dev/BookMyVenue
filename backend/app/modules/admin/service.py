from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.deps import require_admin
from app.db.session import get_db
from app.modules.bookings.model import Booking
from app.modules.payments.model import Payment, PaymentStatus
from app.modules.payments.schemas import OverviewStats
from app.modules.users.model import User
from app.modules.venues import repository as venues_repo
from app.modules.venues.model import VenueStatus

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/overview", response_model=OverviewStats)
def overview(
    db: Session = Depends(get_db),
    _user: User = Depends(require_admin),
):
    total_users = db.scalar(select(func.count(User.id))) or 0
    return OverviewStats(
        total_users=total_users,
        total_venues=venues_repo.count_by_status(db, None),
        pending_venues=venues_repo.count_by_status(db, VenueStatus.pending),
        total_bookings=db.scalar(select(func.count(Booking.id))) or 0,
        total_revenue=db.scalar(
            select(func.coalesce(func.sum(Payment.amount), 0.0)).where(
                Payment.status == PaymentStatus.mock_success
            )
        ) or 0.0,
    )
