from fastapi import APIRouter
from fastapi import Depends
from app.schemas.response import SuccessResponse
from app.schemas.user import MeResponse
from app.dependencies.auth import get_current_user
from app.models.user import User
router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=SuccessResponse[MeResponse])
async def get_me(current_user: User = Depends(get_current_user)):
    return SuccessResponse(
        message="User profile fetched",
        data=MeResponse.model_validate(current_user.model_dump())
    )
