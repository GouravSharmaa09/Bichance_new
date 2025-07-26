from pydantic import BaseModel, Field, field_validator
from app.constants.questionsEnum import QuestionKey
from typing import Dict, Optional


class SaveJourneyRequest(BaseModel):
    question_key: QuestionKey= Field(
        ..., 
        description="Key of the question being answered",
        example="q0"
    )
    answer: str = Field(
        ..., 
        description="Answer to the question. Should be an integer (0/1) for personality questions, or appropriate value for identity/location fields.",
        example="1"
    )
    question: Optional[str] = Field(
    None,
    description="Optional text of the question, mainly for personality items.",
    example="I enjoy discussing politics and current news."
)



class SubmitJourneyResponse(BaseModel):
    message: str
    scores: Dict[str, float]
