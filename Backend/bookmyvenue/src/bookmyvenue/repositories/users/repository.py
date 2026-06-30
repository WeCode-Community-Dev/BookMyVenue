from fastapi import HTTPException,status
import structlog
from typing import Optional
from sqlalchemy.orm import Session

from src.bookmyvenue.schema.responce.responces import UserNotFoundResponce
from src.bookmyvenue.schema.user.user import PhoneOnboardingSchema
from src.bookmyvenue.models.user import User

logger = structlog.get_logger()
class UserRepository:
    def get_user_by_id(self, db:Session, clerk_id:str) -> Optional[User]:
        return db.query(User).filter_by(clerkUserID=clerk_id).first()  #filter based search is fast for getting a spevific element

    def create_clerk_user(self, db:Session, clerk_id:str, email:str, fullname:str, username:str) -> User:
        logger.info("registering the user " , clerk_id=clerk_id, email = email)
        dbOject = User(
            clerkUserID=clerk_id,
            email=email,
            username=username,
            fullname=fullname,
        )
        db.add(dbOject)
        logger.info("commiting the user to DB" , clerk_id=clerk_id, email = email)
        db.commit()
        db.refresh(dbOject)
        logger.info("created the user in DB" , clerk_id=clerk_id, email = email)
        return dbOject
    
    def update_user_onboarding(self, db:Session, clerk_id:str, phone:PhoneOnboardingSchema) -> User:
        current_user = db.query(User).filter_by(clerkUserID = clerk_id).first()
        if not current_user:
            logger.error("user record not found" ,clerk_id=clerk_id)
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="user not found in DB")
        
        current_user.phone = phone.phone

        logger.info("commiting the user onboarding to DB" , clerk_id=clerk_id)
        db.commit()
        db.refresh(current_user)
        return current_user
    
    def detele_user(self, db:Session, clerk_user:User):
        logger.info("deleting the user from DB" , clerk_id=clerk_user.clerkUserID)
        try:
            db.delete(clerk_user)
            db.commit()
            return True
        except Exception as e:
            return False
            
userRepository = UserRepository()