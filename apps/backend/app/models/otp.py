from beanie import Document
from pydantic import Field
from datetime import datetime, timezone

class OTP(Document):
    email: str
    otp: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    expires_at: datetime
