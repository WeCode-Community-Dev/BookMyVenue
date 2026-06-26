from typing import Annotated, List
from fastapi import APIRouter, HTTPException, status, Depends
from schemas.venue_category import VenueCategoryOut, VenueCategoryCreate
from sqlalchemy.orm import Session
from sqlalchemy import func, select
from utils.dependencies import require_role
from database import get_db
from models.user import RoleEnum
from models.venue_category import VenueCategory

router = APIRouter()


@router.post(
    "/",
    dependencies=[Depends(require_role(RoleEnum.ADMIN))],
    response_model=VenueCategoryOut,
    status_code=status.HTTP_201_CREATED

)
def create_category(venue_category_create: VenueCategoryCreate, db: Annotated[Session, Depends(get_db)]):
    result = db.execute(select(VenueCategory).where(func.lower(
        VenueCategory.slug) == venue_category_create.slug.lower()),)

    existing_slug = result.scalars().first()
    if existing_slug:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category already exists"
        )
    new_category = VenueCategory(
        name=venue_category_create.name,
        slug=venue_category_create.slug
    )
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category


@router.get(
    "/",
    response_model=List[VenueCategoryOut],
    status_code=status.HTTP_200_OK
)
def get_categories(db: Annotated[Session, Depends(get_db)]):
    result = db.execute(select(VenueCategory).where(
        VenueCategory.is_active == True))
    categories = result.scalars().all()
    return categories
