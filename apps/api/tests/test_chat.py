from datetime import datetime, UTC, timedelta
from urllib.parse import quote
import pytest
from app.modules.booking.models import Booking, BookingStatus
from tests.conftest import seed_user, seed_approved_venue, create_booking


def test_send_message_auth_and_terminal_status(client, db, category_id):
    # Set up owner, customer, and venue
    owner_id, owner_token = seed_user(db, "venue_owner")
    customer_id, customer_token = seed_user(db, "customer")
    unauthorized_id, unauthorized_token = seed_user(db, "customer")
    venue_id = seed_approved_venue(db, owner_id, category_id)

    # Create a booking
    resp = create_booking(client, customer_token, venue_id)
    assert resp.status_code == 201
    booking_id = resp.json()["id"]

    # 1. Unauthorized user cannot send a message
    msg_resp = client.post(
        f"/api/chat/bookings/{booking_id}/messages",
        json={"message": "hello world"},
        headers={"Authorization": f"Bearer {unauthorized_token}"},
    )
    assert msg_resp.status_code == 403

    # 2. Customer can send a message
    msg_resp = client.post(
        f"/api/chat/bookings/{booking_id}/messages",
        json={"message": "hello from customer"},
        headers={"Authorization": f"Bearer {customer_token}"},
    )
    assert msg_resp.status_code == 200
    assert msg_resp.json()["message"] == "hello from customer"

    # 3. Owner can send a message
    msg_resp = client.post(
        f"/api/chat/bookings/{booking_id}/messages",
        json={"message": "hello from owner"},
        headers={"Authorization": f"Bearer {owner_token}"},
    )
    assert msg_resp.status_code == 200
    assert msg_resp.json()["message"] == "hello from owner"

    # 4. Transition booking to a terminal status (e.g. cancelled)
    booking = db.get(Booking, booking_id)
    booking.status = BookingStatus.user_cancelled
    db.commit()

    # Verify message sending is now forbidden
    msg_resp = client.post(
        f"/api/chat/bookings/{booking_id}/messages",
        json={"message": "after cancel"},
        headers={"Authorization": f"Bearer {customer_token}"},
    )
    assert msg_resp.status_code == 403
    assert "terminal status" in msg_resp.json()["detail"]


def test_time_based_cursor_pagination(client, db, category_id):
    owner_id, owner_token = seed_user(db, "venue_owner")
    customer_id, customer_token = seed_user(db, "customer")
    venue_id = seed_approved_venue(db, owner_id, category_id)

    # Create a booking
    resp = create_booking(client, customer_token, venue_id)
    assert resp.status_code == 201
    booking_id = resp.json()["id"]

    # Send message 1
    resp1 = client.post(
        f"/api/chat/bookings/{booking_id}/messages",
        json={"message": "message 1"},
        headers={"Authorization": f"Bearer {customer_token}"},
    )
    assert resp1.status_code == 200
    msg1 = resp1.json()

    # Send message 2
    resp2 = client.post(
        f"/api/chat/bookings/{booking_id}/messages",
        json={"message": "message 2"},
        headers={"Authorization": f"Bearer {customer_token}"},
    )
    assert resp2.status_code == 200
    msg2 = resp2.json()

    # Send message 3
    resp3 = client.post(
        f"/api/chat/bookings/{booking_id}/messages",
        json={"message": "message 3"},
        headers={"Authorization": f"Bearer {customer_token}"},
    )
    assert resp3.status_code == 200
    msg3 = resp3.json()

    # Get history without cursor (should return all 3)
    list_resp = client.get(
        f"/api/chat/bookings/{booking_id}/messages",
        headers={"Authorization": f"Bearer {customer_token}"},
    )
    assert list_resp.status_code == 200
    messages = list_resp.json()
    assert len(messages) == 3
    assert [m["message"] for m in messages] == ["message 1", "message 2", "message 3"]

    # Use message 1's timestamp as cursor
    list_resp_cursor1 = client.get(
        f"/api/chat/bookings/{booking_id}/messages?cursor={quote(msg1['created_at'])}",
        headers={"Authorization": f"Bearer {customer_token}"},
    )
    assert list_resp_cursor1.status_code == 200
    messages_cursor1 = list_resp_cursor1.json()
    assert len(messages_cursor1) == 2
    assert [m["message"] for m in messages_cursor1] == ["message 2", "message 3"]

    # Use message 2's timestamp as cursor
    list_resp_cursor2 = client.get(
        f"/api/chat/bookings/{booking_id}/messages?cursor={quote(msg2['created_at'])}",
        headers={"Authorization": f"Bearer {customer_token}"},
    )
    assert list_resp_cursor2.status_code == 200
    messages_cursor2 = list_resp_cursor2.json()
    assert len(messages_cursor2) == 1
    assert [m["message"] for m in messages_cursor2] == ["message 3"]
