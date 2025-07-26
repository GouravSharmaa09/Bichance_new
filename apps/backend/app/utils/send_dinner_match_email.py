import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings
from app.core.logger import logger


def send_dinner_match_email(to_email: str, name: str, date: str, time: str, city: str):
    try:
        # Create message container
        message = MIMEMultipart()
        message["Subject"] = "🎉 You’ve Been Matched for Dinner!"
        message["From"] = settings.EMAIL_SENDER
        message["To"] = to_email

        # Email content
        body = f"""
        Hello {name},

        Great news! You've been matched for a dinner happening in {city}.

        📅 Date: {date}
        🕗 Time: {time}

        Your dinner group has been thoughtfully curated to ensure a great experience.

        You’ll receive the venue details shortly. Until then, mark your calendar!

        Bon Appétit,
        Team DinnerConnect
        """
        message.attach(MIMEText(body, "plain"))

        # Connect to SMTP server
        with smtplib.SMTP(settings.SMTP_SERVER, int(settings.SMTP_PORT)) as server:
            server.starttls()
            server.login(settings.EMAIL_SENDER, settings.EMAIL_PASSWORD)
            server.send_message(message)

        logger.info(f"✅ Dinner match email sent to {to_email}")

    except Exception as e:
        logger.error(f"❌ Failed to send dinner match email to {to_email}: {e}")
        raise
