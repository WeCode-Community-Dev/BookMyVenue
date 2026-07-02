from pydantic import BaseModel


class VenueTypeOut(BaseModel):
    id: int
    name: str

    model_config = {"from_attributes": True}