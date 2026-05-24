from pydantic import BaseModel


## Admin Auth Schema
class AdminAuthRequest(BaseModel):
    email: str
    password: str


class AdminAuthResponse(BaseModel):
    email: str
    is_authenticated: bool


## Venue owner Auth Schema

## User/Customer Auth Schema
