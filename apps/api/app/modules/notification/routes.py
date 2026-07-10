from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.modules.auth.dependencies import AuthContext, get_current_user
from app.modules.notification import service
from app.modules.notification.schemas import NotificationResponse

router = APIRouter()


@router.get("/", response_model=list[NotificationResponse])
def list_notifications(
    user: AuthContext = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return service.list_notifications(db, user.user_id)


@router.patch("/{notification_id}/read", status_code=204)
def mark_read(
    notification_id: str,
    user: AuthContext = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service.mark_read(db, notification_id, user.user_id)
