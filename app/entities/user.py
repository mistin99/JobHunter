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


users_applications = Table(
    "users_applications",
    BaseEntity.metadata,
    Column("user_id", ForeignKey("users.id"), primary_key=True),
    Column("job_offer_id", ForeignKey("job_offers.id"), primary_key=True),
    Column(
        "applied_at", DateTime, default=datetime.datetime.now(datetime.timezone.utc)
    ),
    Column(
        "status",
        Enum(Status, native_enum=False),
        nullable=False,
        default=Status.PENDING,
    ),
)

users_roles = Table(
    "users_roles",
    BaseEntity.metadata,
    Column("user_id", ForeignKey("users.id"), primary_key=True),
    Column("role_id", ForeignKey("roles.id"), primary_key=True),
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
    applications: Mapped[list["JobOffer"]] = relationship(
        "JobOffer",
        secondary=users_applications,
        back_populates="applicants",
    )
    roles: Mapped[list["UserRole"]] = relationship(
        "UserRole", secondary=users_roles, backref="users"
    )
    organization: Mapped["Organization"] = relationship(
        "Organization", back_populates="members"
    )
