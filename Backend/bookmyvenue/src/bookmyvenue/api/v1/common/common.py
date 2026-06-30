import json
from typing import List

from pydantic import TypeAdapter
import structlog
import redis.asyncio as aioredis
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.bookmyvenue.schema.admin.admin import AmenitySchema, CategorySchema
from src.bookmyvenue.schema.responce.responces import AmenityFetchedResponce, CategoryFetchedResponce, ResponceAmenitySchema, ResponceCategorySchema
from src.bookmyvenue.api.deps import get_the_db_Session, get_the_redis_client
from src.bookmyvenue.services.commonService import commonService

logger = structlog.get_logger()
router = APIRouter()

@router.get("/categories", response_model=CategoryFetchedResponce)
async def get_the_categories(
    db: Session = Depends(get_the_db_Session),
    redis: aioredis.Redis = Depends(get_the_redis_client)
):
    categories_adapter = TypeAdapter(List[ResponceCategorySchema])
    #key used for accessing the categories
    CACHE_KEY = 'bmv:categories:all'
    cached_categories = await redis.get(CACHE_KEY)
    if cached_categories:
        logger.info("successfully fetched the categories from cache")
        decoded_redis_data = json.loads(cached_categories)
        return {
            "status_code": 200,
            "message": "fetched the categories successfully",
            "data": categories_adapter.validate_json(decoded_redis_data)
        }
    
    #get the categories listed in the categories table when it is not found in the redis
    categories = commonService.get_the_categories(db)
    logger.info("successfully fetched the categories")
    
    
    pydantic_categories = categories_adapter.validate_python(
        categories, 
        from_attributes=True
    )

    # 5. Dump directly to a JSON string using Pydantic's high-performance encoder
    # (This avoids using standard json.dumps which crashes on custom objects)
    json_string = categories_adapter.dump_json(pydantic_categories).decode("utf-8")

    logger.info("successfully fetched the categories from cache")
    await redis.set(CACHE_KEY, json.dumps(json_string)) #No TTL is given since this has to be invalidated based on the event if category creation or deletion

    return {
        "status_code": 200,
        "message": "fetched the categories successfully",
        "data": categories
    }


@router.get("/amenities", response_model=AmenityFetchedResponce)
async def get_the_amenities(
    db: Session = Depends(get_the_db_Session),
    redis: aioredis.Redis = Depends(get_the_redis_client)
):
    amenities_adapter = TypeAdapter(List[ResponceAmenitySchema])  # type adapter is used to validate a list of objects
    #get the categories listed in the categories table
    CACHE_KEY = 'bmv:amenities:all'
    await redis.delete(CACHE_KEY)
    logger.info("successfully fetched the amenities")
    cached_amenities = await redis.get(CACHE_KEY)
    if cached_amenities:
        logger.info("successfully fetched the categories from cache")
        decoded_redis_data = json.loads(cached_amenities)
        return {
            "status_code": 200,
            "message": "fetched the categories successfully",
            "data": amenities_adapter.validate_json(decoded_redis_data)
        }
    amenities = commonService.get_the_amenities(db)

    pydantic_amenities = amenities_adapter.validate_python(
        amenities, 
        from_attributes=True
    )

    # 5. Dump directly to a JSON string using Pydantic's high-performance encoder
    # (This avoids using standard json.dumps which crashes on custom objects)
    json_string = amenities_adapter.dump_json(pydantic_amenities).decode("utf-8")

    logger.info("successfully fetched the categories from cache")
    await redis.set(CACHE_KEY, json.dumps(json_string)) #No TTL is given since this has to be invalidated based on the event if category creation or deletion

    return {
        "status_code": 200,
        "message": "fetched the amenities successfully",
        "data": amenities
    }
    
   