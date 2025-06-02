from sqlalchemy import Enum, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from entities.base import BaseEntity
from entities.job_offer import JobOffer, job_offers_tags


class JobTag(BaseEntity):
    __tablename__ = "job_tags"

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True, index=True, nullable=False
    )
    value: Mapped[str] = mapped_column(
        String(50), nullable=False, unique=True, index=True
    )

    # Navigation properties
    job_offers: Mapped[list[JobOffer]] = relationship(
        "JobOffer", secondary=job_offers_tags, back_populates="tags"
    )
