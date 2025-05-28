from sqlalchemy import Enum, Integer, String
from sqlalchemy.orm import Mapped, declarative_base, mapped_column

from constants import Account_status, Account_type
from models.user import User

Base = declarative_base()


class Person(Base):
    __tablename__ = "person"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email = mapped_column(String, unique=True, index=True)
    password = mapped_column(String)
    first_name = mapped_column(String)
    name = mapped_column(String)
    phone_number = mapped_column(String)
    education = mapped_column(String)
    skills = mapped_column(String)
    account_type = mapped_column(Enum(Account_type), nullable=False)
    status: Mapped[Account_status] = mapped_column(
        Enum(
            Account_status,
            values_callable=lambda enum_class: [e.value for e in enum_class],  # type: ignore
            native_enum=False,
        ),
        nullable=False,
        server_default="Unverified",
    )


class PersonCreate(User):
    education: str
    skills: str
    account_type: Account_type = Account_type.PERSON
