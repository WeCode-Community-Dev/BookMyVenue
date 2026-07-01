import os
import structlog
import redis.asyncio as aioredis
from dotenv import load_dotenv
from fastapi import Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from clerk_backend_api import Clerk
from clerk_backend_api.security import authenticate_request
from clerk_backend_api.security.types import AuthenticateRequestOptions


from src.bookmyvenue.core.database import session
from src.bookmyvenue.models.admin import Admin
from src.bookmyvenue.repositories.admin.repository import adminRepository
from src.bookmyvenue.repositories.owner.repository import ownerRepository
load_dotenv()

clerk_SDK = Clerk(bearer_auth=os.getenv("CLERK_API_KEY"))  
logger = structlog.get_logger()

def get_the_db_Session():
    db = session()  #generating the new sectio
    try:
        yield db #yield is used to get the current session pause the function pass the session to the respective function calling the db session and once it completes the job the contol comes back here and closes the connection
    finally:
        db.close()


def get_the_redis_client(request: Request) -> aioredis.Redis:
    return request.app.state.redis   #accessing the redis client stored in the app.state of the request.




# this function is used to check the incoming request with siginied in or not
def get_the_current_user(request: Request):

    request_state = clerk_SDK.authenticate_request(
        request,
        AuthenticateRequestOptions(
            authorized_parties=['http://localhost:3000']
        )
    )

    if not request_state.is_signed_in:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="user is not signed in")
    else:
        request_payload = request_state.payload
        user_id = request_payload['sub']  # user ID
        return user_id


# Role based checking of the Admin
def admin_only_route(request: Request,db:Session = Depends(get_the_db_Session)):
    user_id = get_the_current_user(request=request)  #passing the request to the function
    admin_user = adminRepository.get_the_admin_by_user(db,user_id)
    
    if not admin_user:
        logger.error("Forbidden request, only allowed for the admin to access" ,clerk_id=user_id)
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail="Forbidden, only admin can access this endpoint")
    
    return admin_user


#Role based check for owner
def owner_only_route(request: Request,db:Session = Depends(get_the_db_Session)):
    user_id = get_the_current_user(request=request)  #passing the request to the function
    owner_user = ownerRepository.get_owner_record_by_ID(db,user_id)
    
    if not owner_user:
        logger.error("Forbidden request, only allowed for the owners to access" ,clerk_id=user_id)
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail="Forbidden, only owners can access this endpoint")
    
    return owner_user
    
    
