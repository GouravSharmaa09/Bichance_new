from fastapi import APIRouter, Depends, HTTPException
from app.schemas.journey import SaveJourneyRequest, SubmitJourneyResponse
from app.services.matchmaking.v1 import compute_personality_scores
from app.schemas.response import SuccessResponse
from app.dependencies.auth import get_current_user  # middleware-based email extraction
from app.models.user import User, PersonalityAnswer

router = APIRouter(prefix="/journey", tags=["Journey"])
@router.post(
    "/save",
    response_model=SuccessResponse[dict],
    summary="Save a single journey answer",
    description="""
Used to save either a personality or identity answer.

---

### Supported `question_key` values:

#### 🗺️ Location
- `current_country`: User's current country
- `current_city`: User's current city

#### 🧠 Personality Questions (`q0` to `q14`):
- `q0`: I enjoy discussing politics and current news.
- `q1`: I prefer small gatherings over large parties. *(Inverted scale)*
- `q2`: I like to plan ahead and stay organized.
- `q3`: I often go with the flow rather than planning. *(Inverted scale)*
- `q4`: I enjoy debating different ideas.
- `q5`: I like trying new restaurants and cuisines.
- `q6`: I feel energized when I'm around other people.
- `q7`: I enjoy listening more than talking. *(Inverted scale)*
- `q8`: I enjoy philosophical or deep conversations.
- `q9`: I prefer familiar foods over exotic dishes. *(Inverted scale)*
- `q10`: I enjoy meeting new and different types of people.
- `q11`: I like organizing events and gatherings.
- `q12`: I prefer quiet environments. *(Inverted scale)*
- `q13`: I am comfortable sharing personal stories.
- `q14`: I like helping others feel included in a group.

> 💡 For these questions, answers should be `"0"` or `"1"` (interpreted as boolean: disagree/agree).

#### 🧬 Identity Information:
- `name`: Full name of the user
- `mobile`: Phone number of the user
- `gender`: User's gender
- `relationship_status`: User’s current relationship status
- `children`: Whether the user has children (`true`/`false`)
- `profession`: User's professional domain or industry
- `country`: Country of origin
- `dob`: Date of birth (format: `YYYY-MM-DD`)

---
"""
)

async def save_journey(
    payload: SaveJourneyRequest,
    user: str = Depends(get_current_user)
):
    user = await User.find_one(User.email == user.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    key = payload.question_key
    val = payload.answer

    if key == "current_country":
        user.current_country = val
    elif key == "current_city":
        user.current_city = val
    elif key.startswith("q") and key[1:].isdigit():
        index = int(key[1:])
        if 0 <= index < 15:
            # Map index to trait
            trait_map = ["O", "C", "E", "A", "N",
                        "O", "C", "E", "A", "N",
                        "O", "C", "E", "A", "N"]
            trait = trait_map[index]

            # Ensure valid list
            if not user.personality_answers or len(user.personality_answers) < 15:
                user.personality_answers = [
                    PersonalityAnswer(trait=trait_map[i], question="", answer="") for i in range(15)
                ]

            user.personality_answers[index] = PersonalityAnswer(
                trait=trait,
                question=payload.question or "",
                answer=val
            )
        else:
            raise HTTPException(status_code=400, detail="Invalid question index")
    elif key in {"gender", "relationship_status", "profession", "country", "name", "mobile"}:
        setattr(user, key, val)
    elif key == "children":
        user.children = bool(val)
    elif key == "dob":
        user.dob = val
    else:
        raise HTTPException(status_code=400, detail="Unknown question_key")

    await user.save()
    return SuccessResponse(message="Answer saved", data={})


@router.post("/submit",summary="Submit the journey",
    description="Finalizes the journey and stores the personality scores", response_model=SuccessResponse[SubmitJourneyResponse])
async def submit_journey(user: User = Depends(get_current_user)):
    user = await User.find_one(User.email == user.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not user.personality_answers or any(a is None or not a.trait for a in user.personality_answers):
        raise HTTPException(status_code=400, detail="Not all personality questions are answered")


    scores = compute_personality_scores(user.personality_answers)
    user.personality_scores = scores
    await user.save()

    return SuccessResponse(
        message="Journey submitted successfully",
        data=SubmitJourneyResponse(message="Personality assessed", scores=scores)
    )