from fastapi import APIRouter

router = APIRouter(prefix="/feedback", tags=["Feedback"])

@router.post("/")
async def submit_feedback():
    return {"message": "Feedback received"}
