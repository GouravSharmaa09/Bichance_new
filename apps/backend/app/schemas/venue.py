# app/schemas/venue.py

from pydantic import BaseModel
from typing import Optional


class CreateVenueRequest(BaseModel):
    name: str
    address: str
    city: str
    country: str


class UpdateVenueRequest(BaseModel):
    name: Optional[str]
    address: Optional[str]
    city: Optional[str]
    country: Optional[str]
    is_active: Optional[bool]


class VenueResponse(BaseModel):
    _id: str
    name: str
    address: str
    city: str
    country: str
    is_active: bool
