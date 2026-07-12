from sqlalchemy.orm import Session

from models.user import User, RoleEnum
from utils.hashing import hash_password


PASSWORD = "Password@123"


def seed_users(db: Session):

    print("Seeding users...")

    users = [
        {
            "name": "System Administrator",
            "email": "admin@example.com",
            "role": RoleEnum.ADMIN,
        }
    ]

    # Owners
    for i in range(1, 6):
        users.append(
            {
                "name": f"Owner {i}",
                "email": f"owner{i}@example.com",
                "role": RoleEnum.OWNER,
            }
        )

    # Bookers
    for i in range(1, 11):
        users.append(
            {
                "name": f"User {i}",
                "email": f"user{i}@example.com",
                "role": RoleEnum.BOOKER,
            }
        )

    created = 0

    for user in users:

        existing = (
            db.query(User)
            .filter(User.email == user["email"])
            .first()
        )

        if existing:
            continue

        db.add(
            User(
                name=user["name"],
                email=user["email"],
                password_hash=hash_password(PASSWORD),
                role=user["role"],
            )
        )

        created += 1

    db.commit()

    print(f"✓ {created} users created.")

    print("\nLogin Credentials")
    print("-----------------------------")
    print(f"Password for all accounts: {PASSWORD}\n")

    print("ADMIN")
    print("admin@example.com\n")

    print("OWNERS")
    for i in range(1, 6):
        print(f"owner{i}@example.com")

    print("\nBOOKERS")
    for i in range(1, 11):
        print(f"user{i}@example.com")
