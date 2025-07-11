from typing import TYPE_CHECKING

from sqlalchemy import Enum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from constants import Status
from entities.address import Address
from entities.base import BaseEntity

if TYPE_CHECKING:
    from entities.user import User
    from entities.job_offer import JobOffer


class Organization(BaseEntity):
    __tablename__ = "organizations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(100), unique=True)
    name: Mapped[str] = mapped_column(String(50), unique=True)
    website_url: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[Status] = mapped_column(
        Enum(
            Status,
            values_callable=lambda enum_class: [e.value for e in enum_class],  # type: ignore
            native_enum=False,
        ),
        nullable=False,
    )
    address_id: Mapped[int] = mapped_column(ForeignKey("addresses.id"))

    # Navigation properties
    job_offers: Mapped[list["JobOffer"]] = relationship(
        "JobOffer", back_populates="organization", cascade="all, delete-orphan"
    )
    address: Mapped[Address] = relationship("Address")
    members: Mapped[list["User"]] = relationship(
        "User", back_populates="organization", cascade="all, delete-orphan"
    )

    @property
    def member_ids(self) -> list[int]:
        return [m.id for m in self.members]
