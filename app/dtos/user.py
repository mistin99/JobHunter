from typing import Annotated

from pydantic import BaseModel, BeforeValidator, ConfigDict, EmailStr

from constants import Status
import dtos.validators as validators


class BaseUserDto(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    email: Annotated[EmailStr, BeforeValidator(validators.not_empty)]


# TODO add all user fields in here
class UserDto(BaseUserDto):
    id: int | None = None
    status: Status = Status.PENDING
    first_name: Annotated[str, BeforeValidator(validators.not_empty)]
    last_name: Annotated[str, BeforeValidator(validators.not_empty)]
    password: Annotated[str, BeforeValidator(validators.strong_password)]
    phone_number: Annotated[str, BeforeValidator(validators.not_empty)]


class UserSignUpDto(BaseUserDto):
    id: int | None = None
    status: Status = Status.PENDING
    first_name: Annotated[str, BeforeValidator(validators.not_empty)]
    last_name: Annotated[str, BeforeValidator(validators.not_empty)]
    password: Annotated[str, BeforeValidator(validators.strong_password)]
    phone_number: Annotated[str, BeforeValidator(validators.not_empty)]



class UserSignInDto(BaseUserDto):
    id: int
    password: Annotated[str, BeforeValidator(validators.strong_password)]