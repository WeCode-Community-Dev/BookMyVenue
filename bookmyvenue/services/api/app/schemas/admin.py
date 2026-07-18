from pydantic import BaseModel
from typing import Generic, TypeVar, List

from models.venue import StatusEnum

T = TypeVar("T")


class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    total: int
    page: int
    limit: int
    pages: int


class VenueStatusUpdate(BaseModel):
    status: StatusEnum


class CategoryStatusUpdate(BaseModel):
    is_active: bool
