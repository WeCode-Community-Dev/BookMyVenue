import uuid

from fastapi import HTTPException
import structlog
from sqlalchemy.orm import Session


from src.bookmyvenue.models.user import User
from src.bookmyvenue.repositories.users.repository import userRepository
from src.bookmyvenue.schema.user import user


logger = structlog.get_logger()

class UserService:
    def register_user(self, db: Session, clerk_user: user.ClerkWebhookData) -> User:

        primary_email = None
        for email_obj in clerk_user.email_addresses:
            if email_obj.id == clerk_user.primary_email_address_id:
                primary_email = email_obj.email_address
                break
        
        # Fallback if primary ID matches nothing, grab the first available email
        if not primary_email and clerk_user.email_addresses:
            primary_email = clerk_user.email_addresses[0].email_address

        if not primary_email:
            logger.error("user have no email address" , clerk_id=clerk_user.id)
            raise ValueError(f"Clerk user {clerk_user.id} has no valid email address.")

        # 2. Check if the user already exists locally (idempotency check)
        existing_user = userRepository.get_user_by_id(db=db, clerk_id=clerk_user.id)
        
        if existing_user:
            logger.info("user with the given username or email exists" , clerk_id=clerk_user.id, email = primary_email)
            raise HTTPException(status_code=409, detail=f"user with same ID exists")

        # 3. Formulate full name
        first = clerk_user.first_name or ""
        last = clerk_user.last_name or ""
        username = clerk_user.username
        fullname = f"{first} {last}".strip() or "Clerk User"

        if not username:
            username = f"{primary_email.split('@')[0]}_{uuid.uuid4().hex[:4]}"
       
        new_user = userRepository.create_clerk_user(
            db=db,
            clerk_id=clerk_user.id,
            email=primary_email.lower(),
            fullname=fullname,
            username=username
        )

        return new_user
    
    def delete_user(self, db: Session, clerk_user: user.ClerkWebhookData):
        existing_user = userRepository.get_user_by_id(db=db, clerk_id=clerk_user.id)
        
        if not existing_user:
            logger.info("user with the given username or email doent exists" , clerk_id=clerk_user.id)
            raise HTTPException(status_code=409, detail=f"user with the given ID doesnt exist")
        
        return userRepository.detele_user(db, existing_user)


    
    def complete_user_onboarding(self, db:Session, current_user_id:str, phone:user.PhoneOnboardingSchema) -> User:
        logger.info("trying to onboard user" , clerk_id = current_user_id)
        updated_user = userRepository.update_user_onboarding(db=db,clerk_id=current_user_id,phone=phone)
        return updated_user
    

userservice = UserService()