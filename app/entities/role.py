from sqlalchemy import Enum, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from entities.base import BaseEntity
from constants import Role


class UserRole(BaseEntity):
    __tablename__ = "roles"

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True, index=True, nullable=False
    )
    value: Mapped[Role] = mapped_column(
        Enum(Role, native_enum=False), nullable=False, unique=True
    )
