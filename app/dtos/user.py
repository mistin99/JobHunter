from typing import Annotated

import dtos.validators as validators
from constants import Role, Status
from pydantic import BaseModel, BeforeValidator, ConfigDict, EmailStr, Field


class RoleDto(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    value: Role


class UserDto(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int | None = None
    status: Status | None = None
    phone_number: str | None = None
    organization_id: int | None = None
    email: Annotated[EmailStr | None, BeforeValidator(validators.not_empty)] = None
    first_name: Annotated[str | None, BeforeValidator(validators.not_empty)] = None
    last_name: Annotated[str | None, BeforeValidator(validators.not_empty)] = None
    password: Annotated[str | None, BeforeValidator(validators.strong_password)] = None
    roles: list[RoleDto] = Field(default_factory=list)
