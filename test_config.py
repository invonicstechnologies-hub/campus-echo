import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend')))

from app.core.config import Settings

try:
    s = Settings(
        DATABASE_URL="postgresql://...",
        REDIS_URL="redis://...",
        JWT_SECRET_KEY="x"*32,
        SEMESTER_SALT_SECRET="x"*32,
        ADMIN_SECRET_KEY="x"*32,
        CSRF_HEADER_NAME="x",
        CSRF_HEADER_VALUE="x"*32,
        GMAIL_SENDER="x",
        GMAIL_APP_PASSWORD="x",
        OPENAI_API_KEY="x"
    )
    print("Success:", s.ALLOWED_ORIGINS)
except Exception as e:
    import traceback
    traceback.print_exc()
