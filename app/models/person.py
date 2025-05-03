from app.models.user import User 
from pydantic import BaseModel
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class Person(Base):
    __tablename__ = 'person'  # Table name in MySQL
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    first_name = Column(String)
    name = Column(String)
    phone_number = Column(String)
    postal_address = Column(String)
    account_type = Column(String)
    education = Column(String)
    skills = Column(String)

class PersonCreate(User,BaseModel):
    education:str
    skills:str

    class Config:
        orm_mode = True 