from sqlalchemy.orm import Session

from app.model.venue import Venue
from app.model.user import User

def get_venues(
    db: Session,
    page_no : int,
    limit : int,
    action : str,
    location : str,
    avaialability : str
):
    offset = (page_no - 1) * limit

    venues = db.query(Venue).offset(offset).limit(limit).all()

    if not venues:
        return {
            "message": "venues are not added"
        }

    return venues

def get_venue_details_by_id(
    db: Session,
    venue_id : int,
):

    venue = (
        db.query(Venue)
        .filter(Venue.id == venue_id)
        .first()
    )

    if not venue:
        return {
            "message": "venues details is not present"
        }

    return venue


def add_venue(
    db: Session,
    user_id: int,
    venue_name: str,
    venue_description: str,
    location: str,
    capacity: int,
    venue_price: int,
    venue_availabilty: str,
):

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise Exception("Invalid user")
    
    new_venue = Venue(
        user_id=user_id,
        venue_name=venue_name,
        venue_description=venue_description,
        location=location,
        capacity=capacity,
        venue_price=venue_price,
        venue_availabilty=venue_availabilty,
    )


    db.add(new_venue)
    db.commit()
    db.refresh(new_venue)

    return new_venue



