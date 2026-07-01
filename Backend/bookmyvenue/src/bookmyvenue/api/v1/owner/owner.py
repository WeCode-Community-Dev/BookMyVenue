from typing import List

from pydantic import Json, ValidationError

from src.bookmyvenue.models.owners import Owner
from src.bookmyvenue.schema.common.common import VenueSchema
from fastapi import APIRouter, Depends, Form, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import structlog
from src.bookmyvenue.services import commonService
from src.bookmyvenue.schema.owner.owner import OwnerOnboardingSchema
from src.bookmyvenue.schema.responce.responces import CreatedVenueResponce, UserCreatedResponce, UserUpdatedResponce
from src.bookmyvenue.api.deps import  get_the_current_user, get_the_db_Session, owner_only_route
from src.bookmyvenue.services.ownerServices import ownerservice
from src.bookmyvenue.services.adminService import adminservice


load_dotenv()
logger = structlog.get_logger()


router = APIRouter(
    prefix='/owner'  #the prefix that joins `api/v1` prefix with api/v1/user + / => api/v1/user/
)  #this is used to create the routes with reference of app in the main.py of src folder

@router.get('/check')
def check_owner_profile(
    db:Session = Depends(get_the_db_Session),
    current_user_id:str = Depends(get_the_current_user)
):
    
    ownerservice.get_owner_record(db,current_user_id)
    logger.info(f"Owner has onboarded!" , clerk_id=current_user_id)
    return UserUpdatedResponce(status_code=200,message="Owner has onboarded!")
   
    




@router.post('/onboarding')
def complete_onboarding(
    onboard:OwnerOnboardingSchema, 
    db:Session = Depends(get_the_db_Session),
    current_user_id:str = Depends(get_the_current_user)
):
    
    ownerservice.complete_owner_onboarding(db,current_user_id,onboard)
    logger.info(f"onboarded the owner successfully" , clerk_id=current_user_id)
    return UserUpdatedResponce(status_code=200,message="successfully updated the profile")


@router.post('/venue' , response_model=CreatedVenueResponce)
async def create_venue_lisiting(
    payload: str = Form(...),
    cover_image: UploadFile = File(...),
    gallery: List[UploadFile] = File(...),
    db:Session = Depends(get_the_db_Session),
    owner:Owner = Depends(owner_only_route)
):
    

    try:
        payload_data =VenueSchema.model_validate_json(payload)
    except ValidationError as e:
        # If there are any field typos or missing items, this will catch them
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=e.errors()
        )
    
    #first create a venue table with metadata , along with task_status = 'pending'
    #call the media upload task
    #save the task id in the venue table
    #return added to queue responce

    

    created_venue_instance = ownerservice.create_new_venue(db=db,owner_user=owner, payload=payload_data, cover_image=cover_image, gallery=gallery)

    if not created_venue_instance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="cant create new venue instance"
        )

    return {
        "status_code": 200,
        "message": "Successfully added the venue to the queue",
        "data": f"{created_venue_instance.name}-{created_venue_instance.task_status}"
    }
    