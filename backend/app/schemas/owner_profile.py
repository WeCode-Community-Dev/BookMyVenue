from pydantic import BaseModel

class OwnerProfileCreate(BaseModel):
    business_name: str

class OwnerProfileOut(BaseModel):
    id: int
    user_id: int
    business_name: str

    model_config = {"from_attributes": True}