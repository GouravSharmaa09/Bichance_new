from datetime import datetime, timedelta, timezone
import jwt
from app.core.config import settings
from jwt import PyJWTError
from fastapi import HTTPException, status
from uuid import uuid4


ACCESS_TOKEN_EXPIRE_MINUTES = 12
REFRESH_TOKEN_EXPIRE_DAYS = 7

def create_tokens(email: str):
    now = datetime.now(timezone.utc)

    access_payload = {
        "sub": email,
        "type": "access",
        "exp": now + timedelta(hours=ACCESS_TOKEN_EXPIRE_MINUTES)
    }
    refresh_payload = {
        "sub": email,
        "type": "refresh",
        "jti": str(uuid4()),
        "exp": now + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    }

    access_token = jwt.encode(access_payload, settings.SECRET_KEY, algorithm="HS256")
    refresh_token = jwt.encode(refresh_payload, settings.SECRET_KEY, algorithm="HS256")

    return access_token, refresh_token

def decode_token(token: str, expected_type: str = None):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])

        if expected_type and payload.get("type") != expected_type:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Invalid token type. Expected {expected_type}"
            )

        return payload

    except PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid or expired token"
        )