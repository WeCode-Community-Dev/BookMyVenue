"""
Seed sample bookings and payments so admin dashboard charts show real data.
Run: python scripts/seed_dashboard_data.py
"""
import sys
import uuid
from datetime import datetime, time, timedelta, timezone
from decimal import Decimal
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from sqlalchemy import text

from app.db.database import SessionLocal
from app.models.payment import Payment
from app.models.user import User
from app.models.venue import Venue

SAMPLE = [
    # (days_ago, status, amount, paid)
    (6, "booked", 5000, True),
    (5, "booked", 7500, True),
    (5, "pending_payment", 3000, False),
    (4, "booked", 12000, True),
    (3, "cancelled", 4000, False),
    (2, "booked", 6000, True),
    (1, "booked", 8500, True),
    (0, "booked", 10000, True),
    (0, "pending_payment", 4500, False),
]


def seed():
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.role == "user").first()
        venue = db.query(Venue).filter(Venue.approval_status == "approved").first()
        if not user or not venue:
            print("Need at least one user and one approved venue.")
            return

        existing = db.execute(text("SELECT COUNT(*) FROM bookings")).scalar()
        if existing >= len(SAMPLE):
            print(f"Dashboard data already seeded ({existing} bookings).")
            return

        today = datetime.now(timezone.utc).date()
        created = 0

        for days_ago, status, amount, paid in SAMPLE:
            booking_date = today - timedelta(days=days_ago)
            slot = time(10, 0)

            clash = db.execute(
                text(
                    "SELECT id FROM bookings WHERE venue_id=:vid AND booking_date=:bd AND time_slot=:ts"
                ),
                {"vid": venue.id, "bd": booking_date, "ts": slot},
            ).first()
            if clash:
                slot = time(14, 0)

            owner_status = "approved" if status == "booked" else "pending"
            created_at = datetime.combine(booking_date, time(9, 0), tzinfo=timezone.utc)

            row = db.execute(
                text("""
                    INSERT INTO bookings
                    (user_id, venue_id, booking_date, time_slot, amount, status, owner_status, created_at, updated_at)
                    VALUES (:uid, :vid, :bd, :ts, :amt, :status, :owner_status, :created_at, :created_at)
                    RETURNING id
                """),
                {
                    "uid": user.id,
                    "vid": venue.id,
                    "bd": booking_date,
                    "ts": slot,
                    "amt": amount,
                    "status": status,
                    "owner_status": owner_status,
                    "created_at": created_at,
                },
            ).first()
            booking_id = row[0]

            if paid and status == "booked":
                payment = Payment(
                    payment_id=f"pay_{uuid.uuid4().hex[:12]}",
                    booking_id=booking_id,
                    user_id=user.id,
                    amount=Decimal(str(amount)),
                    status="paid",
                    paid_at=datetime.combine(booking_date, time(12, 0), tzinfo=timezone.utc),
                )
                db.add(payment)

            created += 1

        db.commit()
        print(f"Seeded {created} bookings with payments for dashboard charts.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
