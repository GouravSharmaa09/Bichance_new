
# app/api/v1/subscription.py
from fastapi import APIRouter, Depends, Request, HTTPException
from stripe import stripe, error as stripe_error
from app.models.subscription import Subscription
from app.models.user import User
from app.dependencies.auth import get_current_user
from app.core.config import settings
from datetime import datetime, timezone
from pydantic import BaseModel
from app.core.notifications.producer import queue_notification
from beanie import PydanticObjectId
router = APIRouter(prefix="/subscription", tags=["Subscription"])

stripe.api_key = settings.STRIPE_SECRET_KEY
class CheckoutSessionRequest(BaseModel):
    price_id: str  # from frontend


@router.post("/create-checkout-session", dependencies=[Depends(get_current_user)])
def create_checkout_session(
    data: CheckoutSessionRequest,
    user: User = Depends(get_current_user)
):
    try:
        checkout_session = stripe.checkout.Session.create(
            
            payment_method_types=["card"],
            billing_address_collection="required",  # ✅ This collects address on the checkout page
            mode="subscription",
            line_items=[{
                "price": data.price_id,
                "quantity": 1
            }],
            customer_email=user.email,  # Pre-fill email on checkout page
            metadata={
                "user_id": str(user.id),
                "email": user.email
            },
            success_url=f"{settings.FRONTEND_URL}/subscription/success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{settings.FRONTEND_URL}/subscription/cancel",
        )
        return {"session_url": checkout_session.url}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.post("/cancel", dependencies=[Depends(get_current_user)])
async def cancel_subscription(user: User = Depends(get_current_user)):
    subscription = await Subscription.find_one(Subscription.user_email == user.email, Subscription.status == "active")
    if not subscription:
        raise HTTPException(status_code=404, detail="No active subscription found")

    stripe.Subscription.delete(subscription.stripe_subscription_id)
    subscription.status = "cancelled"
    subscription.end_date = datetime.now(timezone.utc)
    await subscription.save()

    user.subscription_status = "cancelled"
    user.subscription_end_date = subscription.end_date
    await user.save()
    
    return {"message": "Subscription cancelled"}


@router.post("/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        customer_email = session['customer_email']
        subscription_id = session['subscription']
        subscription = stripe.Subscription.retrieve(subscription_id)
        user_id = session["metadata"]["user_id"]
        customer_id = session["customer"]

        user = await User.get(PydanticObjectId(user_id))
        if user:
            user.stripe_customer_id = customer_id
            user.subscription_status = "active"
            user.subscription_end_date = datetime.fromtimestamp(subscription['current_period_end'], tz=timezone.utc)
            await user.save()

        new_sub = Subscription(
            user_email=customer_email,
            stripe_customer_id=session['customer'],
            stripe_subscription_id=subscription_id,
            status="active",
            start_date=datetime.fromtimestamp(subscription['start_date'], tz=timezone.utc),
            end_date=datetime.fromtimestamp(subscription['current_period_end'], tz=timezone.utc)
        )
        await new_sub.insert()

        queue_notification({
            "type": "SUBSCRIPTION_EMAIL",
            "to_email": customer_email,
            "status": "active"
        })


    elif event['type'] == 'invoice.payment_failed':
            sub_id = event['data']['object']['subscription']
            subscription = await Subscription.find_one(Subscription.stripe_subscription_id == sub_id)
            if subscription:
                subscription.status = "payment_failed"
                await subscription.save()

                user = await User.find_one(User.email == subscription.user_email)
                if user:
                    user.subscription_status = "payment_failed"
                    await user.save()

                queue_notification({
                    "type": "SUBSCRIPTION_EMAIL",
                    "to_email": subscription.user_email,
                    "status": "failed"
                })


    elif event['type'] == 'customer.subscription.deleted':
        sub_id = event['data']['object']['id']
        subscription = await Subscription.find_one(Subscription.stripe_subscription_id == sub_id)
        if subscription:
            subscription.status = "cancelled"
            subscription.end_date = datetime.now(timezone.utc)
            await subscription.save()

            user = await User.find_one(User.email == subscription.user_email)
            if user:
                user.subscription_status = "cancelled"
                user.subscription_end_date = subscription.end_date
                await user.save()

            queue_notification({
                "type": "SUBSCRIPTION_EMAIL",
                "to_email": subscription.user_email,
                "status": "cancelled"
            })

    return {"status": "success"}

@router.get("/session-info")
async def get_session_info(session_id: str, user: User = Depends(get_current_user)):
    try:
        session = stripe.checkout.Session.retrieve(session_id, expand=["subscription"])
        subscription = session.get("subscription")

        return {
            "subscription": {
                "id": subscription["id"],
                "status": subscription["status"],
                "current_period_end": subscription["current_period_end"],
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
