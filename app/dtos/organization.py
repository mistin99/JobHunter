from pydantic import BaseModel, ConfigDict, Field

from constants import Status
from dtos.user import UserDto


class AddressDto(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int | None = None
    street_line1: str
    street_line2: str
    country: str
    city: str
    zip_code: str


class OrganizationDto(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int | None = None
    status: Status = Status.PENDING
    email: str
    name: str
    website_url: str
    description: str
    address: AddressDto
    members: list[UserDto] = Field(default_factory=list)
