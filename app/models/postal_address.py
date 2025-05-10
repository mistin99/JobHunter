from pydantic import BaseModel
from sqlalchemy import Column, Integer, String,ForeignKey
from sqlalchemy.orm import declarative_base,relationship

Base = declarative_base()

class PostalAddress(Base):
    __tablename__ = "postal_address" 
    
    id = Column(Integer, primary_key=True, index=True)
    street_line1 = Column(String)
    street_line2 = Column(String)
    country = Column(String)
    city = Column(String)
    zip_code = Column(String)
    owner_id = Column(Integer, nullable=False)
    owner_type = Column(String, nullable=False)


class PostalAddressCreate(BaseModel):
    street_line1:str
    street_line2:str
    country:str
    city:str
    zip_code:int
    class Config:
        from_attributes = True

