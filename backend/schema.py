from pydantic import BaseModel

class Venue(BaseModel):
    name : str
    location : str
    price : float
    availability : bool = True
    capacity : int | None = None

    class Config:
        from_attributes = True

class CreateVenue(Venue):
    class Config:
        from_attributes = True
