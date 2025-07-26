from pydantic import BaseModel
from typing import Optional, List
from datetime import  datetime

class CreateDinnerRequest(BaseModel):
    date: datetime
    city: str
    country: str
    
class CreateDinnerResponse(BaseModel):
    id: str

class DinnerResponse(BaseModel):
    id: str
    date: datetime
    city: str
    country: str
    budget: Optional[str]
    dietary_restrictions: Optional[List[str]]
    opted_in_user_ids: Optional[List[str]]
    participant_ids: Optional[List[str]]
    venue: Optional[str]
    
class DinnerGroupResponse(BaseModel):
    dinner_id: str
    participant_ids: List[str]
    venue_id: Optional[str]
    budget_category: Optional[str]
    dietary_category: Optional[str]
    match_score: Optional[float]  # <== NEW
    
class UpdateDinnerResponse(BaseModel):
    id: str
    venue_id:str