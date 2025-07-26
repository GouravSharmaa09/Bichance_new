# app/models/venue.py

from beanie import Document
from pydantic import Field
from typing import Optional
from uuid import uuid4

class Venue(Document):
    name: str
    address: Optional[str] = ""
    city: str
    country: str
    google_maps_url: Optional[str] = ""
    contact_number: Optional[str] = ""
    is_active: bool = True  # to allow deactivating venues without deleting

    class Settings:
        name = "venues"
