from datetime import datetime
from beanie import Document, PydanticObjectId
from typing import List, Optional
from pydantic import Field, BaseModel

class DinnerOptInUser(BaseModel):
    user_id: PydanticObjectId
    budget_category: Optional[str] = None
    dietary_category: Optional[str] = None
class Dinner(Document):
    date: datetime
    city: str
    country: str
    opted_in_users: List[DinnerOptInUser] = Field(default_factory=list)
    matched: bool = False  # <== NEW

    class Settings:
        name = "dinners"

class DinnerGroup(Document):  # should be Document, not BaseModel
    dinner_id: PydanticObjectId  # FK to Dinner
    budget_category: Optional[str]
    dietary_category: Optional[str]
    participant_ids: List[PydanticObjectId] = Field(default_factory=list)
    venue_id: Optional[PydanticObjectId]
    match_score: Optional[float] = None  # <== NEW

    class Settings:
        name = "dinner_groups"
class DinnerGroupResponse(BaseModel):
    id: str
    dinner_id: str
    budget_category: Optional[str]
    dietary_category: Optional[str]
    participant_ids: List[str]
    venue_id: Optional[str]

class DinnerPublicResponse(BaseModel):
    id: PydanticObjectId
    date: datetime
    city: str
    country: str
    
    
