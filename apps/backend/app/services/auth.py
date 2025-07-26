# app/services/auth.py
from app.models.session import Session
from fastapi import HTTPException

async def logout_user(refresh_token: str):
    session = await Session.find_one(Session.refresh_token == refresh_token)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    session.is_active = False
    await session.save()
