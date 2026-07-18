from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.modules.auth.dependencies import AuthContext, get_current_user
from app.modules.notification import service
from app.modules.notification.schemas import NotificationListResponse

router = APIRouter()


@router.get("/", response_model=NotificationListResponse)
def list_notifications(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    user: AuthContext = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return service.list_notifications(db, user.user_id, page, per_page)


@router.patch("/{notification_id}/read", status_code=204)
def mark_read(
    notification_id: str,
    user: AuthContext = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service.mark_read(db, notification_id, user.user_id)
