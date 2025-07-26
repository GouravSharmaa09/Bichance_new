from fastapi import APIRouter, HTTPException, Request, Header, Depends
from app.schemas.auth import OTPRequest, OTPVerifyRequest, OTPResponse, VerifyOTPResponse, LogoutUserResponse
from app.utils.otp import generate_otp, save_otp, verify_otp
from app.services.email import send_otp_email
from app.utils.jwt import  decode_token
from app.schemas.response import SuccessResponse
from app.models.session import Session
from app.services.auth import logout_user
from app.services.session import create_or_update_session
from app.services.users import get_or_create_user
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.notifications.producer import queue_notification


router = APIRouter(prefix="/auth", tags=["Auth"])
@router.post("/send-otp", response_model= SuccessResponse[OTPResponse])
async def send_otp(payload: OTPRequest):
    otp = generate_otp()
    await save_otp(payload.email, otp)
    queue_notification({
                    "type": "OTP_EMAIL",
                    "to_email": payload.email,
                    "otp": otp  
                })
    # send_otp_email(payload.email, otp)
    return SuccessResponse(
        message="OTP sent successfully",
        data=OTPResponse(email=payload.email)
    )

@router.post("/verify-otp", response_model=SuccessResponse[VerifyOTPResponse])
async def verify_user_otp(payload: OTPVerifyRequest, request: Request):
    if not await verify_otp(payload.email, payload.otp):
        raise HTTPException(status_code=401, detail="Invalid or expired OTP")

    user = await get_or_create_user(payload.email)
    session = await create_or_update_session(payload.email, request=request)
    return SuccessResponse(
        message="Login successful",
        data=VerifyOTPResponse(
            access_token=session.access_token,
            refresh_token=session.refresh_token,
            email=payload.email,
            token_type="bearer"
        )
    )

@router.post("/refresh-token", response_model=SuccessResponse[VerifyOTPResponse])
async def refresh_token(
    request: Request,
    credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer()),
):
    token = credentials.credentials
    payload = decode_token(token, expected_type="refresh")

    session = await Session.find_one(Session.refresh_token == token)
    if not session:
        raise HTTPException(status_code=401, detail="Session not found or expired")

    updated_session = await create_or_update_session(
        email=payload["sub"],
        existing_session=session,
        request=request
    )

    return SuccessResponse(
        message="Token refreshed successfully",
        data=VerifyOTPResponse(
            access_token=updated_session.access_token,
            refresh_token=updated_session.refresh_token,
            email=payload["sub"],
            token_type="bearer"
        )
    )


@router.post("/logout", response_model=SuccessResponse[LogoutUserResponse])
async def logout(
    credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer())
):
    token = credentials.credentials
    await logout_user(token)

    return SuccessResponse(
        message="Logout successful",
        data=LogoutUserResponse(access_token="")
    )
