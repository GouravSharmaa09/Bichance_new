import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings
from app.core.logger import logger


def send_dinner_opt_in_email(to_email: str, name: str, date: str, time: str, city: str):
    try:
        # Create message container
        message = MIMEMultipart()
        message["Subject"] = "🍽️ Dinner Opt-In Confirmed!"
        message["From"] = settings.EMAIL_SENDER
        message["To"] = to_email

        # Plain text body
        body = f"""
        Hello {name},

        You've successfully opted in for a dinner happening in {city}!

        📅 Date: {date}
        🕗 Time: {time}

        We're excited to have you as part of our community. 
        Once the dinner group is matched and confirmed, 
        you'll receive all the information — including venue details.

        Stay tuned!

        Cheers,
        Team DinnerConnect
        """
        message.attach(MIMEText(body, "plain"))

        # Connect to SMTP server
        with smtplib.SMTP(settings.SMTP_SERVER, int(settings.SMTP_PORT)) as server:
            server.starttls()
            server.login(settings.EMAIL_SENDER, settings.EMAIL_PASSWORD)
            server.send_message(message)

        logger.info(f"✅ Dinner opt-in email sent to {to_email}")

    except Exception as e:
        logger.error(f"❌ Failed to send dinner opt-in email to {to_email}: {e}")
        raise
