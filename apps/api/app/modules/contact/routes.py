import logging

from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.email import send_email
from app.core.rate_limit import enforce_ip_hourly_limit
from app.modules.admin import settings_store
from app.modules.contact.schemas import ContactMessageCreate, ContactMessageResponse
from app.modules.notification.templates import render_contact_message_email

logger = logging.getLogger(__name__)

router = APIRouter()

SUPPORT_INBOX = "venue404.support@gmail.com"


@router.post("", response_model=ContactMessageResponse)
def submit_contact_message(
    body: ContactMessageCreate, request: Request, db: Session = Depends(get_db)
):
    """Public, unauthenticated — forwards a "Contact Us" submission to the support inbox."""
    client_ip = request.client.host if request.client else "unknown"
    limit = settings_store.get_setting(db, "contact_rate_limit_per_hour")
    enforce_ip_hourly_limit(client_ip, "contact", limit)

    subject, html = render_contact_message_email(body.name, body.email, body.subject, body.message)
    try:
        sent = send_email(SUPPORT_INBOX, subject, html, reply_to=body.email)
    except Exception:
        logger.exception("Failed to send contact message email from %s", body.email)
        sent = False
    return ContactMessageResponse(sent=sent)
