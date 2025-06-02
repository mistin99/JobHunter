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
    member_ids: list[int] = Field(default_factory=list)


class OrganizationSearchDto(BaseModel):
    id: int | None = None
    email: str | list[str] = Field(default_factory=list)
    name: str | list[str] = Field(default_factory=list)
    status: str | list[Status] = Field(default_factory=list)
    member: str | list[int] = Field(default_factory=list)
    job_offer_id: int | list[int] = Field(default_factory=list)
    limit: int = 100
