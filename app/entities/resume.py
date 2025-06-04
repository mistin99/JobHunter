from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Integer, LargeBinary, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from entities.base import BaseEntity

if TYPE_CHECKING:
    from entities.user import User


class Resume(BaseEntity):
    __tablename__ = "resumes"

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True, index=True, nullable=False
    )
    title: Mapped[str] = mapped_column(String(100))
    file_name: Mapped[str] = mapped_column(String(50))
    content_type: Mapped[str] = mapped_column(String(255))
    content: Mapped[bytes] = mapped_column(LargeBinary)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)

    # Navigation properties
    user: Mapped["User"] = relationship("User", back_populates="resumes")
