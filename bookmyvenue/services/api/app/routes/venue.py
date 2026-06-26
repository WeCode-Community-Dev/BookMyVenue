from typing import Annotated, List
from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import func, select
from utils.dependencies import require_role
from models.user import User, RoleEnum
from models.venue_category import VenueCategory
from models.venue import Venue, StatusEnum
from models.venue_image import VenueImage
from schemas.venue import VenueOut, VenueCreate, VenueUpdate
from database import get_db
from utils.dependencies import get_current_user


router = APIRouter()


@router.post(
    "/",
    response_model=VenueOut,
    status_code=status.HTTP_201_CREATED,
)
def create_venue(venue_create: VenueCreate,
                 db: Annotated[Session, Depends(get_db)],
                 current_user: Annotated[User, Depends(require_role(RoleEnum.OWNER))]):
    result = db.execute(select(VenueCategory).where(
        VenueCategory.id == venue_create.category_id,
        VenueCategory.is_active == True))

    existing_cat = result.scalars().first()

    if not existing_cat:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category doesn't exist"
        )

    new_venue = Venue(
        owner_id=current_user.id,
        category_id=venue_create.category_id,
        name=venue_create.name,
        description=venue_create.description,
        address_line=venue_create.address_line,
        city=venue_create.city,
        pincode=venue_create.pincode,
        capacity=venue_create.capacity,
        supports_hourly=venue_create.supports_hourly,
        supports_daily=venue_create.supports_daily,
        hourly_price=venue_create.hourly_price,
        daily_price=venue_create.daily_price,
        amenities=venue_create.amenities,
        cancellation_policy=venue_create.cancellation_policy,
        status=StatusEnum.ACTIVE,

    )

    db.add(new_venue)
    db.flush()

    for index, image in enumerate(venue_create.image_urls):
        new_image = VenueImage(
            venue_id=new_venue.id,
            image_url=image,
            display_order=index,

        )
        db.add(new_image)
    db.commit()
    db.refresh(new_venue)

    return new_venue


@router.get(
    "/",
    response_model=List[VenueOut],
    status_code=status.HTTP_200_OK
)
def get_venues(db: Annotated[Session, Depends(get_db)]):

    result = db.execute(
        select(Venue)
        .options(selectinload(Venue.images))
        .where(Venue.status == StatusEnum.ACTIVE)
    )

    existing_venues = result.scalars().all()

    return existing_venues


@router.get(
    "/owner/me",
    dependencies=[Depends(require_role(RoleEnum.OWNER))],
    response_model=List[VenueOut],
    status_code=status.HTTP_200_OK
)
def owner_venues(db: Annotated[Session, Depends(get_db)],
                 current_user: Annotated[User, Depends(require_role(RoleEnum.OWNER))]):

    result = db.execute(select(Venue).where(Venue.owner_id == current_user.id))
    existing_venues = result.scalars().all()
    return existing_venues


@router.put(
    "/update/{venue_id}",
    response_model=VenueOut,
    status_code=status.HTTP_200_OK
)
def update_venue(venue_id: int,
                 venue_update: VenueUpdate,
                 db: Annotated[Session, Depends(get_db)],
                 current_user: Annotated[User, Depends(require_role(RoleEnum.OWNER))]):
    print("UPDATE ROUTE HIT")

    result_venue = db.execute(select(Venue).where(Venue.id == venue_id))
    current_venue = result_venue.scalars().first()
    print(current_venue, "current venue")

    if not current_venue:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Venue not found"
        )
    if current_venue.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this venue"
        )
    update_data = venue_update.model_dump(
        exclude_unset=True,
        exclude_none=True
    )

    if "category_id" in update_data:
        category = db.execute(
            select(VenueCategory).where(
                VenueCategory.id == update_data["category_id"],
                VenueCategory.is_active == True
            )
        ).scalars().first()

        if not category:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid category"
            )

    for field, value in update_data.items():
        setattr(current_venue, field, value)

    db.commit()
    db.refresh(current_venue)

    return current_venue


@router.get(
    "/{venue_id}",
    response_model=VenueOut,
    status_code=status.HTTP_200_OK
)
def get_venue(venue_id: int, db: Annotated[Session, Depends(get_db)]):

    result = db.execute(select(Venue).where(
        Venue.id == venue_id, Venue.status == StatusEnum.ACTIVE))
    existing_venue = result.scalars().first()

    if not existing_venue:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Venue not found"
        )

    return existing_venue
