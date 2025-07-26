# app/services/notifications/email.py
from app.services.email import send_email_raw  # ← you can use your existing function

TEMPLATES = {
    "dinner_matched": lambda data: f"""
    Hello {data['name']},

    You're matched for dinner on {data['date']} at {data['time']} in {data['city']}!

    See you soon! 🍽️

    DinnerConnect Team
    """
}

def send_email_using_template(to_email: str, subject: str, template: str, context: dict):
    body = TEMPLATES[template](context)
    send_email_raw(to_email=to_email, subject=subject, body=body)
