from app.models.user import User, PersonalityAnswer  # Assuming you've created a separate class for this

async def get_or_create_user(email: str) -> User:
    user = await User.find_one(User.email == email)

    if not user:
        user = User(
            email=email  
        )
        await user.insert()

    return user
