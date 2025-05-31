from typing import Annotated

from pydantic import BaseModel, BeforeValidator, ConfigDict, EmailStr

from constants import Status
import dtos.validators as validators


class BaseUserDto(BaseModel):
    id: int | None = None
    model_config = ConfigDict(from_attributes=True)
    email: Annotated[EmailStr, BeforeValidator(validators.not_empty)]


# TODO add all user fields in here
class UserDto(BaseUserDto):
    status: Status = Status.PENDING
    phone_number: str | None = None
    first_name: Annotated[str, BeforeValidator(validators.not_empty)]
    last_name: Annotated[str, BeforeValidator(validators.not_empty)]
    password: Annotated[str, BeforeValidator(validators.strong_password)]


class UserSignUpDto(BaseUserDto):
    status: Status = Status.PENDING
    phone_number: str | None = None
    first_name: Annotated[str, BeforeValidator(validators.not_empty)]
    last_name: Annotated[str, BeforeValidator(validators.not_empty)]
    password: Annotated[str, BeforeValidator(validators.strong_password)]



class UserSignInDto(BaseUserDto):
    password: Annotated[str, BeforeValidator(validators.strong_password)]