from fastapi import File, HTTPException, UploadFile,status
from pydantic import Json
from sqlalchemy import Select
import structlog
from typing import List, Optional
from sqlalchemy.orm import Session

from src.bookmyvenue.models.admin import Amenity, Category
from src.bookmyvenue.schema.common.common import ImageKitVenueUrls, VenueSchema
from src.bookmyvenue.models.common import Venue
from src.bookmyvenue.schema.owner.owner import OwnerOnboardingSchema
from src.bookmyvenue.schema.responce.responces import UserNotFoundResponce
from src.bookmyvenue.schema.user.user import PhoneOnboardingSchema
from src.bookmyvenue.models.user import User
from src.bookmyvenue.models.owners import Owner

logger = structlog.get_logger()

class OwnerRepository:
    def get_owner_record_by_ID(self, db:Session, current_user_id:str) -> Optional[Owner]:
       return db.query(Owner).join(User).filter(User.clerkUserID == current_user_id).first()
     
    def onboard_owner(self, db:Session,clerk_user:User, onboard:OwnerOnboardingSchema) -> Owner:
        logger.info("creating the owner record forthe user" , userid = clerk_user.id)
        owner = Owner(
            user = clerk_user,
            profession = onboard.profession,
            promise = onboard.promise,
            intro_descp = onboard.self_info,
            organization = onboard.organization
        )
        db.add(owner)
        db.commit()
        db.refresh(owner)
        return owner
    
    def duplicate_venue_checker(self, db:Session, owner:Owner, name:str, city:str, street_address:str) -> bool:
        duplicate_venue = db.query(Venue).filter(
            Venue.owner == owner,
            Venue.name.ilike(name),
            Venue.city.ilike(city),
            Venue.street_address.ilike(street_address),
        ).first()

        if duplicate_venue:
            logger.info("already an venue exists with same name in same city at same location for the same owner.", owner = owner.user_id, venue_name = name, venue_city = city, venue_street_address = street_address)
            raise HTTPException(status_code=status.HTTP_409_CONFLICT , detail="already an venue exists with same name in same city at same location")
        
        return False
    def create_venue_record(self, db:Session, owner:Owner, payload:Json[VenueSchema]) -> Venue:
        # we have to decode the categories and amenities first sice we have to apply relation with them

        category_command = Select(Category).where(Category.id.in_(payload.categories))
        categories_instances =db.execute(category_command)
        list_of_categories = categories_instances.scalars().all()  #returns the instance as a python list
        logger.info("collecting the categories" , ids = payload.categories)

        amenities_command = Select(Amenity).where(Amenity.id.in_(payload.amenities))
        amenities_instances = db.execute(amenities_command)
        list_of_amenities = amenities_instances.scalars().all()  #returns the instance as a python list
        logger.info("collecting the amenities" , ids = payload.amenities)

        # now we are creating the venue listings with the collected documents.
        logger.info("creating the venue with the details" , owner = owner.user_id, venue_name = payload.name, venue_city = payload.city, venue_street_address = payload.street_address)
        venue_instance = Venue(
            categories = list_of_categories,
            amenities = list_of_amenities,
            owner = owner,
            name = payload.name,
            max_capacity = payload.max_capacity,
            street_address = payload.street_address,
            city = payload.city,
            district = payload.district,
            state = payload.state,
            country = payload.country,
            location_url = payload.location_url,
            description = payload.description,
            cancellation_percentage = payload.cancellation_percentage,
            minimum_slot_duration = payload.minimum_slot_duration,
            cancellation_time_limit = payload.cancellation_time_limit,
            hourly_rent = payload.hourly_rent,
            task_status = "Pending"
        )

        db.add(venue_instance)
        db.commit()
        logger.info("commiting the venue in the db" , owner = owner.user_id, venue_name = payload.name, venue_city = payload.city, venue_street_address = payload.street_address)
        db.refresh(venue_instance)

        return venue_instance




ownerRepository = OwnerRepository()