from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.utils.jwt import decode_token
from app.models.user import User
from app.models.session import Session

security = HTTPBearer(auto_error=True)

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> User:
    if credentials.scheme.lower() != "bearer":
        raise HTTPException(status_code=401, detail="Invalid authentication scheme")

    token = credentials.credentials
    payload = decode_token(token, expected_type="access")
    email = payload.get("sub")

    # ✅ Check if session exists and is active
    session = await Session.find_one(Session.access_token == token)
    if not session or not session.is_active:
        raise HTTPException(status_code=401, detail="Session not active or token expired")

    user = await User.find_one(User.email == email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user
