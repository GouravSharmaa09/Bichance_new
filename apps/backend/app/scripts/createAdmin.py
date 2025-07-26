import asyncio
from passlib.context import CryptContext
from app.models.admin import AdminUser
from app.db.init import init_db
from dotenv import load_dotenv
import getpass

load_dotenv()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def create_admin():
    await init_db()

    email = "ygbhupesh003@gmail.com"
    password = getpass.getpass("Enter admin password: ")

    existing = await AdminUser.find_one({"email": email})
    if existing:
        print("⚠️ Admin already exists.")
        return

    hashed_password = pwd_context.hash(password)
    admin = AdminUser(
        email=email,
        password_hash=hashed_password,
        name="Super Admin",
        is_superadmin=True
    )
    await admin.insert()
    print(f"✅ Admin created: {email}")

if __name__ == "__main__":
    asyncio.run(create_admin())
