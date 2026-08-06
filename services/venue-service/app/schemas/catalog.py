from pydantic import BaseModel, ConfigDict


class VenueCategoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    icon_url: str | None = None


class DistrictOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str


class CityDropdownOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    district_id: int


class CityOptionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str


class DistrictCityGroupOut(BaseModel):
    id: int
    name: str
    cities: list[CityOptionOut]
