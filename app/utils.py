from enum import Enum
from functools import wraps
from typing import Any, Callable

from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends
from sqlalchemy.orm import Session

from constants import TokenType


def convert_enums_to_values(data: dict[str, Any]) -> dict[str, str]:
    for key, value in data.items():
        if isinstance(value, Enum):
            data[key] = value.value
    return data


def transactional(func: Callable) -> Callable:
    from database import get_db

    @wraps(func)
    def wrapper(*args, db: Session = Depends(get_db), **kwargs) -> Callable:
        with db.begin():
            result = func(*args, db=db, **kwargs)
            db.flush()
            db.commit()
            return result

    return wrapper


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/signin")

def get_current_user_id(token: str = Depends(oauth2_scheme)):
    from services.auth import AuthService

    return AuthService.verify_token(token, TokenType.ACCESS)