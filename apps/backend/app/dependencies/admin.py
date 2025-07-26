from fastapi import Depends, HTTPException, status
from app.models.admin import AdminUser
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.utils.jwt import decode_token
from app.models.session import Session

security = HTTPBearer(auto_error=True)

async def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> AdminUser:
    if credentials.scheme.lower() != "bearer":
        raise HTTPException(status_code=401, detail="Invalid authentication scheme")

    token = credentials.credentials
    payload = decode_token(token, expected_type="access")
    email = payload.get("sub")

    # ✅ Check if session exists and is active
    session = await Session.find_one(Session.access_token == token)
    if not session or not session.is_active:
        raise HTTPException(status_code=401, detail="Session not active or token expired")

    user = await AdminUser.find_one(AdminUser.email == email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user

async def get_current_admin_user(token_user = Depends(get_current_admin)):
    admin = await AdminUser.find_one(AdminUser.email == token_user.email)
    if not admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not an admin")
    return admin


