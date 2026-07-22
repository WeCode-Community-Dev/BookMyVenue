from sqlalchemy.orm import Session

from app.model.venue import Venue
from app.model.user import User
from app.model.venue_amenities import VenueAmenities
from app.model.venue_images import VenueImages
from app.model.venue_availability import VenueAvailability
from typing import List
from sqlalchemy import or_

def get_users_list(
    db: Session, page_no: int = 1, limit: int = 20
) -> List[User]:
    try:
        offset = (page_no - 1) * limit
        users = db.query(User).offset(offset).limit(limit).all()
        return users
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

