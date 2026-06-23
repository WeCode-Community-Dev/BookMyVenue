from pydantic import BaseModel

class AmenityOut(BaseModel):
    id: int
    name: str

    model_config = {"from_attributes": True}