from beanie import Document
from typing import List, Literal
from datetime import date

class DinnerGroup(Document):
    date: date
    restaurant_id: str
    user_ids: List[str]
    status: Literal["confirmed", "cancelled", "pending"] = "pending"

    class Settings:
        name = "groups"
