from typing import List, Optional
import uuid

from fastapi import HTTPException, status
import structlog
from sqlalchemy.orm import Session

from src.bookmyvenue.repositories.common.repository import commonRepository
from src.bookmyvenue.models.admin import Amenity, Category




logger = structlog.get_logger()

class CommonService:
    def get_the_categories(self, db:Session) -> List[Category]:
        categories_list = commonRepository.fetch_all_the_categories(db)
        if not categories_list:
            logger.error("the categories table is empty , no category to show")
            raise HTTPException(status.HTTP_404_NOT_FOUND ,detail="categories are not found in the database")
        return categories_list
    
    def get_the_amenities(self, db:Session) -> List[Amenity]:
        amenity_list = commonRepository.fetch_all_the_amenities(db)
        if not amenity_list:
            logger.error("the amenity table is empty , no category to show")
            raise HTTPException(status.HTTP_404_NOT_FOUND ,detail="amenities are not found in the database")
        return amenity_list
    
        

        
       
    

commonService = CommonService()