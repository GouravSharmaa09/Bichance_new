# dinner_routes_user.py
from fastapi import APIRouter, Depends, HTTPException
from beanie.operators import In
from typing import List, Optional
from datetime import date
from beanie import PydanticObjectId
from app.models.user import User
from app.models.dinner import DinnerGroup, Dinner, DinnerPublicResponse, DinnerOptInUser
from app.dependencies.auth import get_current_user
from app.schemas.response import SuccessResponse
from datetime import datetime, time, timezone, timedelta
from pydantic import BaseModel
from bson import ObjectId
from app.utils.require_active_subscription import require_active_subscription
from app.core.notifications.producer import queue_notification
from zoneinfo import ZoneInfo  # Python 3.9+

class OptInResponse(BaseModel):
    dinner_id: PydanticObjectId
class OptInRequest(BaseModel):
    dinner_id: PydanticObjectId
    budget_category: Optional[str] = None
    dietary_category: Optional[str] = None
class DinnerGroupInfo(BaseModel):
    group_id: str
    venue_id: Optional[str]
    participant_ids: List[PydanticObjectId]
    match_score: Optional[float]

class UserDinnerStatus(BaseModel):
    dinner_id: PydanticObjectId
    date: datetime
    city: str
    country: str
    matched: bool
    group: Optional[DinnerGroupInfo] = None
router = APIRouter(prefix="/dinner", tags=["Dinner - User"])

@router.get("/upcoming", response_model=SuccessResponse[List[DinnerPublicResponse]])
async def get_upcoming_dinners(user: User = Depends(get_current_user)):
    today_utc = datetime.combine(date.today(), time.min).replace(tzinfo=timezone.utc)
    cutoff_datetime = datetime.now(timezone.utc) + timedelta(hours=48)

    upcoming_dinners = await Dinner.find(
        Dinner.city == user.current_city,
        Dinner.country == user.current_country,
        Dinner.date >= cutoff_datetime
    ).sort("date").limit(3).to_list()

    print("UTC Today:", today_utc)

    return SuccessResponse(message="Upcoming dinners fetched", data=upcoming_dinners)

@router.post("/opt-in", response_model=SuccessResponse[OptInResponse])
async def opt_in_to_dinner(
    payload: OptInRequest,
    user: User = Depends(require_active_subscription)  # 👈 This does the blocking
):
    dinner = await Dinner.get(payload.dinner_id)
    if not dinner:
        raise HTTPException(status_code=404, detail="Dinner not found")

    if any(u.user_id == user.id for u in dinner.opted_in_users):
        raise HTTPException(status_code=400, detail="Already opted in")

    dinner.opted_in_users.append(DinnerOptInUser(
        user_id=user.id,
        budget_category=payload.budget_category,
        dietary_category=payload.dietary_category
    ))

    await dinner.save()
    utc_dt = dinner.date

    ist_dt = utc_dt.astimezone(ZoneInfo("Asia/Kolkata"))

    queue_notification({
        "type": "DINNER_OPT_IN_EMAIL",
        "to_email": user.email,
        "name": user.name or "Guest",
        "date": ist_dt.strftime("%Y-%m-%d"),
        "time": ist_dt.strftime("%I:%M %p"),
        "city": dinner.city,
    })

    return SuccessResponse(
        message="Opted-in successfully",
        data=OptInResponse(dinner_id=payload.dinner_id)
    )


@router.get("/my-bookings", response_model=SuccessResponse[List[dict]])
async def get_user_bookings(user: User = Depends(get_current_user)) -> SuccessResponse:
    # Step 1: Fetch all dinners where current user is a participant
    dinners = await DinnerGroup.find(DinnerGroup.participant_ids == user.id).sort("date").to_list()
    
    # Step 2: Collect unique participant_ids from all dinners
    all_participant_ids = {
        ObjectId(pid) for dinner in dinners for pid in dinner.participant_ids if ObjectId.is_valid(pid)
    }
    # Step 3: Fetch users for these ObjectIds
    participants = await User.find(In(User.id, list(all_participant_ids))).to_list()
    # Step 4: Map user info
    participants_dict = {
        str(u.id): u.model_dump(include={
            "name", "city", "country", "gender", "profession", "image_url", "identity_verified"
        }) for u in participants
    }
    print("participants_dict",participants_dict)
    # Step 5: Add participant_details to each dinner group
    enriched_dinners = []
    for dinner in dinners:
        enriched_dinners.append({
            **dinner.model_dump(),
            "participant_details": [
                participants_dict.get(str(pid)) for pid in dinner.participant_ids if str(pid) in participants_dict
            ]
        })

    return SuccessResponse(message="Bookings Fetched successfully", data=enriched_dinners)

@router.get("/dinners/user-view", response_model=SuccessResponse[List[UserDinnerStatus]])
async def get_user_dinner_status(user: User = Depends(get_current_user)):
    # Find all dinners the user opted into
    dinners = await Dinner.find(
        {"opted_in_users.user_id": user.id}
    ).to_list()
    print("dinners",dinners)
    response_data = []

    for dinner in dinners:
        entry = {
            "dinner_id": dinner.id,
            "date": dinner.date,
            "city": dinner.city,
            "country": dinner.country,
            "matched": dinner.matched,
            "group": None
        }

        if dinner.matched:
            group = await DinnerGroup.find_one({
                "dinner_id": dinner.id,
                "participant_ids": user.id
            })
            if group:
                entry["group"] = {
                    "group_id": str(group.id),
                    "venue_id": str(group.venue_id) if group.venue_id else None,
                    "participant_ids": group.participant_ids,
                    "match_score": group.match_score,
                }

        response_data.append(entry)

    return SuccessResponse(
        message="Fetched user dinner status",
        data=response_data
    )
