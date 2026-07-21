"""
Seed a superadmin user for local testing.

Usage:
    cd backend
    source venv/bin/activate
    python scripts/seed_admin.py

Default login:
    email: admin@bookmyvenue.com
    password: admin123456
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.db.database import SessionLocal
import app.models  # noqa: F401 — register all mappers
from app.models.user import User
from app.services.auth_service import hash_password

ADMIN_EMAIL = "admin@bookmyvenue.com"
ADMIN_PASSWORD = "admin123456"


def seed_admin():
    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.email == ADMIN_EMAIL).first()
        if existing:
            existing.role = "admin"
            existing.is_active = True
            if not existing.hashed_password:
                existing.hashed_password = hash_password(ADMIN_PASSWORD)
            db.commit()
            print(f"Admin user already exists: {ADMIN_EMAIL}")
            return

        admin = User(
            name="Super Admin",
            email=ADMIN_EMAIL,
            phone_number="9000000000",
            hashed_password=hash_password(ADMIN_PASSWORD),
            auth_provider="email",
            role="admin",
            is_active=True,
        )
        db.add(admin)
        db.commit()
        print(f"Admin user created: {ADMIN_EMAIL}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_admin()
