import json
import logging
from uuid import UUID

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.core.database import with_session
from app.core.exceptions import ForbiddenError
from app.modules.chat.manager import (
    broadcast_message,
    notify_offline_participant,
    register_connection,
    unregister_connection,
)
from app.modules.chat.schemas import SendMessageIn
from app.modules.chat.service import get_venue_name_for_notification

logger = logging.getLogger(__name__)

router = APIRouter()


def get_user_from_token(token: str) -> tuple[UUID, str | None, str | None] | None:
    """Extract user from JWT token for WebSocket auth. Uses its own session."""
    from app.modules.auth.providers.supabase import SupabaseAuthProvider
    from app.modules.profile.models import Profile

    with with_session() as db:
        provider = SupabaseAuthProvider()
        try:
            provider_user = provider.verify_token(token)
            profile = (
                db.query(Profile)
                .filter(
                    Profile.id == provider_user.id,
                    Profile.deleted_at.is_(None),
                )
                .first()
            )
            if not profile:
                return None
            return profile.id, profile.email, profile.full_name
        except Exception as e:
            logger.warning(f"WebSocket auth failed: {e}")
            return None


def get_booking_participants_for_auth(booking_id: UUID) -> tuple[UUID, UUID] | tuple[None, None]:
    """Get booking participants for auth check. Uses its own session."""
    with with_session() as db:
        from app.modules.chat.repository import get_booking_participants

        return get_booking_participants(db, booking_id)


def send_message_ws_with_session(
    booking_id: UUID,
    sender_id: UUID,
    message: str,
) -> dict:
    """Send message via WebSocket with proper session management."""
    from sqlalchemy import select

    from app.modules.booking.helpers import TERMINAL_STATUSES
    from app.modules.booking.models import Booking
    from app.modules.chat.repository import create_message
    from app.modules.venue.models import Venue

    with with_session() as db:
        # Lock the booking row to prevent race conditions with cancellations
        booking = (
            db.execute(select(Booking).where(Booking.id == booking_id).with_for_update())
            .scalars()
            .first()
        )

        if not booking:
            raise ForbiddenError("Booking not found")

        venue = db.execute(select(Venue).where(Venue.id == booking.venue_id)).scalars().first()
        customer_id = booking.user_id
        owner_id = venue.owner_id if venue else None

        if sender_id not in (customer_id, owner_id):
            raise ForbiddenError("Not authorized to send messages to this chat")

        if booking.status in TERMINAL_STATUSES:
            raise ForbiddenError("Cannot send messages for a booking in a terminal status")

        cleaned = (message or "").strip()
        if not cleaned:
            raise ValueError("Message cannot be empty")
        if len(cleaned) > 2000:
            raise ValueError("Message exceeds 2000 characters")

        chat_message = create_message(db, booking_id, sender_id, cleaned)

        result = {
            "id": str(chat_message.id),
            "booking_id": str(chat_message.booking_id),
            "sender_id": str(chat_message.sender_id),
            "message": chat_message.message,
            "created_at": chat_message.created_at.isoformat() if chat_message.created_at else None,
            "read_at": chat_message.read_at.isoformat() if chat_message.read_at else None,
        }

        # Determine recipient for notification
        recipient_id = owner_id if sender_id == customer_id else customer_id

        # Get venue name for notification context
        venue_name = get_venue_name_for_notification(db, booking_id)

        # Notify offline recipient if needed (pass session since it may need DB)
        notify_offline_participant(
            db,
            booking_id,
            recipient_id,
            {"venue_name": venue_name},
        )

        return result


@router.websocket("/bookings/{booking_id}/ws")
async def websocket_endpoint(
    booking_id: UUID,
    websocket: WebSocket,
):
    """WebSocket connection for real-time chat on a booking."""
    # Extract token from query params or headers
    token = websocket.query_params.get("token")
    if not token:
        await websocket.close(code=1008, reason="Missing authentication token")
        return

    # Authenticate user - uses its own session
    user = get_user_from_token(token)
    if not user:
        await websocket.close(code=1008, reason="Invalid authentication token")
        return

    user_id, user_email, user_name = user

    # Validate access to this booking - uses its own session
    customer_id, owner_id = get_booking_participants_for_auth(booking_id)
    if customer_id is None:
        await websocket.close(code=1008, reason="Booking not found")
        return

    if user_id not in (customer_id, owner_id):
        await websocket.close(code=1008, reason="Not authorized to access this chat")
        return

    # Accept connection
    await websocket.accept()

    # Register connection
    register_connection(booking_id, user_id, websocket)

    try:
        # Send connection confirmation
        await websocket.send_text(
            json.dumps(
                {
                    "type": "connected",
                    "payload": {"booking_id": str(booking_id)},
                }
            )
        )

        # Message loop
        while True:
            data = await websocket.receive_text()

            try:
                msg = json.loads(data)
            except json.JSONDecodeError:
                await websocket.send_text(
                    json.dumps(
                        {
                            "type": "error",
                            "payload": {"message": "Invalid JSON"},
                        }
                    )
                )
                continue

            msg_type = msg.get("type")

            if msg_type == "send_message":
                content = msg.get("message", "")
                client_msg_id = msg.get("client_msg_id")
                try:
                    validated = SendMessageIn(message=content)
                    result = send_message_ws_with_session(booking_id, user_id, validated.message)

                    # Broadcast to other participants
                    await broadcast_message(booking_id, user_id, result)

                    # Confirmation to sender (same payload shape as broadcast)
                    confirmation_payload = result.copy()
                    if client_msg_id:
                        confirmation_payload["client_msg_id"] = client_msg_id
                    await websocket.send_text(
                        json.dumps(
                            {
                                "type": "message_sent",
                                "payload": confirmation_payload,
                            }
                        )
                    )
                except ValueError as e:
                    error_payload = {"message": str(e)}
                    if client_msg_id:
                        error_payload["client_msg_id"] = client_msg_id
                    await websocket.send_text(
                        json.dumps(
                            {
                                "type": "error",
                                "payload": error_payload,
                            }
                        )
                    )
                except ForbiddenError as e:
                    error_payload = {"message": str(e)}
                    if client_msg_id:
                        error_payload["client_msg_id"] = client_msg_id
                    await websocket.send_text(
                        json.dumps(
                            {
                                "type": "error",
                                "payload": error_payload,
                            }
                        )
                    )
            elif msg_type == "mark_read":
                try:
                    from app.modules.chat.manager import broadcast_read_receipt
                    from app.modules.chat.service import mark_as_read

                    with with_session() as db:
                        mark_as_read(db, booking_id, user_id)

                    await broadcast_read_receipt(booking_id, user_id)
                    await websocket.send_text(
                        json.dumps(
                            {
                                "type": "read_ack",
                                "payload": {"booking_id": str(booking_id)},
                            }
                        )
                    )
                except Exception as e:
                    logger.warning(f"mark_read failed: {e}")
                    await websocket.send_text(
                        json.dumps(
                            {
                                "type": "error",
                                "payload": {"message": "Failed to mark messages as read"},
                            }
                        )
                    )
            elif msg_type == "ping":
                await websocket.send_text(
                    json.dumps(
                        {
                            "type": "pong",
                            "payload": {},
                        }
                    )
                )
            else:
                await websocket.send_text(
                    json.dumps(
                        {
                            "type": "error",
                            "payload": {"message": "Unknown message type"},
                        }
                    )
                )

    except WebSocketDisconnect:
        logger.info(f"WebSocket disconnected for user {user_id} on booking {booking_id}")
    finally:
        unregister_connection(booking_id, user_id)
