from app.modules.notification.templates import render_notification


def test_known_type_renders_title_body_and_link():
    title, body, html = render_notification(
        "payment_confirmed", {"venue_name": "Hall A"}, booking_id="b-123"
    )
    assert "confirmed" in title.lower()
    assert "Hall A" in body
    assert "/bookings/b-123" in html


def test_unknown_type_is_safe():
    title, body, html = render_notification("does_not_exist", {})
    assert title == "Notification"
    assert body


def test_missing_context_key_does_not_crash():
    # refund_issued references {amount_rupees}; omitting it must not raise
    title, body, html = render_notification("refund_issued", {"venue_name": "Hall A"})
    assert title
    assert body


def test_no_booking_id_means_no_link():
    _, _, html = render_notification("hold_expired", {"venue_name": "Hall A"})
    assert "/bookings/" not in html
