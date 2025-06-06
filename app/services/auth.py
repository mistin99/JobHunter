import datetime
from typing import cast

from constants import Action, Role, Status, TokenType
from core.config import settings
from dtos.user import UserDto
from entities.user import User
from jose import JWTError, jwt
from services.user import UserService
from sqlalchemy.orm import Session
from utils import convert_enums_to_values


# TODO move out all db related logic to repository class
class AuthService:

    def __init__(self, db: Session) -> None:
        self.user_service = UserService(db=db)
        self.db = db

    def signup(self, user: UserDto) -> tuple[str, str, UserDto]:
        data = user.model_dump() | {"status": Status.PENDING}
        data = convert_enums_to_values(data)
        try:
            entity = User(**data)
            self.db.add(entity)
            self.db.flush()
        except Exception as e:
            raise RuntimeError("User with this email already exists!") from e
        dto = UserDto.model_validate(entity)
        self.user_service.manage_role(entity.id, Role.APPLICANT, Action.ADD)
        self.send_verification_email(dto)
        return self.signin(dto)

    def signin(self, user: UserDto) -> tuple[str, str, UserDto]:
        entity = cast(
            User, self.db.query(User).filter(User.email == user.email).first()
        )
        if not (entity and entity.password == user.password):
            raise LookupError("Invalid user credentials")
        return (
            self._create_token(entity.id, TokenType.ACCESS),
            self._create_token(entity.id, TokenType.REFRESH),
            UserDto.model_validate(entity),
        )

    def send_verification_email(self, user: UserDto) -> None:
        from services.email import send_verification_email

        if not user.id or not user.email:
            raise RuntimeError("Can not send email to non existant user!")
        token = self._create_token(user.id, TokenType.EMAIL_VERIFICATION)
        send_verification_email(user.email, token)

    def change_user_status(self, user_id: int, status: Status) -> UserDto:
        if not (entity := self.db.query(User).get(user_id)):
            raise RuntimeError("Account couldn't be verified!")
        entity = cast(User, entity)
        entity.status = status
        return UserDto.model_validate(entity)

    @classmethod
    def refresh_access_token(cls, refresh_token: str) -> str:
        try:
            user_id = cls.verify_token(refresh_token, TokenType.REFRESH)
            access_token = cls._create_token(user_id, TokenType.ACCESS)
        except JWTError as e:
            raise RuntimeError("Invalid refresh token") from e
        return access_token

    @staticmethod
    def verify_token(token: str, token_type: TokenType) -> int:
        payload = jwt.decode(
            token, key=settings.secret_key, algorithms=[settings.algorithm]
        )
        if TokenType(payload["type"]) != token_type:
            raise JWTError("Invalid token type: %s", token_type)
        return int(payload["sub"])

    @staticmethod
    def _create_token(user_id: int, token_type: TokenType) -> str:
        if token_type == TokenType.ACCESS:
            seconds = settings.access_token_expire_seconds
        elif token_type == TokenType.REFRESH:
            seconds = settings.refresh_token_expire_seconds
        elif token_type == TokenType.EMAIL_VERIFICATION:
            seconds = settings.email_verification_token_expire_seconds
        else:
            raise JWTError("Invalid token type: %s", token_type)

        delta = datetime.timedelta(seconds=seconds)
        expiry_date = datetime.datetime.now(datetime.timezone.utc) + delta
        claims = {
            "sub": str(user_id),
            "exp": expiry_date.timestamp(),
            "type": token_type,
        }
        return jwt.encode(claims, key=settings.secret_key, algorithm=settings.algorithm)
