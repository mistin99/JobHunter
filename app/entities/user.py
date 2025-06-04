import datetime
from typing import TYPE_CHECKING

from sqlalchemy import Column, DateTime, Enum, ForeignKey, Integer, String, Table
from sqlalchemy.orm import Mapped, mapped_column, relationship

from constants import Status
from entities.base import BaseEntity

if TYPE_CHECKING:
    from entities.role import UserRole
    from entities.job_offer import JobOffer
    from entities.organization import Organization
    from entities.resume import Resume


class UserApplication(BaseEntity):
    __tablename__ = "users_applications"

    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id"), primary_key=True, nullable=False
    )
    job_offer_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("job_offers.id"), primary_key=True, nullable=False
    )
    resume_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("resumes.id"), primary_key=True, nullable=False
    )
    status: Mapped[Status] = mapped_column(
        Enum(
            Status,
            values_callable=lambda enum_class: [e.value for e in enum_class],  # type: ignore
            native_enum=False,
        ),
        nullable=False,
    )
    application_date: Mapped[datetime.datetime] = mapped_column(
        "application_date",
        DateTime,
        default=datetime.datetime.now(datetime.timezone.utc),
    )

    # Navigation properties
    user: Mapped["User"] = relationship("User", back_populates="applications")
    job_offer: Mapped["JobOffer"] = relationship(
        "JobOffer", back_populates="applications"
    )


users_roles = Table(
    "users_roles",
    BaseEntity.metadata,
    Column("user_id", ForeignKey("users.id"), primary_key=True, nullable=False),
    Column("role_id", ForeignKey("roles.id"), primary_key=True, nullable=False),
)


class User(BaseEntity):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True, index=True, nullable=False
    )
    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    first_name: Mapped[str] = mapped_column(String(20), nullable=False)
    last_name: Mapped[str] = mapped_column(String(20), nullable=False)
    phone_number: Mapped[str] = mapped_column(String(30), nullable=True)
    status: Mapped[Status] = mapped_column(
        Enum(
            Status,
            values_callable=lambda enum_class: [e.value for e in enum_class],  # type: ignore
            native_enum=False,
        ),
        nullable=False,
    )

    organization_id: Mapped[int] = mapped_column(
        ForeignKey("organizations.id"), nullable=True
    )

    # Navigation property
    applications: Mapped[list["UserApplication"]] = relationship(
        "UserApplication", back_populates="user"
    )
    roles: Mapped[list["UserRole"]] = relationship(
        "UserRole", secondary=users_roles, backref="users"
    )
    organization: Mapped["Organization"] = relationship(
        "Organization", back_populates="members"
    )
    resumes: Mapped[list["Resume"]] = relationship("Resume", back_populates="user")
