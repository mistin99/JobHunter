from app.models.user import User 
from pydantic import BaseModel
from sqlalchemy import Column, Integer, String,ForeignKey
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class Person(Base):
    __tablename__ = "person" 
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    first_name = Column(String)
    name = Column(String)
    phone_number = Column(String)
    education = Column(String)
    skills = Column(String)
    account_type = Column(String)

class PersonCreate(User):
    education:str
    skills:str

    class Config:
        from_attributes = True 