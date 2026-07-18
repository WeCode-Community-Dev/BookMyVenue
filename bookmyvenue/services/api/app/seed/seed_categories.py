from sqlalchemy.orm import Session

from models.venue_category import VenueCategory


CATEGORIES = [
    ("Wedding Hall", "wedding-hall"),
    ("Conference Hall", "conference-hall"),
    ("Auditorium", "auditorium"),
    ("Banquet Hall", "banquet-hall"),
    ("Meeting Room", "meeting-room"),
    ("Sports Ground", "sports-ground"),
    ("Party Hall", "party-hall"),
    ("Studio", "studio"),
]


def seed_categories(db: Session):

    print("Seeding categories...")

    for name, slug in CATEGORIES:

        existing = (
            db.query(VenueCategory)
            .filter(VenueCategory.slug == slug)
            .first()
        )

        if existing:
            continue

        category = VenueCategory(
            name=name,
            slug=slug,
            is_active=True,
        )

        db.add(category)

    db.commit()

    print(f"✓ {len(CATEGORIES)} categories ready.")
