from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.modules.auth.dependencies import AuthContext, require_owner
from app.modules.owner import service
from app.modules.owner.schemas import DashboardStats, ChartDataPoint, UpcomingEventOut

router = APIRouter()


@router.get("/dashboard/stats", response_model=DashboardStats)
def get_owner_dashboard_stats(
    auth: AuthContext = Depends(require_owner),
    db: Session = Depends(get_db),
):
    """Aggregated KPI and financial stats for the owner dashboard."""
    return service.get_dashboard_stats(db, auth.user_id)


@router.get("/dashboard/chart", response_model=list[ChartDataPoint])
def get_owner_dashboard_chart(
    time_range: str = "6M",
    auth: AuthContext = Depends(require_owner),
    db: Session = Depends(get_db),
):
    """Monthly performance chart data for the owner dashboard."""
    return service.get_dashboard_chart(db, auth.user_id, time_range)


@router.get("/dashboard/upcoming-events", response_model=list[UpcomingEventOut])
def get_owner_dashboard_upcoming_events(
    auth: AuthContext = Depends(require_owner),
    db: Session = Depends(get_db),
):
    """Upcoming confirmed events for the owner dashboard."""
    return service.get_upcoming_events(db, auth.user_id)
