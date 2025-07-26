import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings
from app.core.logger import logger  # If using your logger setup
from smtplib import SMTP

def send_otp_email(to_email: str, otp: str):
    try:
        # Create message container
        message = MIMEMultipart()
        message["Subject"] = "Your Bichance OTP Code"
        message["From"] = settings.EMAIL_SENDER
        message["To"] = to_email

        # Email content
        body = f"""
        Hello,

        Your OTP for Bichance is: {otp}

        This OTP is valid for 5 minutes.

        If you did not request this, please ignore this email.

        Regards,
        Bichance Team
        """
        message.attach(MIMEText(body, "plain"))

        # Connect to Gmail SMTP server
        with smtplib.SMTP(settings.SMTP_SERVER, int(settings.SMTP_PORT)) as server:
            server.starttls()
            server.login(settings.EMAIL_SENDER, settings.EMAIL_PASSWORD)
            server.send_message(message)

        logger.info(f"✅ OTP email sent to {to_email}")

    except Exception as e:
        logger.error(f"❌ Failed to send OTP email to {to_email}: {e}")
        raise

def send_venue_update_email(to_email: str, name: str, venue_name: str, venue_address: str, city: str, date: str):
    try:
        message = MIMEMultipart()
        message["Subject"] = "📍 Your Dinner Venue Has Been Updated"
        message["From"] = settings.EMAIL_SENDER
        message["To"] = to_email

        body = f"""
        Hello {name},

        Just a quick update! The venue for your upcoming dinner in {city} on {date} has been updated.

        📍 Venue: {venue_name}
        🏠 Address: {venue_address}

        We hope you have a fantastic evening!

        Cheers,  
        Team Bichance
        """
        message.attach(MIMEText(body, "plain"))

        with smtplib.SMTP(settings.SMTP_SERVER, int(settings.SMTP_PORT)) as server:
            server.starttls()
            server.login(settings.EMAIL_SENDER, settings.EMAIL_PASSWORD)
            server.send_message(message)

        logger.info(f"✅ Venue update email sent to {to_email}")
    except Exception as e:
        logger.error(f"❌ Failed to send venue update email to {to_email}: {e}")
        raise

def send_email_raw(to_email: str, subject: str, body: str):
    try:
        message = MIMEMultipart()
        message["Subject"] = subject
        message["From"] = settings.EMAIL_SENDER
        message["To"] = to_email
        message.attach(MIMEText(body, "plain"))

        with smtplib.SMTP(settings.SMTP_SERVER, int(settings.SMTP_PORT)) as server:
            server.starttls()
            server.login(settings.EMAIL_SENDER, settings.EMAIL_PASSWORD)
            server.send_message(message)

        logger.info(f"✅ Email sent to {to_email}")
    except Exception as e:
        logger.error(f"❌ Failed to send email to {to_email}: {e}")
        raise





def send_subscription_email(to_email: str, status: str):
    subject_map = {
        "active": "🎉 Subscription Activated",
        "failed": "⚠️ Payment Failed",
        "cancelled": "👋 Subscription Cancelled"
    }
    
    message = MIMEText(f"Your subscription status: {status.title()}")
    message["Subject"] = subject_map.get(status, "Subscription Update")
    message["From"] = settings.EMAIL_SENDER
    message["To"] = to_email

    with SMTP(settings.SMTP_SERVER, settings.SMTP_PORT) as server:
        server.starttls()
        server.login(settings.EMAIL_SENDER, settings.EMAIL_PASSWORD)
        server.send_message(message)
