from datetime import datetime
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
    cursor: datetime | None = None,
    auth: AuthContext = Depends(require_auth),
    db: Session = Depends(get_db),
):
    """Get message history for a booking."""
    return service.list_messages(db, booking_id, auth.user_id, limit, cursor)


@router.post(
    "/bookings/{booking_id}/messages",
    response_model=ChatMessageOut,
)
async def send_message(
    booking_id: UUID,
    body: SendMessageIn,
    auth: AuthContext = Depends(require_auth),
    db: Session = Depends(get_db),
):
    """Send a message to a booking chat (REST). Also fans out over WebSocket when possible."""
    result = service.send_message(db, booking_id, auth.user_id, body.message)

    customer_id, owner_id = service.get_booking_participants_for_ws(db, booking_id)
    recipient_id = owner_id if auth.user_id == customer_id else customer_id

    venue_name = None
    booking = db.execute(select(Booking).where(Booking.id == booking_id)).scalar_one_or_none()
    if booking:
        venue = db.execute(select(Venue).where(Venue.id == booking.venue_id)).scalar_one_or_none()
        venue_name = venue.name if venue else None

    from app.modules.chat.manager import broadcast_message, is_user_connected

    # Fan-out to any live WebSocket listeners (e.g. other party already in chat)
    payload = {
        "id": str(result.id),
        "booking_id": str(result.booking_id),
        "sender_id": str(result.sender_id),
        "message": result.message,
        "created_at": result.created_at,
        "read_at": result.read_at,
    }
    await broadcast_message(booking_id, auth.user_id, payload)

    if recipient_id and not is_user_connected(booking_id, recipient_id):
        notify_offline_participant(db, booking_id, recipient_id, {"venue_name": venue_name})

    return result


@router.patch(
    "/bookings/{booking_id}/read",
    response_model=MarkReadOut,
)
async def mark_read(
    booking_id: UUID,
    auth: AuthContext = Depends(require_auth),
    db: Session = Depends(get_db),
):
    """Mark all messages in a booking as read and notify the other participant."""
    result = service.mark_as_read(db, booking_id, auth.user_id)

    if result.updated_count > 0:
        from app.modules.chat.manager import broadcast_read_receipt

        await broadcast_read_receipt(booking_id, auth.user_id)
    return result
