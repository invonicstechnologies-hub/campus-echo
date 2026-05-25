import json
from app.main import app
import os

# We mock env variables just in case app.main needs them at import time
os.environ.setdefault("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@localhost/test")
os.environ.setdefault("REDIS_URL", "redis://localhost")
os.environ.setdefault("JWT_SECRET_KEY", "x"*32)
os.environ.setdefault("SEMESTER_SALT_SECRET", "x"*32)
os.environ.setdefault("ADMIN_SECRET_KEY", "x"*32)
os.environ.setdefault("CSRF_HEADER_VALUE", "x"*32)
os.environ.setdefault("CSRF_HEADER_NAME", "X-CSRF")
os.environ.setdefault("RESEND_API_KEY", "resend")
os.environ.setdefault("OPENAI_API_KEY", "openai")

with open("openapi.json", "w") as f:
    json.dump(app.openapi(), f)
print("openapi.json dumped")
