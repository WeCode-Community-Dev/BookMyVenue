from datetime import datetime

from pydantic import BaseModel


class NotificationResponse(BaseModel):
    id: str
    user_id: str
    booking_id: str | None
    type: str
    title: str
    body: str
    read_at: datetime | None
    created_at: datetime


class PaginatedMeta(BaseModel):
    page: int
    per_page: int
    total: int
    total_pages: int


class NotificationListResponse(BaseModel):
    data: list[NotificationResponse]
    meta: PaginatedMeta

