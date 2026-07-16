from uuid import UUID

from pydantic import BaseModel, Field


class ChatMessageOut(BaseModel):
    id: UUID
    booking_id: UUID
    sender_id: UUID
    message: str
    created_at: str
    read_at: str | None = None

    class Config:
        from_attributes = True


class SendMessageIn(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)


class MarkReadOut(BaseModel):
    success: bool = True
    updated_count: int = 0


class ConversationOut(BaseModel):
    booking_id: UUID
    venue_name: str
    venue_city: str | None
    booking_status: str
    booking_date: str | None
    other_party_name: str | None
    last_message: str | None
    last_message_at: str | None
    last_sender_id: UUID | None
    unread_count: int

    class Config:
        from_attributes = True
