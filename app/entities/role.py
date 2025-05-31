from sqlalchemy import Enum, Integer
from sqlalchemy.orm import Mapped, mapped_column

from constants import Role
from entities.base import BaseEntity


class UserRole(BaseEntity):
    __tablename__ = "roles"

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True, index=True, nullable=False
    )
    value: Mapped[Role] = mapped_column(
        Enum(
            Role,
            values_callable=lambda enum_class: [e.value for e in enum_class],
            native_enum=False,
        ),
        nullable=False,
        unique=True,
    )
