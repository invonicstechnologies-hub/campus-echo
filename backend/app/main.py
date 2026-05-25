from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import auth, posts, petitions, flags, moderation, admin
from app.middleware.request_id import RequestIDMiddleware
from app.middleware.rate_limit import RateLimitMiddleware

app = FastAPI(title="Unsaid API")

app.add_middleware(RateLimitMiddleware)
app.add_middleware(RequestIDMiddleware)
from app.core.config import settings

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

app.include_router(auth.router)
app.include_router(posts.router)
app.include_router(petitions.router)
app.include_router(flags.router)
app.include_router(moderation.router)
app.include_router(admin.router)

@app.get("/health")
async def health_check():
    return {"status": "ok"}
