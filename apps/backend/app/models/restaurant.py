from beanie import Document
from typing import Optional

class Restaurant(Document):
    name: str
    address: str
    city: str
    contact_email: Optional[str]
    max_group_size: int = 6
    is_active: bool = True

    image_url: Optional[str]  # link to restaurant photo

    class Settings:
        name = "restaurants"
