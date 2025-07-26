from fastapi import APIRouter, HTTPException, Depends, Request
from app.models.dinner import  Dinner, DinnerGroup
from app.schemas.dinner import CreateDinnerRequest, CreateDinnerResponse
from typing import List, Optional
from app.schemas.response import SuccessResponse
from app.services.matchmaking.v1 import run_matchmaking_for_dinner, calculate_group_score, group_users_by_preferences
from app.models.user import User
from app.utils.send_dinner_match_email import send_dinner_match_email
from app.dependencies.admin import get_current_admin_user
from pydantic import EmailStr, BaseModel
from app.models.admin import AdminUser
from app.utils.hashing import verify_password
from app.services.session import create_or_update_session
from app.models.venue import Venue
router = APIRouter(prefix="/admin", tags=["Admin"])
from app.schemas.venue import CreateVenueRequest, VenueResponse
from beanie import PydanticObjectId
import asyncio
import pprint
from app.core.logger import logger
from app.core.notifications.producer import queue_notification
class AdminLoginRequest(BaseModel):
    email: EmailStr
    password: str

class UpdateVenueRequest(BaseModel):
    name: Optional[str]
    address: Optional[str]
    city: Optional[str]
    country: Optional[str]
    is_active: Optional[bool]

class UpdateVenueRequestForDinner(BaseModel):
    venue_id: str
