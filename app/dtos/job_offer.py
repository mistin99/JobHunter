from typing import Annotated

from pydantic import BaseModel, BeforeValidator, ConfigDict, Field

import dtos.validators as validators


class JobTagDto(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    value: str


class JobOfferDto(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int | None = None
    organization_id: int | None = None
    title: Annotated[str | None, BeforeValidator(validators.not_empty)] = None
    description: Annotated[str | None, BeforeValidator(validators.not_empty)] = None
    tags: Annotated[list[str], BeforeValidator(validators.parse_tags)]


class JobOfferSearchDto(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int | None = None
    organization_id: int | list[int] = Field(default_factory=list)
    title: str | list[str] = Field(default_factory=list)
    description: str | list[str] = Field(default_factory=list)
    tag: str | list[str] = Field(default_factory=list)
