from beanie import Document
from pydantic import EmailStr, Field
from typing import Optional

class AdminUser(Document):
    email: EmailStr
    name: Optional[str] = ""
    password_hash: str  # hashed password
    is_superadmin: Optional[bool] = False  # optional for roles

    class Settings:
        name = "admin_users"
