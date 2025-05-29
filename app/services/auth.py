from typing import cast

from sqlalchemy.orm import Session

from core.security import create_verification_token
from dtos.user import UserDto
from entities.user import User
from services.email import send_verification_email
from utils import convert_enums_to_values


class AuthService[MT: UserDto, ET: User]:

    def __init__(self, db: Session) -> None:
        self.db = db

    def signup(self, user: MT) -> ET:
        data = user.model_dump()
        data = convert_enums_to_values(data)
        entity = User(**data)
        self.db.add(entity)
        self.db.commit()
        self.db.refresh(entity)
        token = create_verification_token(entity.id)
        send_verification_email(cast(str, entity.email), token)
        return entity
