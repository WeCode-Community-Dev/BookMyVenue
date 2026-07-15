from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.modules.auth.dependencies import AuthContext, require_auth
from app.modules.booking.models import Booking
from app.modules.chat import service
from app.modules.chat.manager import notify_offline_participant
from app.modules.chat.schemas import ChatMessageOut, ConversationOut, MarkReadOut, SendMessageIn
from app.modules.venue.models import Venue

router = APIRouter()


@router.get(
    "/conversations",
    response_model=list[ConversationOut],
)
def list_conversations(
    auth: AuthContext = Depends(require_auth),
    db: Session = Depends(get_db),
): 
    """Get all conversations for the authenticated user with aggregated message data."""
    return service.list_conversations(db, auth.user_id)


@router.get(
    "/bookings/{booking_id}/messages",
    response_model=list[ChatMessageOut],
)
def list_messages(
    booking_id: UUID,
    limit: int = 50,
    cursor: UUID | None = None,
    auth: AuthContext = Depends(require_auth),
    db: Session = Depends(get_db),
):
    """Get message history for a booking."""
    return service.list_messages(db, booking_id, auth.user_id, limit, cursor)


@router.post(
    "/bookings/{booking_id}/messages",
    response_model=ChatMessageOut,
)
def send_message(
    booking_id: UUID,
    body: SendMessageIn,
    auth: AuthContext = Depends(require_auth),
    db: Session = Depends(get_db),
):
    """Send a message to a booking chat."""
    result = service.send_message(db, booking_id, auth.user_id, body.message)

    # Get recipient and send notification if offline
    customer_id, owner_id = service.get_booking_participants_for_ws(db, booking_id)
    recipient_id = owner_id if auth.user_id == customer_id else customer_id

    # Get venue name for notification context
    venue_name = None
    booking = db.execute(select(Booking).where(Booking.id == booking_id)).scalar_one_or_none()
    if booking:
        venue = db.execute(select(Venue).where(Venue.id == booking.venue_id)).scalar_one_or_none()
        venue_name = venue.name if venue else None

    # Notify offline recipient via sync wrapper
    # The notification system will check if user is connected
    from app.modules.chat.manager import is_user_connected
    if recipient_id and not is_user_connected(booking_id, recipient_id):
        notify_offline_participant(db, booking_id, recipient_id, {"venue_name": venue_name})

    return result


@router.patch(
    "/bookings/{booking_id}/read",
    response_model=MarkReadOut,
)
def mark_read(
    booking_id: UUID,
    auth: AuthContext = Depends(require_auth),
    db: Session = Depends(get_db),
):
    """Mark all messages in a booking as read."""
    return service.mark_as_read(db, booking_id, auth.user_id)