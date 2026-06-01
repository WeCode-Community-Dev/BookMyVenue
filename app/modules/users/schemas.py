# schemas ths is for validation rules,what api accepts,returns
from datetime import datetime
from pydantic import BaseModel, EmailStr
from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str
    username: str
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    username: str
    email: EmailStr
    role: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }

class OwnerProfileCreate(BaseModel):
    business_name: str
    phone: str

class OwnerProfileResponse(BaseModel):
    id: int
    business_name: str
    phone: str

    model_config = {
        "from_attributes": True
    }

class UpdateUserSchema(BaseModel):
    name: str
    username: str
    