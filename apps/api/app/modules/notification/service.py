import json
import logging
import urllib.error
import urllib.request
from datetime import UTC, datetime

from sqlalchemy import event
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import SessionLocal
from app.core.email import send_email
from app.core.exceptions import ForbiddenError, NotFoundError
from app.modules.notification.models import InAppNotification
from app.modules.notification.schemas import NotificationListResponse, NotificationResponse, PaginatedMeta
from app.modules.notification.templates import render_notification

logger = logging.getLogger(__name__)


def notify(
    db: Session,
    user_id,
    type: str,
    context: dict | None = None,
    booking_id=None,
    skip_email: bool = False,
) -> InAppNotification:
    """Create an in-app notification and queue its email for after-commit send.

    Always writes the in-app row inside the caller's transaction. The email is
    deferred: it is sent only once the transaction commits (see the after_commit
    listener), so no network I/O happens while the caller still holds DB row
    locks, and a rollback sends nothing. Email delivery is best-effort and never
    affects the transaction. The caller owns the commit.

    skip_email=True writes the in-app row but queues no email — used when a
    fuller email (e.g. booking-confirmed + invoice, see
    app.modules.booking.invoice) will be sent later by an async job instead.
    """
    title, body, html = render_notification(type, context, booking_id)
    row = InAppNotification(
        user_id=user_id, booking_id=booking_id, type=type, title=title, body=body
    )
    db.add(row)
    db.flush()

    if not skip_email:
        pending = db.info.setdefault("_pending_emails", [])
        pending.append(
            {"user_id": str(user_id), "subject": title, "html": html, "notification_id": row.id}
        )
    return row


def _send_pending_emails(session: Session) -> None:
    """after_commit hook: send any emails queued by notify() during this txn.

    Runs after the lock-holding transaction has committed. sent_at is stamped via
    a fresh short-lived session so we never re-enter the just-committed one.
    """
    pending = session.info.pop("_pending_emails", None)
    if not pending:
        return
    for item in pending:
        try:
            email = _get_user_email(item["user_id"])
            if email and send_email(email, item["subject"], item["html"]):
                _mark_email_sent(item["notification_id"])
        except Exception:
            logger.exception(
                "Deferred notification email failed (notification=%s)", item.get("notification_id")
            )


def _mark_email_sent(notification_id) -> None:
    s = SessionLocal()
    try:
        row = s.get(InAppNotification, notification_id)
        if row and row.sent_at is None:
            row.sent_at = datetime.now(UTC)
            s.commit()
    except Exception:
        logger.exception("Could not stamp sent_at for notification %s", notification_id)
    finally:
        s.close()


# Drain queued emails whenever any app session commits. The fresh session opened
# in _mark_email_sent re-fires this with an empty queue, so there is no loop.
event.listen(SessionLocal, "after_commit", _send_pending_emails)


def list_notifications(
    db: Session, user_id, page: int = 1, per_page: int = 20
) -> NotificationListResponse:
    query = (
        db.query(InAppNotification)
        .filter(InAppNotification.user_id == user_id)
    )
    total = query.count()
    total_pages = (total + per_page - 1) // per_page if per_page > 0 else 0
    rows = (
        query.order_by(InAppNotification.created_at.desc())
        .offset((page - 1) * per_page)
        .limit(per_page)
        .all()
    )
    return NotificationListResponse(
        data=[_to_response(r) for r in rows],
        meta=PaginatedMeta(
            page=page,
            per_page=per_page,
            total=total,
            total_pages=total_pages,
        ),
    )


def mark_read(db: Session, notification_id: str, user_id) -> None:
    row = db.query(InAppNotification).filter(InAppNotification.id == notification_id).first()
    if not row:
        raise NotFoundError("Notification not found")
    if str(row.user_id) != str(user_id):
        raise ForbiddenError("Not your notification")
    if row.read_at is None:
        row.read_at = datetime.now(UTC)
        db.commit()


def _to_response(r: InAppNotification) -> NotificationResponse:
    return NotificationResponse(
        id=str(r.id),
        user_id=str(r.user_id),
        booking_id=str(r.booking_id) if r.booking_id else None,
        type=r.type,
        title=r.title,
        body=r.body,
        read_at=r.read_at,
        created_at=r.created_at,
    )


def _get_user_email(user_id) -> str | None:
    """Resolve a user's email via the Supabase Auth Admin API.

    Email lives in auth.users (Supabase-managed), not in profiles, so jobs and
    webhooks (which have no JWT) look it up here. Returns None on any failure.
    """
    if not settings.supabase_url or not settings.supabase_service_role_key:
        return None
    url = f"{settings.supabase_url}/auth/v1/admin/users/{user_id}"
    req = urllib.request.Request(
        url,
        method="GET",
        headers={
            "Authorization": f"Bearer {settings.supabase_service_role_key}",
            "apikey": settings.supabase_service_role_key,
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:  # noqa: S310
            data = json.loads(resp.read())
        return data.get("email")
    except (urllib.error.URLError, json.JSONDecodeError, KeyError):
        logger.warning("Could not resolve email for user %s", user_id)
        return None
