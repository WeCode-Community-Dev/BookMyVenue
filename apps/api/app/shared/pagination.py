from pydantic import BaseModel


class PaginationParams(BaseModel):
    page: int = 1
    page_size: int = 20


class Page[T](BaseModel):
    items: list[T]
    total: int
    page: int
    page_size: int
