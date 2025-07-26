# app/models/session.py
from beanie import Document
from datetime import datetime
from pydantic import  EmailStr
from typing import Optional, Literal


class Session(Document):
    session_id: str
    email: EmailStr
    access_token: str
    refresh_token: str
    created_at: datetime
    expires_at: datetime
    user_agent: Optional[str] = None
    ip_address: Optional[str] = None
    is_active: bool = True  # Add this field
    type: Optional[Literal["user", "admin"]]= "user"  # <-- new field

    class Settings:
        name = "sessions"