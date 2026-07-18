from datetime import date
from tests.conftest import seed_user
from app.modules.notification.service import notify

def test_list_notifications_pagination(client, db):
    user_id, token = seed_user(db, "customer")

    # Create 5 notifications
    for i in range(5):
        notify(
            db,
            user_id=user_id,
            type="payment_confirmed",
            context={"venue_name": f"Venue {i}"},
            skip_email=True,
        )
    db.commit()

    # Get first page
    resp = client.get(
        "/api/notifications/?page=1&per_page=3",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "data" in data
    assert "meta" in data
    assert len(data["data"]) == 3
    assert data["meta"]["page"] == 1
    assert data["meta"]["per_page"] == 3
    assert data["meta"]["total"] == 5
    assert data["meta"]["total_pages"] == 2

    # Get second page
    resp = client.get(
        "/api/notifications/?page=2&per_page=3",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["data"]) == 2
    assert data["meta"]["page"] == 2
    assert data["meta"]["total_pages"] == 2
