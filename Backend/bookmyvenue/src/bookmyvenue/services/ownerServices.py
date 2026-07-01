
import base64
from typing import Optional,List
import uuid

from fastapi import File, HTTPException, UploadFile, status
from pydantic import Json
import structlog
from sqlalchemy.orm import Session


from src.bookmyvenue.models.common import Venue
from src.bookmyvenue.schema.common.common import ImageKitVenueUrls, VenueSchema
from src.bookmyvenue.models.owners import Owner
from src.bookmyvenue.models.user import User
from src.bookmyvenue.repositories.users.repository import userRepository
from src.bookmyvenue.repositories.owner.repository import ownerRepository
from src.bookmyvenue.schema.user import user
from src.bookmyvenue.schema.owner import owner
from src.bookmyvenue.BackgroundWorker.Owner.tasks import upload_media_to_imagekit

logger = structlog.get_logger()

class OwnerService:

    def get_owner_record(self, db:Session, current_user_id:str) -> Optional[Owner]:
       owner_profile = ownerRepository.get_owner_record_by_ID(db, current_user_id)
       if not owner_profile:
            logger.info(f"Owner Profile Not Found!" , clerk_id=current_user_id)
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Owner Profile not found!")
       return owner_profile

    
    def complete_owner_onboarding(self, db:Session, current_user_id:str, onboard:owner.OwnerOnboardingSchema) -> Owner:
        logger.info("trying to onboard owner" , clerk_id = current_user_id)
        current_user = userRepository.get_user_by_id(db, current_user_id)
        if not current_user:
            logger.error("user record not found" ,clerk_id=current_user_id)
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="user not found in DB")
        owner_record = ownerRepository.get_owner_record_by_ID(db, current_user_id)
        if owner_record:
            logger.error("owner has already onboarded" ,clerk_id=current_user_id)
            raise HTTPException(status_code=status.HTTP_201_CREATED,detail="Owner onboadred completed!")
        
        owner_record = ownerRepository.onboard_owner(db,current_user,onboard)

        return owner_record
        
    def create_new_venue(self, db:Session, owner_user:Owner,payload:Json[VenueSchema],cover_image: UploadFile = File(...), gallery: List[UploadFile] = File(...)) -> Venue:
        #if a vnue with same name , city and same location exists alreday for the respective owner
        
        duplicate_checker = ownerRepository.duplicate_venue_checker(db=db, owner=owner_user, city=payload.city, street_address=payload.street_address, name=payload.name)
        
        venue_instance = ownerRepository.create_venue_record(db=db, owner=owner_user, payload=payload)
        
        if not venue_instance:
            logger.error("cant create the venue for the owner" , ownerId = owner_user.id)
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="cant able to create the venue for the given data"
            )
        
        cover_bytes = cover_image.file.read()
        cover_base64 = base64.b64encode(cover_bytes).decode('utf-8')
        
        gallery_base64_list = [
            base64.b64encode(file.file.read()).decode('utf-8') for file in gallery
        ]

        celery_queue_worker = upload_media_to_imagekit.delay(venue_instance.id, cover_base64, gallery_base64_list, venue_instance.name)
        venue_instance.celery_task_ID = celery_queue_worker.id
        db.commit()
        db.refresh(venue_instance)

        return venue_instance


        
        
        
       
    

ownerservice = OwnerService()