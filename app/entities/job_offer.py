from typing import TYPE_CHECKING
from sqlalchemy import Column, Enum, ForeignKey, Integer, String, Table, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from entities.base import BaseEntity
from entities.organization import Organization
from entities.user import User, users_applications

if TYPE_CHECKING:
    from entities.job_tag import JobTag


# M:M table
job_offers_tags = Table(
    "job_offers_tags",
    BaseEntity.metadata,
    Column("job_offer_id", ForeignKey("job_offers.id"), primary_key=True),
    Column("job_tag_id", ForeignKey("job_tags.id"), primary_key=True),
)


class JobOffer(BaseEntity):
    __tablename__ = "job_offers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(50), nullable=False)
    description: Mapped[str] = mapped_column(String(255), nullable=False)
    organization_id: Mapped[int] = mapped_column(ForeignKey("organizations.id"))

    # Navigation properties
    tags: Mapped[list["JobTag"]] = relationship(
        "JobTag",
        secondary=job_offers_tags,
        back_populates="job_offers"
    )
    organization: Mapped[Organization] = relationship("Organization", back_populates="job_offers")
    applicants: Mapped[list[User]] = relationship(
        "User",
        secondary=users_applications,
        back_populates="applications",
    )