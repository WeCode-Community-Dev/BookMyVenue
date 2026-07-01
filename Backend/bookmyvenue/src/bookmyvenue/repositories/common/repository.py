from fastapi import HTTPException,status
import structlog
from typing import List, Optional
from sqlalchemy.orm import Session

from src.bookmyvenue.models.admin import Amenity, Category


logger = structlog.get_logger()

class CommonRepository:
    def fetch_all_the_categories(self, db:Session) -> Optional[List[Category]]:
        return db.query(Category).all()
    def fetch_all_the_amenities(self, db:Session) -> Optional[List[Amenity]]:
        return db.query(Amenity).all()

commonRepository = CommonRepository()