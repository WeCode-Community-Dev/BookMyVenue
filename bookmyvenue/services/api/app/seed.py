from sqlalchemy.orm import Session

from database import SessionLocal

from seed.seed_categories import seed_categories
from seed.seed_users import seed_users
from seed.seed_venues import seed_venues
from seed.seed_images import seed_images
from seed.seed_availability import seed_availability
from seed.seed_bookings import seed_bookings


def seed_database():

    db: Session = SessionLocal()

    try:
        print("Starting database seeding...\n")

        # seed_categories(db)
        # seed_users(db)
        # seed_venues(db)
        # seed_images(db)
        # seed_availability(db)
        seed_bookings(db)

        print("\nDatabase seeded successfully.")

    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
