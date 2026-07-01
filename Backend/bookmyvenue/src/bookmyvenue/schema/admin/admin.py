from typing import List

from pydantic import BaseModel, Field


class CategorySchema(BaseModel):
    name: str
    icon_name: str   # this field validation helps to match the 'icon_name' column of the Category table to map 'iconName' coming from frontend

class CategoriesSchema(BaseModel):
    category: List[CategorySchema]


class AmenitySchema(BaseModel):
    name: str
    icon_name: str

class AmenitesSchema(BaseModel):
    amenity: List[AmenitySchema]