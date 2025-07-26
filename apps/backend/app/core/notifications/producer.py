# app/core/notifications/producer.py
import boto3
import json
from app.core.config import settings

sqs = boto3.client(
    "sqs",
    region_name=settings.AWS_REGION,
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
)

def queue_notification(data: dict):
    return sqs.send_message(
        QueueUrl=settings.SQS_QUEUE_URL,
        MessageBody=json.dumps(data)
    )
