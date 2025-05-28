from pydantic import BaseModel
from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, declarative_base, mapped_column

Base = declarative_base()


class PostalAddress(Base):
    __tablename__ = "postal_address"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    street_line1 = mapped_column(String)
    street_line2 = mapped_column(String)
    country = mapped_column(String)
    city = mapped_column(String)
    zip_code = mapped_column(String)
    owner_id = mapped_column(Integer, nullable=False)
    owner_type = mapped_column(String, nullable=False)


class PostalAddressCreate(BaseModel):
    street_line1: str
    street_line2: str
    country: str
    city: str
    zip_code: int

    class Config:
        from_attributes = True
