from fastapi import APIRouter, HTTPException, Body
import httpx
from app.schemas.response import SuccessResponse
from pydantic import BaseModel
from async_lru import alru_cache


class CountryRequest(BaseModel):
    country: str

router = APIRouter()
BASE_URL = "https://countriesnow.space/api/v0.1/countries"

@alru_cache(maxsize=1)
async def fetch_all_countries():
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{BASE_URL}")
        return resp.json()["data"]

@router.get("/geo/countries")
async def list_countries():
    countries = await fetch_all_countries()
    return SuccessResponse(
        message="Countries fetched successfully",
        data={"countries": [c["country"] for c in countries]}
    )
@router.post("/geo/country")
async def list_cities(payload: CountryRequest = Body(...)):
    formatted_country = payload.country.strip().title()
    url = f"https://countriesnow.space/api/v0.1/countries/cities/q?country={formatted_country}"

    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(url)
            resp.raise_for_status()
            data = resp.json()
            return SuccessResponse(message="Cities fetched successfully", data={"cities": data.get("data", [])})
        except httpx.HTTPStatusError:
            raise HTTPException(status_code=resp.status_code, detail=f"Upstream error: {resp.text}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")