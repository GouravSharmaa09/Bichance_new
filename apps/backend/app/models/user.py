from beanie import Document
from pydantic import EmailStr, Field, BaseModel
from typing import Optional, Dict, List
from datetime import date, datetime

class PersonalityAnswer(BaseModel):
    trait: str  # One of "O", "C", "E", "A", "N"
    question: str
    answer: str
def default_personality_answers():
    return [PersonalityAnswer(question="", answer="", trait="") for _ in range(15)]

class User(Document):
    email: EmailStr
    name: Optional[str] = ""
    mobile: Optional[str] = ""
    city: Optional[str] = ""
    country: Optional[str] = ""
    dob: Optional[date] = None
    gender: Optional[str] = ""
    relationship_status: Optional[str] = ""
    children: Optional[bool] = False
    profession: Optional[str] = ""

    # New fields with safe default
    personality_answers: Optional[List[PersonalityAnswer]] = Field(default_factory=default_personality_answers)
    personality_scores: Optional[Dict[str, float]] = Field(default_factory=dict)

    identity_verified: bool = False
    subscription_status: str = "none"
    subscription_end_date: Optional[datetime] = None  # ⬅ 👈 Added


    image_url: Optional[str] = None
    current_country: Optional[str] = ""
    current_city: Optional[str] = ""
    stripe_customer_id: Optional[str] = Field(default=None)
    

    class Settings:
        name = "users"
