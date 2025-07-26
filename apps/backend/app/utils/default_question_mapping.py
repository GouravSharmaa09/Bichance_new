from pydantic import BaseModel
class PersonalityAnswer(BaseModel):
    trait: str  # One of "O", "C", "E", "A", "N"
    question: str
    answer: str
def default_personality_answers():
    trait_map = ["O", "C", "E", "A", "N",
                 "O", "C", "E", "A", "N",
                 "O", "C", "E", "A", "N"]
    questions = [
        "I enjoy discussing politics and current news.",
        "I prefer to plan things in advance rather than being spontaneous.",
        "I enjoy being the center of attention.",
        "I am deeply moved by the arts or music.",
        "I get stressed out easily.",
        "I keep my surroundings clean and organized.",
        "I find it easy to approach strangers at social events.",
        "I frequently reflect on philosophical or abstract ideas.",
        "I worry about things more than most people.",
        "I enjoy working on a strict schedule.",
        "I feel drained after social interactions.",
        "I am quick to understand complex concepts.",
        "I tend to forgive and forget easily.",
        "I prefer quiet nights at home over parties.",
        "I try to help others even when it’s not expected of me.",
    ]
    return [
        PersonalityAnswer(trait=trait_map[i], question=questions[i], answer="")
        for i in range(len(questions))
    ]
