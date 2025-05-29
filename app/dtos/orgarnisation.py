from pydantic import BaseModel


class OrganizationDto(BaseModel):
    website_url: str
    description: str