class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
@router.post("/login", response_model=SuccessResponse[TokenPair])
async def admin_login(payload: AdminLoginRequest,  request: Request):
    admin = await AdminUser.find_one(AdminUser.email == payload.email)
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")

    if not verify_password(payload.password, admin.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect password")

   
    session = await create_or_update_session(payload.email, request=request)

    return SuccessResponse(message="Login successful", data=TokenPair(access_token=session.access_token, refresh_token=session.refresh_token))
# Create a dinner (city + date + time level)
@router.post("/dinner/create", response_model=SuccessResponse[CreateDinnerResponse], dependencies=[Depends(get_current_admin_user)])
async def create_dinner(payload: CreateDinnerRequest):
    exisiting_dinner = await Dinner.find_one(
        Dinner.date == payload.date,
        Dinner.city == payload.city,
    )
    if exisiting_dinner:
        raise HTTPException(status_code=400, detail="Dinner already exists")
    dinner = Dinner(
        date=payload.date,
        city=payload.city,
        country=payload.country,
        opted_in_user_ids=[]
    )
    Dinner.country == payload.country
    await dinner.insert()
    return SuccessResponse(message="Dinner created successfully", data={
        "id": str(dinner.id)
    })


@router.get("/dinner/all", response_model=SuccessResponse[List[Dinner]], dependencies=[Depends(get_current_admin_user)])
async def list_all_dinners():
  dinners= await Dinner.find_all().to_list()
  return SuccessResponse(message="Dinners fetched successfully", data=dinners)


@router.get("/dinner/{dinner_id}", response_model=SuccessResponse[Dinner],  dependencies=[Depends(get_current_admin_user)])
async def get_dinner(dinner_id: str):
    dinner = await Dinner.get(dinner_id)
    if not dinner:
        raise HTTPException(status_code=404, detail="Dinner not found")
    return SuccessResponse(message="Dinner fetched successfully", data=dinner) 



@router.patch(
    "/dinner-group/{group_id}/venue",
    response_model=SuccessResponse[DinnerGroup]
)
async def update_dinner_group_venue(
    group_id: PydanticObjectId,
    payload: UpdateVenueRequestForDinner,
    admin=Depends(get_current_admin_user)
):
    group = await DinnerGroup.get(group_id)
    if not group:
        raise HTTPException(status_code=404, detail="Dinner group not found")

    venue = await Venue.get(payload.venue_id)
    if not venue or not venue.is_active:
        raise HTTPException(status_code=400, detail="Invalid or inactive venue ID")

    group.venue_id = payload.venue_id
    await group.save()

    # 📬 Notify all participants in the group
    for user_id in group.participant_ids:
        user = await User.get(user_id)
        if not user:
            continue
        queue_notification({
        "type": "VENUE_UPDATE",
        "to_email": user.email,
        "name": user.name or "there",
        "venue_name": venue.name,
        "venue_address": venue.address,
        "city": venue.city,
        "date": group.date.strftime("%A, %d %B %Y") if hasattr(group, "date") else "your dinner date"
    })

    return SuccessResponse(message="Venue updated successfully and users notified", data=group)


    return SuccessResponse(message="Venue updated successfully", data=group)
@router.post("/run-matching", dependencies=[Depends(get_current_admin_user)])
async def run_matching(dinner_id: PydanticObjectId):
    dinner = await Dinner.get(dinner_id)

    if not dinner or dinner.matched:
        raise HTTPException(status_code=404, detail="Dinner not found or already matched")

    user_map = {}
    for opt_in in dinner.opted_in_users:
        user = await User.get(opt_in.user_id)
        if user and user.personality_answers and user.personality_scores:
            user_map[user.id] = {
                "user": user,
                "budget_category": opt_in.budget_category,
                "dietary_category": opt_in.dietary_category
            }

    if len(user_map) < 6:
        return {
            "message": "Insufficient users",
            "summary": {
                "dinner_id": str(dinner.id),
                "status": "skipped",
                "reason": f"Only {len(user_map)} valid users"
            }
        }

    users = [entry["user"] for entry in user_map.values()]

    preference_groups = group_users_by_preferences(user_map)
    logger.info("Preference groups:\n%s", pprint.pformat(preference_groups))


    matched_groups = []
    for (budget, dietary), user_list in preference_groups.items():
        if len(user_list) < 6:
            continue  # Not enough users for a group
        new_groups = await run_matchmaking_for_dinner(user_list)
        matched_groups.extend(new_groups)  # accumulate all matched groups
        for group in new_groups:
            match_score = calculate_group_score(group)

            dinner_group = DinnerGroup(
                dinner_id=dinner.id,
                participant_ids=[u.id for u in group],
                venue_id=None,
                budget_category=budget,
                dietary_category=dietary,
                match_score=match_score
            )
            await dinner_group.insert()

            # # Notify users
            # for user in group:
            #     queue_notification({
            #     "type":"DINNER_UPDATE",
            #     "to_email":user.email,
            #     "name":user.name or "there",
            #     "date":dinner.date.strftime("%A, %d %B %Y"),
            #     "time":dinner.date.strftime("%I:%M %p"),
            #     "city":dinner.city
            #     })
                


    dinner.matched = True
    await dinner.save()

    return SuccessResponse(message= "Matching complete",data={
            "summary": {
                "dinner_id": str(dinner.id),
                "groups_created": len(matched_groups),
                "ungrouped_users": len(users) % 6,
                "status": "matched"
            }
    })

@router.post("/venues", response_model=SuccessResponse[VenueResponse], dependencies=[Depends(get_current_admin_user)])
async def create_venue(payload: CreateVenueRequest):
    existing_venue = await Venue.find_one(Venue.name == payload.name)
    if existing_venue:
        raise HTTPException(status_code=400, detail="Venue already exists")
    update_data = payload.model_dump(exclude_unset=True)
    venue = Venue(**update_data)
    await venue.insert()
    return SuccessResponse(message="Venue created", data=venue)

@router.patch(
    "/venues/{venue_id}",
    response_model=SuccessResponse[VenueResponse],
    dependencies=[Depends(get_current_admin_user)]
)
async def update_venue(venue_id: str, payload: UpdateVenueRequest):
    venue = await Venue.get(venue_id)
    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")

    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        if hasattr(venue, key):  # ✅ Prevent ValueError
            setattr(venue, key, value)

    await venue.save()
    return SuccessResponse(message="Venue updated", data=venue)


@router.get("/venues", response_model=SuccessResponse[List[Venue]], dependencies=[Depends(get_current_admin_user)])
async def list_venues():
    venues = await Venue.find_all().to_list()
    return SuccessResponse(message="Venues fetched", data=venues)

@router.get("/venues/{venue_id}", response_model=SuccessResponse[VenueResponse], dependencies=[Depends(get_current_admin_user)])
async def get_venue(venue_id: str):
    venue = await Venue.get(venue_id)
    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")
    return SuccessResponse(message="Venue fetched", data=venue)