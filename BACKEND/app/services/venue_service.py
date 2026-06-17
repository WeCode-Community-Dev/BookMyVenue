from sqlalchemy.orm import Session

from app.model.venue import Venue
from app.model.user import User
from app.model.venue_amenities import VenueAmenities
from app.model.venue_images import VenueImages
from typing import List

def get_venues(
    db: Session,
    page_no : int,
    limit : int,
    action : str,
    location : str,
    avaialability : str
):  
    try:
        offset = (page_no - 1) * limit

        venues = db.query(Venue).offset(offset).limit(limit).all()

        if not venues:
            return {
                "message": "venues are not added"
            }
        
        return venues

    except Exception as e:
        raise Exception(f"Error occurred while fetching venues: {str(e)}")


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

    return {
        "message": "Venue created successfully",
        "venue_id": new_venue.id
    }

def add_venue_amenities(
    db: Session,
    venue_id: int,
    wifi: bool = False,
    kitchen: bool = False,
    parking: bool = False,
    ac: bool = False,
    wheel_chair: bool = False,
    av_equipements: bool = False,
):
    
    amenities = VenueAmenities(
        venue_id=venue_id,
        wifi=wifi,
        kitchen=kitchen,
        parking=parking,
        ac=ac,
        wheel_chair=wheel_chair,
        av_equipements=av_equipements,
    )


    db.add(amenities)
    db.commit()
    db.refresh(amenities)

    return {
        "message": "Amenities added successfully",
        "amenities_id": amenities.id
    }

def add_venue_images(
    db: Session,
    images_urls : List, 
    venue_id : int
):
    for image in images_urls:
        add_image_url = VenueImages(
            venue_id=venue_id,
            image_url=image["url"]
        )

        db.add(add_image_url)
        db.commit()
        db.refresh(add_image_url)

    return {
        "message": "Images added successfully",
    }
    
def update_venue_approval_status(
    db: Session,
    venue_id: int,
    status: str,
    reason: str
):
    venue = (
        db.query(Venue)
        .filter(Venue.id == venue_id) 
        .first()
    )

    if not venue:
        raise Exception("Invalid venue")

    if status.lower() == "approved":
        venue.is_approved = True
    elif status.lower() == "rejected":
        venue.is_approved = False
        
        ## reason
        ## rejection schema to store rejected description plus venue_id
        ## shoot mail to venue owner mentioning rejection

    else:
        raise Exception("Status must be either 'approved' or 'rejected'")

    db.commit()
    db.refresh(venue)

    return {
        "message": f"Venue {status.lower()} successfully",
        "venue_id": venue.id,
        "is_approved": venue.is_approved
    } 


def update_venue_active_status(
    db: Session,
    venue_id: int,
    status: str,
    reason: str = None
):
    venue = (
        db.query(Venue)
        .filter(Venue.id == venue_id)
        .first()
    )

    if not venue:
        raise Exception("Invalid venue")

    if status.lower() == "active":
        venue.is_active = True

    elif status.lower() == "inactive":
        venue.is_active = False
        venue.not_available_reason = reason

    else:
        raise Exception("Status must be either 'active' or 'inactive'")

    db.commit()
    db.refresh(venue)

    return {
        "message": f"Venue {status.lower()} successfully",
        "venue_id": venue.id,
        "is_active": venue.is_active
    }


def edit_venue(
    db: Session,
    venue_id: int,
    venue_name: str = None,
    venue_description: str = None,
    location: str = None,
    capacity: int = None,
    venue_price: int = None,
    venue_availabilty: str = None,
):
    
    venue = (
        db.query(Venue)
        .filter(Venue.id == venue_id)
        .first()
    )

    if not venue:
        raise Exception("Venue not found")

    if venue_name is not None:
        venue.venue_name = venue_name

    if venue_description is not None:
        venue.venue_description = venue_description

    if location is not None:
        venue.location = location

    if capacity is not None:
        venue.capacity = capacity

    if venue_price is not None:
        venue.venue_price = venue_price

    if venue_availabilty is not None:
        venue.venue_availabilty = venue_availabilty

    db.commit()
    db.refresh(venue)

    return {
        "message": "Venue updated successfully",
        "venue_id": venue.id
    }

def edit_venue_amenities(
    db: Session,
    venue_id: int,
    wifi: bool,
    kitchen: bool,
    parking: bool,
    ac: bool,
    wheel_chair: bool,
    av_equipements: bool,
):
    
    amenities = (
        db.query(VenueAmenities)
        .filter(VenueAmenities.venue_id == venue_id)
        .first()
    )

    if not amenities:
        raise Exception("Amenities not found")

    if wifi is not None:
        amenities.wifi = wifi
    if kitchen is not None:
        amenities.kitchen = kitchen
    if parking is not None:
        amenities.parking = parking
    if ac is not None:
        amenities.ac = ac
    if wheel_chair is not None:
        amenities.wheel_chair = wheel_chair
    if av_equipements is not None:
        amenities.av_equipements = av_equipements

    db.commit()
    db.refresh(amenities)

    return {
        "message": "Amenities updated successfully"
    }