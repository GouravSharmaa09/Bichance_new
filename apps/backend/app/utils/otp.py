import random
import string
from datetime import datetime, timedelta, timezone
from app.models.otp import OTP
from fastapi import HTTPException

COOLDOWN_SECONDS = 60  # You can change this to 90/120/etc.


# Simple in-memory store (replace with Redis or Mongo collection)
otp_store = {}

def generate_otp(length: int = 6) -> str:
    return ''.join(random.choices(string.digits, k=length))

async def save_otp(email: str, otp: str):
    existing_otp = await OTP.find_one({"email": email})
    now = datetime.now(timezone.utc)  # Ensure this is timezone-aware

    if existing_otp:
        # Ensure existing datetime is timezone-aware
        created = existing_otp.created_at
        if created.tzinfo is None:
            created = created.replace(tzinfo=timezone.utc)

        # Apply cooldown check
        if (now - created).total_seconds() < COOLDOWN_SECONDS:
            remaining = COOLDOWN_SECONDS - int((now - created).total_seconds())
            raise HTTPException(status_code=429, detail=f"Wait {remaining} seconds before requesting another OTP.")

    # Set expiry
    expires = now + timedelta(minutes=5)

    if existing_otp:
        existing_otp.otp = otp
        existing_otp.created_at = now
        existing_otp.expires_at = expires
        await existing_otp.save()
    else:
        otp_entry = OTP(email=email, otp=otp, created_at=now, expires_at=expires)
        await otp_entry.insert()


async def verify_otp(email: str, otp: str) -> bool:
    otp_doc = await OTP.find_one(OTP.email == email)
    if not otp_doc:
        return False

    now = datetime.now(timezone.utc)

    # Ensure timezone-aware comparison
    expires_at = otp_doc.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    if now > expires_at:
        await otp_doc.delete()
        return False

    if otp_doc.otp != otp:
        return False

    await otp_doc.delete()
    return True
