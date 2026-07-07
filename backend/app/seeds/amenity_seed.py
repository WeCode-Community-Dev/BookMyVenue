from sqlalchemy.orm import Session
from app.models.amenity import Amenity

def seed_amenities(db: Session):
    amenities = [
        "Wi-Fi",
        "Parking",
        "AC",
        "Projector",
        "Catering"
    ]

    for amenity_name in amenities:
        existing = db.query(Amenity).filter(
            Amenity.name == amenity_name
        ).first()

        if not existing:
            db.add(
                Amenity(name=amenity_name)
            )

    db.commit()