from pydantic import BaseModel, EmailStr, Field
from typing import Literal
from datetime import datetime

# What react sends when registering

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    phone_number: str
    password: str = Field(..., min_length=8, max_length=72)
    # New users are always created with the default "user" role server-side

    
    
# What react send when logging in

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    

# What FastAPI send back. It does not sends back password

class UserOut(BaseModel):
    id: int
    name: str | None = None
    email: EmailStr
    phone_number: str | None = None
    role: str
    is_active: bool
    auth_provider: str
    created_at: datetime
    is_venue_owner: bool = False
    
    model_config = {"from_attributes": True}
    

# What FastAPI sends back after login

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    
 
# Schema to validate the incoming request.   
class GoogleAuthRequest(BaseModel):
    id_token: str


class UserProfileUpdate(BaseModel):
    name: str | None = None
    phone_number: str | None = None
    password: str | None = Field(default=None, min_length=8, max_length=72)