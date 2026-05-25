import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import auth, posts, petitions, flags, moderation, admin
from app.middleware.request_id import RequestIDMiddleware
from app.middleware.rate_limit import RateLimitMiddleware

app = FastAPI(title="Unsaid API")

# CORS must be added first so preflight OPTIONS requests are handled
# before any other middleware inspects them
allowed_origins = [o.strip() for o in os.environ.get("ALLOWED_ORIGINS", "").split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(RateLimitMiddleware)
app.add_middleware(RequestIDMiddleware)

app.include_router(auth.router)
app.include_router(posts.router)
app.include_router(petitions.router)
app.include_router(flags.router)
app.include_router(moderation.router)
app.include_router(admin.router)

@app.get("/health")
async def health_check():
    return {"status": "ok"}
