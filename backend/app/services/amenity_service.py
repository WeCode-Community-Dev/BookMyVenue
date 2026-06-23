from sqlalchemy.orm import Session
from app.models.amenity import Amenity

def get_amenities(db: Session):
    return db.query(Amenity).all()