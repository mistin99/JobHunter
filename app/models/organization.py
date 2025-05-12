from app.models.user import User 
from pydantic import BaseModel
from sqlalchemy import Column, Integer, String,ForeignKey
from sqlalchemy.orm import declarative_base
from app.constants import Account_type

Base = declarative_base()

class Organization(Base):
    __tablename__ = "organization"
    
    id = Column(Integer,primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    first_name = Column(String)
    name = Column(String)
    phone_number = Column(String)
    postal_address = Column(String)
    website_url = Column(String)
    description = Column(String)
    account_type = Column(SQLEnum(AccountType), nullable=False)

class OrganizationCreate(User):
    website_url:str
    description:str
    account_type:Account_type = Account_type.PERSON
    class Config:
        from_attributes = True