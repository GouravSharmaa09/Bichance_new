from pydantic import BaseModel, EmailStr, Field


class OTPRequest(BaseModel):
    """Payload for requesting an OTP"""
    email: EmailStr


class OTPVerifyRequest(BaseModel):
    """Payload for verifying OTP"""
    email: EmailStr
    otp: str = Field(..., min_length=4, max_length=10)


class TokenResponse(BaseModel):
    """Returned after successful login/verification"""
    access_token: str
    token_type: str = "bearer"


class OTPResponse(BaseModel):
    """Returned after OTP is sent"""
    email: EmailStr
    message: str = "OTP sent successfully"


class VerifyOTPResponse(BaseModel):
    """Returned after OTP is verified successfully"""
    email: EmailStr
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class LogoutUserResponse(BaseModel):
    access_token: str