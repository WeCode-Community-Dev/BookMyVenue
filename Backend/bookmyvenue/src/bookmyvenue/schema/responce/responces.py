
from typing import List

from pydantic import BaseModel, ConfigDict


from src.bookmyvenue.schema.common.common import VenueSchema
from src.bookmyvenue.schema.admin.admin import AmenitySchema, CategorySchema
from src.bookmyvenue.schema.user.user import UserSchema


class BaseResponceClass(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    status_code:int
    message:str


class ResponceCategorySchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id:int
    name: str
    icon_name: str

class ResponceAmenitySchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id:int
    name: str
    icon_name: str

class UserCreatedResponce(BaseResponceClass):
    model_config = ConfigDict(from_attributes=True)
    data: UserSchema


class CategoryFetchedResponce(BaseResponceClass):
    model_config = ConfigDict(from_attributes=True)
    data: List[ResponceCategorySchema]


class AmenityFetchedResponce(BaseResponceClass):
    model_config = ConfigDict(from_attributes=True)
    data: List[ResponceAmenitySchema]


class CreatedVenueResponce(BaseResponceClass):
    model_config = ConfigDict(from_attributes=True)
    data: str

class UserUpdatedResponce(BaseResponceClass):
    responce_type:str = "ResourceUpdated"


class HealthStatusResponce(BaseResponceClass):
    status_code:int
    message:str


class UserNotFoundResponce(BaseResponceClass):
    responce_type:str = "NotFound"


class UserNotAuthenticatedResponce(BaseResponceClass):
    responce_type:str = "Unauthorized"