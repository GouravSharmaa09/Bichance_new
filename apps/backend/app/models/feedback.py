from beanie import Document
from typing import Optional
from datetime import datetime, timezone

class Feedback(Document):
    user_id: str
    dinner_group_id: str
    rating: int  # 1 to 5
    comments: Optional[str]
    submitted_at: datetime = datetime.now(timezone.utc)
    class Settings:
        name = "feedbacks"
