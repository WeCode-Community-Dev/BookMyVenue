import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BACKEND_DIR))

from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.modules.auth.models import User, UserRole

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SEED_USERS = [
    {
        "name": "Alan User",
        "email": "alan@gmail.com",
        "role": UserRole.USER.value,
        "is_active": True,
    },
    {
        "name": "Venue Owner",
        "email": "owner@bookmyvenue.com",
        "role": UserRole.OWNER.value,
        "is_active": True,
    },
    {
        "name": "Disabled User",
        "email": "disabled@test.com",
        "role": UserRole.USER.value,
        "is_active": False,
    },
]

DEFAULT_PASSWORD = "123456"


def hash_password(plain_password: str) -> str:
    return pwd_context.hash(plain_password)


def seed_users(db: Session) -> None:
    password_hash = hash_password(DEFAULT_PASSWORD)

    for user_data in SEED_USERS:
        existing = db.query(User).filter(User.email == user_data["email"]).first()
        if existing:
            print(f"Skip (already exists): {user_data['email']}")
            continue

        user = User(
            name=user_data["name"],
            email=user_data["email"],
            password_hash=password_hash,
            role=user_data["role"],
            is_active=user_data["is_active"],
        )
        db.add(user)
        print(f"Created: {user_data['email']} ({user_data['role']})")

    db.commit()


def main() -> None:
    db = SessionLocal()
    try:
        seed_users(db)
        print("Seed complete.")
    except Exception as exc:
        db.rollback()
        print(f"Seed failed: {exc}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
