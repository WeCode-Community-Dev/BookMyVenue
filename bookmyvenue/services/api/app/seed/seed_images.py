import random

from sqlalchemy.orm import Session

from models.venue import Venue
from models.venue_image import VenueImage
IMAGE_URLS = [
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3",
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3",
    "https://images.unsplash.com/photo-1511578314322-379afb476865",
    "https://images.unsplash.com/photo-1505236858219-8359eb29e329",
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
    "https://images.unsplash.com/photo-1517457373958-b7bdd4587205",
    "https://images.unsplash.com/photo-1528605248644-14dd04022da1",
    "https://images.unsplash.com/photo-1505373877841-8d25f7d46678",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622",
    "https://images.unsplash.com/photo-1478145046317-39f10e56b5e9",
]


def seed_images(db: Session):

    print("Seeding venue images...")

    venues = db.query(Venue).all()

    created = 0

    for venue in venues:

        existing = (
            db.query(VenueImage)
            .filter(VenueImage.venue_id == venue.id)
            .count()
        )

        if existing:
            continue

        image_count = random.randint(4, 6)

        selected_images = random.sample(IMAGE_URLS, image_count)

        for order, image in enumerate(selected_images):

            db.add(
                VenueImage(
                    venue_id=venue.id,
                    image_url=image,
                    display_order=order
                )
            )

            created += 1

    db.commit()

    print(f"✓ {created} images created.")
