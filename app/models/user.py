from abc import ABC
from pydantic import BaseModel,EmailStr,field_validator
import re
from app.models.postal_address import PostalAddressCreate
from sqlalchemy.orm import declarative_base

Base = declarative_base()
class User(ABC,BaseModel):
    email:EmailStr
    password:str
    first_name:str
    name:str
    phone_number:str
    account_type:str
    class Config:
        from_attributes = True 

    
    @field_validator("email")
    def name_must_be_nonempty(cls, v):
        if not v.strip():
            raise ValueError("Name cannot be empty")
        return v
    
    @field_validator("password")
    def password_strength(cls, v):
        if not all([
            len(v) >= 8,
            re.search(r"[A-Z]", v),
            re.search(r"[a-z]", v),
            re.search(r"[0-9]", v),
            re.search(r"[\W_]", v)
        ]):
            raise ValueError("Password must be ≥8 chars, with upper, lower, digit, and special char")
        return v

    def get_summary(self):
        return f"{self.name},{self.first_name},{self.phone_number},{self.account_type},{self.postal_address}"
