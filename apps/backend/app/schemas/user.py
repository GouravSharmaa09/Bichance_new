from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict
from datetime import date

class PersonalityAnswer(BaseModel):
    trait: str  # One of "O", "C", "E", "A", "N"
    question: str
    answer: str

class MeResponse(BaseModel):
    email: EmailStr
    name: Optional[str]
    mobile: Optional[str]
    city: Optional[str]
    country: Optional[str]
    dob: Optional[date]
    gender: Optional[str]
    relationship_status: Optional[str]
    children: Optional[bool]
    profession: Optional[str]
    personality_answers: Optional[List[PersonalityAnswer]]
    personality_scores: Optional[Dict[str, float]]
    identity_verified: bool
    subscription_status: str
    image_url: Optional[str]
    current_country: Optional[str] 
    current_city: Optional[str]
