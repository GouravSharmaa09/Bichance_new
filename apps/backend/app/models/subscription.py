# app/models/subscription.py
from beanie import Document
from pydantic import EmailStr, Field
from typing import Optional
from datetime import datetime

class Subscription(Document):
    user_email: EmailStr
    stripe_customer_id: str
    stripe_subscription_id: str
    status: str  # active, cancelled, payment_failed
    start_date: datetime
    end_date: Optional[datetime] = None

    class Settings:
        name = "subscriptions"