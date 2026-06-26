from datetime import datetime
from pydantic import BaseModel, EmailStr, ConfigDict, Field

class UserRegister(BaseModel):
    name: str = Field(min_length=1, max_length=50)
    email: EmailStr = Field(max_length=120)
    password: str = Field(min_length=8, max_length=100)
    role: str = Field(default="booker", pattern="^(booker|owner|admin)$")


class UserLogin(BaseModel):
    email: EmailStr = Field(max_length=120)
    password: str = Field(min_length=8, max_length=100)

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str