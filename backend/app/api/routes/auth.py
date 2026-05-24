from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.auth import RegisterRequest, OTPVerifyRequest, TokenResponse
from app.services.auth_service import generate_and_send_otp, verify_otp_and_login
from app.api.dependencies import get_current_user
from jose import jwt
from datetime import datetime, timedelta
from app.core.config import settings
import redis.asyncio as redis

router = APIRouter(prefix="/auth", tags=["auth"])
redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)

@router.post("/register", response_model=dict)
async def register(request: RegisterRequest):
    await generate_and_send_otp(request.email)
    return {"message": "OTP sent successfully"}

@router.post("/verify-otp", response_model=TokenResponse)
async def verify_otp(request: OTPVerifyRequest, session: AsyncSession = Depends(get_db)):
    hmac_token = await verify_otp_and_login(request.email, request.otp, session)
    del request
    
    exp = datetime.utcnow() + timedelta(days=30)
    access_token = jwt.encode(
        {"sub": hmac_token, "exp": exp.timestamp()},
        settings.JWT_SECRET_KEY,
        algorithm="HS256"
    )
    
    await redis_client.setex(f"session:{hmac_token}", 30*86400, "active")
    
    return TokenResponse(access_token=access_token, token_type="bearer")

@router.post("/refresh", response_model=TokenResponse)
async def refresh(hmac_token: str = Depends(get_current_user)):
    exp = datetime.utcnow() + timedelta(days=30)
    access_token = jwt.encode(
        {"sub": hmac_token, "exp": exp.timestamp()},
        settings.JWT_SECRET_KEY,
        algorithm="HS256"
    )
    await redis_client.expire(f"session:{hmac_token}", 30*86400)
    return TokenResponse(access_token=access_token, token_type="bearer")

@router.post("/logout", response_model=dict)
async def logout(hmac_token: str = Depends(get_current_user)):
    await redis_client.delete(f"session:{hmac_token}")
    return {"message": "Logged out successfully"}
