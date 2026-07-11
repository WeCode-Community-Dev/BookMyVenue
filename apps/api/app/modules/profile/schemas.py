from pydantic import BaseModel, EmailStr


class ProfileResponse(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    role: str


class UpdateProfileRequest(BaseModel):
    full_name: str | None = None
