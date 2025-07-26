# app/db/init.py

from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.core.config import settings

# Import all models
from app.models.user import User
from app.models.group import DinnerGroup
from app.models.feedback import Feedback
from app.models.subscription import Subscription
from app.models.restaurant import Restaurant
from app.models.otp import OTP
from app.models.session import Session
from app.models.dinner import Dinner, DinnerGroup
from app.models.admin import AdminUser
from app.models.venue import Venue

async def init_db():
    client = AsyncIOMotorClient(settings.MONGO_URI)
    db = client[settings.DATABASE_NAME]

    await init_beanie(
        database=db,
        document_models=[
            User,
            DinnerGroup,
            Feedback,
            Subscription,
            Restaurant,
            OTP,
            Session,
            Dinner,
            DinnerGroup,
            AdminUser,
            Venue,
            
        ]
    )
