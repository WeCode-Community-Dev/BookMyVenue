from typing import Generic, Optional, TypeVar
from pydantic import BaseModel

T = TypeVar("T")


## Base Response Schema Success/Error
class SuccessResponse(BaseModel, Generic[T]):
    status: bool = True
    message: str
    data: Optional[T] = None


class ErrorResponse(BaseModel):
    status: bool = False
    message: str
