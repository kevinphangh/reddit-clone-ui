#!/bin/bash
set -e

echo "Starting application..."
echo "DATABASE_URL: ${DATABASE_URL:0:30}..." # Show first 30 chars for debugging

# Run database migrations
echo "Running database migrations..."
alembic upgrade head

# Start the application
echo "Starting Uvicorn server..."
exec uvicorn main:app --host 0.0.0.0 --port ${PORT:-8080}