import asyncio
import random
from beanie import PydanticObjectId
from app.db.init import init_db
from app.models.user import User
from app.models.dinner import Dinner, DinnerOptInUser

budget_options = ["low", "medium", "high"]
dietary_options = ["veg", "halal", "jain", "vegan"]

async def opt_in_users_to_dinner():
    await init_db()

    dinner = await Dinner.find_one(Dinner.city == "Gurugram", Dinner.country == "India")
    if not dinner:
        print("❌ No dinner found in Gurugram, India")
        return

    users = await User.find(User.current_city == "Gurugram", User.current_country == "India").to_list()

    dinner.opted_in_users = []

    for user in users[:20]:
        dinner.opted_in_users.append(DinnerOptInUser(
            user_id=user.id,
            budget_category=random.choice(budget_options),
            dietary_category=random.choice(dietary_options)
        ))
        print(f"✅ Opted in {user.email}")

    await dinner.save()
    print("🎉 Opt-in complete!")

if __name__ == "__main__":
    asyncio.run(opt_in_users_to_dinner())
