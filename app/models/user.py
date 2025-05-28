from abc import ABC
import re

from pydantic import BaseModel, EmailStr, field_validator
from sqlalchemy.orm import declarative_base

from constants import Account_status, Account_type

Base = declarative_base()


class User(ABC, BaseModel):
    email: EmailStr
    password: str
    first_name: str
    name: str
    phone_number: str
    account_type: Account_type
    status: Account_status = Account_status.UNVERIFIED

    class Config:
        from_attributes = True

    @field_validator("email")
    def name_must_be_nonempty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Name cannot be empty")
        return v

    @field_validator("password")
    def password_strength(cls, v: str) -> str:
        if not all(
            [
                len(v) >= 8,
                re.search(r"[A-Z]", v),
                re.search(r"[a-z]", v),
                re.search(r"[\d]", v),
                re.search(r"[\W_]", v),
            ]
        ):
            raise ValueError(
                "Password must be ≥8 chars, with upper, lower, digit, and special char"
            )
        return v

    def get_summary(self):
        return f"{self.name},{self.first_name},{self.phone_number},{self.account_type}."
