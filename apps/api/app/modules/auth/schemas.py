from pydantic import BaseModel
from uuid import UUID


class ProfileResponse(BaseModel):
    full_name: str | None
    phone: str | None
    avatar_url: str | None
    status: str


class AuthMeResponse(BaseModel):
    id: UUID
    email: str | None
    profile: ProfileResponse
    roles: list[str]


class ForgotPasswordRequest(BaseModel):
    email: str
    redirect_to: str
