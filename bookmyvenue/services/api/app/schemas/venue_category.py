from datetime import datetime
from pydantic import BaseModel, Field


class VenueCategoryCreate(BaseModel):
    name: str = Field(description='required field')
    slug: str = Field(description='required field')


class VenueCategoryOut(BaseModel):
    id: int
    name: str
    slug: str
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}
