from typing import List

import structlog
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import redis.asyncio as aioredis
from src.bookmyvenue.schema.admin.admin import AmenitesSchema, CategoriesSchema, CategorySchema
from src.bookmyvenue.models.admin import Admin
from src.bookmyvenue.api.deps import admin_only_route, get_the_db_Session, get_the_redis_client
from src.bookmyvenue.services.adminService import adminservice

logger = structlog.get_logger()
router = APIRouter(
    prefix='/admin'
)

@router.post('/category')
async def add_category(category:CategoriesSchema,db:Session = Depends(get_the_db_Session), admin_user:Admin = Depends(admin_only_route), redis:aioredis.Redis = Depends(get_the_redis_client)):
    """
        this endpoint is protected with the role based access such that only admins can access this route.
    """

    category_addition_acknowledment = adminservice.add_category(db=db, categories=category.category)

    if category_addition_acknowledment:
        logger.info("successfully created the categories...." , admin_user = admin_user.user_id)
        await redis.delete('bmv:categories:all')
        raise HTTPException(
            status_code=status.HTTP_201_CREATED,
            detail=f"successfully created the categories"
        )
    else:
        logger.error("cant complete the categories addition...." , admin_user = admin_user.user_id)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"some errors occured and cant complete the creation of categories."
        )



@router.post('/amenity')
async def add_amenity(amenity:AmenitesSchema,db:Session = Depends(get_the_db_Session), admin_user:Admin = Depends(admin_only_route), redis:aioredis.Redis = Depends(get_the_redis_client)):
    """
        this endpoint is protected with the role based access such that only admins can access this route.
    """

    amenity_addition_acknowledment = adminservice.add_amenity(db=db, amenities=amenity.amenity)

    if amenity_addition_acknowledment:
        logger.info("successfully created the amenities...." , admin_user = admin_user.user_id)
        await redis.delete('bmv:amenities:all')
        raise HTTPException(
            status_code=status.HTTP_201_CREATED,
            detail=f"successfully created the amenities"
        )
    else:
        logger.error("cant complete the amenitiy addition...." , admin_user = admin_user.user_id)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"some errors occured and cant complete the creation of amenities."
        )