#!/bin/bash

echo "🚀 Starting FastAPI server..."
uvicorn app.main:app --host 0.0.0.0 --port 8000 &

echo "📨 Starting mail cron worker..."
python -m app.crons.notification_consumer

# If consumer exits (e.g., error), container will stop. Uncomment this if needed
# wait -n
