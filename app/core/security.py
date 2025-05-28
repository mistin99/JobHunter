from datetime import datetime, timedelta, timezone
from typing import Any

from jose import jwt

from core.config import settings


def create_verification_token(user_id: int) -> str:
    expire = datetime.now(timezone.utc) + timedelta(hours=24)
    expire_timestamp = int(expire.timestamp())
    
    payload: dict[str,Any] = {
        "sub": str(user_id),
        "exp": expire_timestamp,
        "type": "email_verification"
    }
    token = jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)
    return token