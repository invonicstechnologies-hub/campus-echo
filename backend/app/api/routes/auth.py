from fastapi import APIRouter, Depends, HTTPException, status, Response, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import delete
from app.db.session import get_db
from app.models.session_token import SessionToken
from app.schemas.auth import RegisterRequest, OTPVerifyRequest, TokenResponse, AuthSuccessResponse
from app.services.auth_service import verify_otp_and_login
from app.utils.email import send_otp_email_sync
import hashlib
import secrets
from app.api.dependencies import get_current_user
from jose import jwt
from datetime import datetime, timedelta
from app.core.config import settings
import redis.asyncio as redis

router = APIRouter(prefix="/auth", tags=["auth"])
redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)

@router.post("/send-otp", response_model=AuthSuccessResponse)
async def send_otp(request: RegisterRequest, background_tasks: BackgroundTasks):
    email_hash = hashlib.sha256(request.email.encode('utf-8')).hexdigest()
    redis_key = f"otp:{email_hash}"

    ttl = await redis_client.ttl(redis_key)
    if ttl > 0:
        raise HTTPException(status_code=429, detail="OTP already sent, please wait before retrying")

    otp = "".join(secrets.choice("0123456789") for _ in range(6))
    
    await redis_client.setex(redis_key, 600, otp)
    background_tasks.add_task(send_otp_email_sync, request.email, otp)
    
    return {"message": "OTP sent"}

@router.post("/verify-otp", response_model=AuthSuccessResponse)
async def verify_otp(
    request: OTPVerifyRequest,
    response: Response,
    session: AsyncSession = Depends(get_db)
):
    hmac_token = await verify_otp_and_login(request.email, request.otp, session)
    del request

    exp = datetime.utcnow() + timedelta(days=30)
    access_token = jwt.encode(
        {"sub": hmac_token, "exp": exp.timestamp()},
        settings.JWT_SECRET_KEY,
        algorithm="HS256"
    )

    await redis_client.setex(f"session:{hmac_token}", 30 * 86400, "active")

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite="strict",
        domain=settings.COOKIE_DOMAIN,
        max_age=30 * 86400,
        path="/",
    )

    return AuthSuccessResponse(message="Authenticated")

@router.post("/refresh", response_model=AuthSuccessResponse)
async def refresh(response: Response, hmac_token: str = Depends(get_current_user)):
    exp = datetime.utcnow() + timedelta(days=30)
    access_token = jwt.encode(
        {"sub": hmac_token, "exp": exp.timestamp()},
        settings.JWT_SECRET_KEY,
        algorithm="HS256"
    )
    await redis_client.expire(f"session:{hmac_token}", 30*86400)

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite="strict",
        domain=settings.COOKIE_DOMAIN,
        max_age=30*86400,
        path="/",
    )

    return AuthSuccessResponse(message="Token refreshed")

@router.post("/logout", response_model=AuthSuccessResponse)
async def logout(
    response: Response,
    hmac_token: str = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    await redis_client.delete(f"session:{hmac_token}")

    stmt = delete(SessionToken).where(
        SessionToken.hmac_token == hmac_token
    )
    await session.execute(stmt)
    await session.commit()

    response.delete_cookie(
        key="access_token",
        domain=settings.COOKIE_DOMAIN,
        path="/",
    )

    return AuthSuccessResponse(message="Logged out")
