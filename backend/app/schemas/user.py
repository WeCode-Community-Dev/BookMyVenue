from pydantic import BaseModel, EmailStr
from typing import Literal
from datetime import datetime

# What react sends when registering

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    role: Literal["user","host"] = "user"
    
    
# What react send when logging in

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    

# What FastAPI send back. It does not sends back password

class UserOut(BaseModel):
    id: int
    email: EmailStr
    role: str
    is_active: bool
    created_at: datetime
    
    model_config = {"from_attributes": True}
    

# What FastAPI sends back after login

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"