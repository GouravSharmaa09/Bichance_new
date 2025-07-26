from enum import Enum

class QuestionKey(str, Enum):
    current_country = "current_country"
    current_city = "current_city"
    q0 = "q0"   # Politics/news discussion
    q1 = "q1"   # Small groups vs large parties (inverted)
    q2 = "q2"   # Planning ahead
    q3 = "q3"   # Go with the flow (inverted)
    q4 = "q4"   # Debating ideas
    q5 = "q5"   # Trying new restaurants
    q6 = "q6"   # Energy from others
    q7 = "q7"   # Listening vs talking (inverted)
    q8 = "q8"   # Philosophical discussions
    q9 = "q9"   # Familiar vs exotic food (inverted)
    q10 = "q10" # Meeting different people
    q11 = "q11" # Organizing events
    q12 = "q12" # Prefer quiet environments
    q13 = "q13" # Sharing personal stories
    q14 = "q14" # Helping others feel included
    gender = "gender"
    relationship_status = "relationship_status"
    children = "children"
    profession = "profession"
    country = "country"
    dob = "dob"
    name = "name"
    mobile = "mobile"
