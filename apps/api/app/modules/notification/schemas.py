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
