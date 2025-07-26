from collections import defaultdict
from typing import List, Dict, Tuple
from itertools import combinations
import random
from app.models.user import User  # or from wherever your User model lives
from app.schemas.user import PersonalityAnswer
# Map each question index (0-14) to a personality trait
QUESTION_TRAIT_MAP = {
    0: "O", 1: "C", 2: "E", 3: "A", 4: "N",
    5: "O", 6: "C", 7: "E", 8: "A", 9: "N",
    10: "O", 11: "C", 12: "E", 13: "A", 14: "N"
}

def group_users_by_preferences(user_map: Dict):
    preference_groups = defaultdict(list)

    for user_id, data in user_map.items():
        key = (data["budget_category"], data["dietary_category"])
        preference_groups[key].append(data["user"])

    return preference_groups
def compute_personality_scores(answers: List[PersonalityAnswer]) -> Dict[str, float]:
    scores = {"O": 0, "C": 0, "E": 0, "A": 0, "N": 0}
    trait_counts = {"O": 0, "C": 0, "E": 0, "A": 0, "N": 0}

    for item in answers:
        if item.answer.strip().lower() == "yes" and item.trait in scores:
            scores[item.trait] += 1
        trait_counts[item.trait] += 1

    for trait in scores:
        if trait_counts[trait]:
            scores[trait] /= trait_counts[trait]

    return scores


def personality_compatibility(u1: Dict[str, float], u2: Dict[str, float]) -> float:
    """Calculate personality compatibility based on trait closeness."""
    total = 0
    for trait in u1:
        total += 1 - abs(u1[trait] - u2[trait])  # similarity score
    return total / len(u1)


def calculate_group_score(users: List[User]) -> float:
    """Compute average compatibility score for a group of users."""
    scores = []
    for u1, u2 in combinations(users, 2):
        score = personality_compatibility(u1.personality_scores, u2.personality_scores)
        scores.append(score)
    return sum(scores) / len(scores)


def match_users_into_groups(users: List[User], group_size: int = 6, iterations: int = 100) -> List[List[User]]:
    """Return the best-matched user groups based on personality traits."""
    if len(users) < group_size:
        return []

    best_groups = []
    remaining_users = users.copy()
    random.shuffle(remaining_users)

    while len(remaining_users) >= group_size:
        top_score = -1
        best_group = []

        for _ in range(iterations):
            group = random.sample(remaining_users, group_size)
            score = calculate_group_score(group)
            if score > top_score:
                top_score = score
                best_group = group

        best_groups.append(best_group)

        for u in best_group:
            remaining_users.remove(u)

    return best_groups


# Utility to run full matchmaking for a given dinner
async def run_matchmaking_for_dinner(users: List[User]) -> List[List[User]]:
    # Ensure each user has valid scores
    for user in users:
        if not user.personality_scores and user.personality_answers:
            user.personality_scores = compute_personality_scores(user.personality_answers)

    return match_users_into_groups(users)
