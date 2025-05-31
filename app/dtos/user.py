from typing import Annotated

from pydantic import BaseModel, BeforeValidator, ConfigDict, EmailStr, Field

from constants import Role, Status
import dtos.validators as validators


class RoleDto(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    value: Role


class BaseUserDto(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int | None = None
    email: Annotated[EmailStr, BeforeValidator(validators.not_empty)]


# TODO add all user fields in here
class UserDto(BaseUserDto):
    status: Status = Status.PENDING
    phone_number: str | None = None
    first_name: Annotated[str, BeforeValidator(validators.not_empty)]
    last_name: Annotated[str, BeforeValidator(validators.not_empty)]
    password: Annotated[str, BeforeValidator(validators.strong_password)]
    roles: list[RoleDto] = Field(default_factory=list)


class UserSignUpDto(BaseUserDto):
    status: Status = Status.PENDING
    phone_number: str | None = None
    first_name: Annotated[str, BeforeValidator(validators.not_empty)]
    last_name: Annotated[str, BeforeValidator(validators.not_empty)]
    password: Annotated[str, BeforeValidator(validators.strong_password)]


class UserSignInDto(BaseUserDto):
    password: Annotated[str, BeforeValidator(validators.strong_password)]


class UserUpdateDto(BaseModel):
    id: int
    phone_number: str | None = None
    organization_id: int | None
    first_name: Annotated[str | None, BeforeValidator(validators.not_empty)] = None
    last_name: Annotated[str | None, BeforeValidator(validators.not_empty)] = None
