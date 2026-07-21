from datetime import date, time

from sqlalchemy import text
from sqlalchemy.orm import Session


def acquire_slot_lock(db: Session, venue_id: int, booking_date: date, time_slot: time) -> None:
    lock_key = f"bmv:slot:{venue_id}:{booking_date.isoformat()}:{time_slot.isoformat()}"
    db.execute(text("SELECT pg_advisory_xact_lock(hashtext(:key))"), {"key": lock_key})
