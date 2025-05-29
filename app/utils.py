from enum import Enum
from functools import wraps
from typing import Any, Callable

from fastapi import Depends
from sqlalchemy.orm import Session


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
            return func(*args, db=db, **kwargs)

    return wrapper
