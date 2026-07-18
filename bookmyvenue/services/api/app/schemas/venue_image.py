from pydantic import BaseModel, Field


class VenueImageOut(BaseModel):

    id: int
    venue_id: int
    image_url: str
    display_order: int

    model_config = {"from_attributes": True}
