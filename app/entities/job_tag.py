from sqlalchemy import Enum, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from constants import Tag
from entities.base import BaseEntity
from entities.job_offer import JobOffer, job_offers_tags


class JobTag(BaseEntity):
    __tablename__ = "job_tags"

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True, index=True, nullable=False
    )
    value: Mapped[Tag] = mapped_column(
        Enum(
            Tag,
            values_callable=lambda enum_class: [e.value for e in enum_class],  # type: ignore
            native_enum=False,
        ),
        nullable=False,
    )

    # Navigation properties
    job_offers: Mapped[list[JobOffer]] = relationship(
        "JobOffer", secondary=job_offers_tags, back_populates="tags"
    )
