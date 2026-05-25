#!/bin/bash
set -e

echo "🚀 Starting Unsaid API..."
echo "⏳ Running database migrations..."

# Run alembic with a 60-second timeout to prevent hanging
timeout 60 alembic upgrade head
MIGRATION_EXIT=$?

if [ $MIGRATION_EXIT -eq 124 ]; then
    echo "⚠️  Alembic timed out after 60s — proceeding without migrations"
elif [ $MIGRATION_EXIT -ne 0 ]; then
    echo "❌ Alembic failed with exit code $MIGRATION_EXIT"
    exit $MIGRATION_EXIT
else
    echo "✅ Migrations complete"
fi

echo "🌱 Running database seed script..."
python scripts/seed_initial_data.py

echo "🌐 Starting uvicorn..."
exec uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-8000}" --workers 2 --loop uvloop
