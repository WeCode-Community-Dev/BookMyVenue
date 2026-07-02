from sqlalchemy.orm import Session
from app.models.notification import Notification


def create_notification(
    db: Session, user_id: int, type: str, message: str,
    venue_id: int | None = None, booking_id: int | None = None, payment_id: int | None = None,
) -> Notification:
    notification = Notification(
        user_id=user_id, type=type, message=message,
        venue_id=venue_id, booking_id=booking_id, payment_id=payment_id,
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification


def get_notifications_for_user(db: Session, user_id: int, limit: int = 20):
    return (
        db.query(Notification)
        .filter(Notification.user_id == user_id)
        .order_by(Notification.created_at.desc())
        .limit(limit)
        .all()
    )