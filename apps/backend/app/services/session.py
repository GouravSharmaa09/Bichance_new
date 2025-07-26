# app/services/session.py

from app.models.session import Session
from uuid import uuid4
from datetime import datetime, timedelta, timezone
from app.utils.jwt import create_tokens
from fastapi import Request

async def create_or_update_session(
    email: str, 
    existing_session: Session = None, 
    request: Request = None
) -> Session:
    now = datetime.now(timezone.utc)
    access_token, refresh_token = create_tokens(email)

    user_agent = request.headers.get("user-agent") if request else None
    ip_address = request.client.host if request and request.client else None

    if existing_session:
        existing_session.access_token = access_token
        existing_session.refresh_token = refresh_token
        existing_session.expires_at = now + timedelta(days=7)
        existing_session.user_agent = user_agent
        existing_session.ip_address = ip_address
        await existing_session.save()
        return existing_session
    else:
        session = Session(
            session_id=str(uuid4()),
            email=email,
            access_token=access_token,
            refresh_token=refresh_token,
            created_at=now,
            expires_at=now + timedelta(days=7),
            user_agent=user_agent,
            ip_address=ip_address
        )
        await session.insert()
        return session
