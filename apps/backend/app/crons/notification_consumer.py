
import boto3, json, time
from app.core.config import settings
from app.services.notifications.email import send_email_using_template
from app.services.email import send_venue_update_email, send_subscription_email
from app.utils.send_dinner_match_email import send_dinner_match_email
from app.services.email import send_otp_email
from app.utils.dinner_opt_in_mail import send_dinner_opt_in_email

sqs = boto3.client(
    "sqs",
    region_name=settings.AWS_REGION,
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
)

def consume():
    while True:
        response = sqs.receive_message(
            QueueUrl=settings.SQS_QUEUE_URL,
            MaxNumberOfMessages=5,
            WaitTimeSeconds=10
        )
        for msg in response.get("Messages", []):
            try:
                body = json.loads(msg["Body"])

                msg_type = body.get("type")

                if msg_type == "email":
                    send_email_using_template(
                        to_email=body["to"],
                        subject=body["subject"],
                        template=body["template"],
                        context=body["data"]
                    )

                elif msg_type == "VENUE_UPDATE":
                    send_venue_update_email(
                        to_email=body["to_email"],
                        name=body["name"],
                        venue_name=body["venue_name"],
                        venue_address=body["venue_address"],
                        city=body["city"],
                        date=body["date"]
                    )

                elif msg_type == "DINNER_UPDATE":
                    send_dinner_match_email(
                        to_email=body["to_email"],
                        name=body["name"],
                        date=body["date"],
                        time=body["time"],
                        city=body["city"]
                    )

                elif msg_type == "SUBSCRIPTION_EMAIL":
                    send_subscription_email(
                        to_email=body["to_email"],
                        status=body["status"]
                    )
                    
                elif msg_type == "OTP_EMAIL":
                    send_otp_email(
                        to_email=body["to_email"],
                        otp=body["otp"]
                    )
                elif msg_type == "DINNER_OPT_IN_EMAIL":
                    send_dinner_opt_in_email(
                        to_email=body["to_email"],
                        name=body["name"],
                        date=body["date"],
                        time=body["time"],
                        city=body["city"]
                    )
                
                # ✅ DELETE after success:
                sqs.delete_message(
                    QueueUrl=settings.SQS_QUEUE_URL,
                    ReceiptHandle=msg["ReceiptHandle"]
                )

            except Exception as e:
                print(f"❌ Error processing SQS message: {e}")


if __name__ == "__main__":
    consume()