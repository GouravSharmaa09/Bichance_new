import asyncio
from datetime import date
import random

from app.db.init import init_db
from app.models.user import User, PersonalityAnswer

# first_names = ["Amit", "Sana", "Ravi", "Meera", "Karan", "Priya", "Arjun", "Nisha", "Raj", "Neha"]
first_names = ["Corner McGregor", "Habib", "Nakul Dhull", "neeraj Goyat"]
cities = ["Gurugram", "Bangalore", "Mumbai", "Delhi"]
professions = ["Software Engineer", "Designer", "Doctor", "Entrepreneur", "Marketer"]
genders = ["Male", "Female", "Other"]
relationships = ["Single", "Married", "Complicated"]

questions = [
    "I enjoy discussing politics and current news.",
    "I prefer to plan things in advance rather than being spontaneous.",
    "I enjoy being the center of attention.",
    "I am deeply moved by the arts or music.",
    "I get stressed out easily.",
    "I frequently reflect on philosophical or abstract ideas.",
    "I keep my surroundings clean and organized.",
    "I find it easy to approach strangers at social events.",
    "I tend to forgive and forget easily.",
    "I worry about things more than most people.",
    "I like trying new foods and experiences.",
    "I enjoy working on a strict schedule.",
    "I feel drained after social interactions.",
    "I try to help others even when it’s not expected of me.",
    "I get nervous in unfamiliar situations."
]

trait_map = ["O", "C", "E", "A", "N",
             "O", "C", "E", "A", "N",
             "O", "C", "E", "A", "N"]

def generate_personality_answers():
    return [
        PersonalityAnswer(
            trait=trait_map[i],
            question=questions[i],
            answer=random.choice(["Yes", "No"])
        )
        for i in range(15)
    ]

async def create_users():
    await init_db()

    for i in range(10):
        email = f"user{i}@test.com"
        answers = generate_personality_answers()

        user = User(
            email=email,
            name=random.choice(first_names),
            mobile=f"98765432{random.randint(10,99)}",
            city=random.choice(cities),
            country="India",
            dob=date(1995 + (i % 5), random.randint(1, 12), random.randint(1, 28)),
            gender=random.choice(genders),
            relationship_status=random.choice(relationships),
            children=random.choice([True, False]),
            profession=random.choice(professions),
            current_city="Gurugram",
            current_country="India",
            personality_answers=answers
        )

        # calculate scores
        scores = {"O": 0, "C": 0, "E": 0, "A": 0, "N": 0}
        count = {"O": 0, "C": 0, "E": 0, "A": 0, "N": 0}
        for ans in answers:
            if ans.answer.strip().lower() == "yes":
                scores[ans.trait] += 1
            count[ans.trait] += 1

        for trait in scores:
            if count[trait] > 0:
                scores[trait] /= count[trait]

        user.personality_scores = scores
        await user.insert()
        print(f"✅ Created user {email}")

if __name__ == "__main__":
    asyncio.run(create_users())
