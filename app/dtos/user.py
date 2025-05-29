from abc import ABC
from typing import Annotated

from pydantic import BaseModel, BeforeValidator, EmailStr

from constants import Status
import dtos.validators as validators


class UserDto(ABC, BaseModel):
    id: int | None = None
    status: Status = Status.PENDING
    email: Annotated[EmailStr, BeforeValidator(validators.not_empty)]
    password: Annotated[str, BeforeValidator(validators.strong_password)]
    first_name: Annotated[str, BeforeValidator(validators.not_empty)]
    last_name: Annotated[str, BeforeValidator(validators.not_empty)]
    phone_number: Annotated[str, BeforeValidator(validators.not_empty)]

    class Config:
        from_attributes = True

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.email}."
