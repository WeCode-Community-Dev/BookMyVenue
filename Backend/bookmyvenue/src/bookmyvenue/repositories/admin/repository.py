from fastapi import HTTPException,status
from sqlalchemy import insert
from sqlalchemy.exc import SQLAlchemyError
import structlog
from typing import List, Optional
from sqlalchemy.orm import Session

from src.bookmyvenue.schema.admin.admin import AmenitySchema, CategorySchema
from src.bookmyvenue.schema.user.user import PhoneOnboardingSchema
from src.bookmyvenue.models.user import User
from src.bookmyvenue.models.admin import Admin, Amenity, Category

logger = structlog.get_logger()
class AdminRepository:
    def get_the_admin_by_user(self, db:Session, clerk_id:str) -> Optional[Admin]:
        clerk_user = db.query(User).filter_by(clerkUserID=clerk_id).first()  #filter based search is fast for getting a spevific element
        if not clerk_user:
            logger.error("user record not found for checking whether he/she is admin" ,clerk_id=clerk_id)
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="user not found in DB")
        return db.query(Admin).filter_by(user=clerk_user).first()
    
    def check_the_existing_category(self, db:Session, categories:List[CategorySchema]):
       category_names = [cat.name for cat in categories] #collecting all the category names first

       return db.query(Category).filter(Category.name.in_(category_names)).all() # .in_ checks with the entire data present in the DB with the given names

    def check_the_existing_amenity(self, db:Session, amenities:List[AmenitySchema]):
       amenities_names = [amenity.name for amenity in amenities] #collecting all the category names first

       return db.query(Amenity).filter(Amenity.name.in_(amenities_names)).all() # .in_ checks with the entire data present in the DB with the given names  
    
    def add_the_categories(self, db:Session, categories:List[CategorySchema]) -> bool:
        #performing bulk insert in the db

        #convert the categories into plain list of dicts

        dict_categoryies_to_add = []

        for category in categories:
            dict_item = {
                "name" : category.name,
                "icon_name" : category.icon_name
            }
            dict_categoryies_to_add.append(dict_item)
        
        # this execute is used to bulk add the categories
        try:

            db.execute(
                insert(Category),
                dict_categoryies_to_add
            )

            db.commit()
        except SQLAlchemyError as e:
            db.rollback()  # is used to roll back the updates if any problem with the bulk addition

            logger.error("something went wrong with the adding of the categories....")
            raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Transaction failed and was entirely reversed. Error: {str(e)}"
             )
        
        return True
    
    def add_the_amenities(self, db:Session, amenities:List[AmenitySchema]) -> bool:
        #performing bulk insert in the db

        #convert the categories into plain list of dicts

        dict_amenities_to_add = []

        for amenity in amenities:
            dict_item = {
                "name" : amenity.name,
                "icon_name" : amenity.iconName
            }
            dict_amenities_to_add.append(dict_item)
        
        # this execute is used to bulk add the categories
        try:

            db.execute(
                insert(Amenity),
                dict_amenities_to_add
            )

            db.commit()
        except SQLAlchemyError as e:
            db.rollback()  # is used to roll back the updates if any problem with the bulk addition

            logger.error("something went wrong with the adding of the amenities....")
            raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Transaction failed and was entirely reversed. Error: {str(e)}"
             )
        
        return True

       

    
    
            
adminRepository = AdminRepository()