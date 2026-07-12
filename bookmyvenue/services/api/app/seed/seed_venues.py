import random

from sqlalchemy.orm import Session

from models.user import User, RoleEnum
from models.venue import Venue, StatusEnum
from models.venue_category import VenueCategory


VENUE_NAMES = [
    "Royal Palace",
    "Grand Arena",
    "Emerald Hall",
    "Blue Orchid",
    "Sky Convention Centre",
    "Golden Banquet",
    "Lotus Auditorium",
    "Galaxy Events",
    "Sunrise Venue",
    "Crystal Ballroom",
    "Elite Convention Hall",
    "Green Valley Resort",
    "Majestic Hall",
    "Imperial Banquet",
    "Harmony Events",
    "Prime Sports Arena",
    "Celebration Hall",
    "Infinity Convention",
    "Pearl Wedding Centre",
    "City Conference Hub",
]

CITIES = [
    "Cochin",
    "Trivandrum",
    "Kannur",
    "Kollam",
    "Munnar",
    "Alappy",
]

AMENITIES = [
    "Parking, WiFi, Air Conditioning",
    "Parking, Catering, Sound System",
    "WiFi, Stage, Projector",
    "Parking, Generator Backup",
    "Projector, Whiteboard, AC",
    "Changing Rooms, Parking",
]

CANCELLATION = [
    "Full refund up to 7 days before booking.",
    "50% refund up to 3 days before booking.",
    "No refund within 24 hours.",
]

DESCRIPTIONS = [
    "A spacious premium venue suitable for weddings and celebrations.",
    "Ideal for conferences, seminars and business meetings.",
    "Modern venue with premium amenities and ample parking.",
    "Perfect for birthday parties, receptions and corporate events.",
]


def seed_venues(db: Session):

    print("Seeding venues...")

    owners = (
        db.query(User)
        .filter(User.role == RoleEnum.OWNER)
        .all()
    )

    categories = db.query(VenueCategory).all()

    created = 0

    for owner in owners:

        number_of_venues = random.randint(4, 7)

        for i in range(number_of_venues):

            venue_name = f"{random.choice(VENUE_NAMES)} {owner.id}-{i}"

            if (
                db.query(Venue)
                .filter(Venue.name == venue_name)
                .first()
            ):
                continue

            booking_type = random.choice(
                [
                    "hourly",
                    "daily",
                    "both",
                ]
            )

            supports_hourly = booking_type in ["hourly", "both"]
            supports_daily = booking_type in ["daily", "both"]

            venue = Venue(
                owner_id=owner.id,
                category_id=random.choice(categories).id,
                name=venue_name,
                description=random.choice(DESCRIPTIONS),
                address_line=f"{random.randint(10, 400)} Main Street",
                city=random.choice(CITIES),
                pincode=str(random.randint(100000, 999999)),
                capacity=random.randint(30, 800),

                supports_hourly=supports_hourly,
                supports_daily=supports_daily,

                hourly_price=random.choice(
                    [500, 750, 1000, 1200, 1500, 2000]
                ) if supports_hourly else None,

                daily_price=random.choice(
                    [5000, 7000, 9000, 12000, 15000]
                ) if supports_daily else None,

                amenities=random.choice(AMENITIES),
                cancellation_policy=random.choice(CANCELLATION),
                status=StatusEnum.ACTIVE,
            )

            db.add(venue)
            created += 1

    db.commit()

    print(f"✓ {created} venues created.")
