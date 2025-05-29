from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from entities.base import BaseEntity


class Address(BaseEntity):
    __tablename__ = "addresses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    street_line1: Mapped[str] = mapped_column(String(100))
    street_line2: Mapped[str] = mapped_column(String(100))
    country: Mapped[str] = mapped_column(String(50))
    city: Mapped[str] = mapped_column(String(50))
    zip_code: Mapped[str] = mapped_column(String(20))
