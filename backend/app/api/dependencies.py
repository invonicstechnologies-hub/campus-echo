from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from jose import JWTError, jwt
from app.core.config import settings
from app.db.session import get_db
from app.models.session_token import SessionToken
from datetime import datetime
from sqlalchemy import select
import redis.asyncio as aioredis

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/verify-otp")

redis_client = aioredis.from_url(settings.REDIS_URL, decode_responses=True)

async def get_current_user(token: str = Depends(oauth2_scheme), session: AsyncSession = Depends(get_db)) -> str:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=["HS256"])
        hmac_token: str = payload.get("sub")
        if hmac_token is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    session_active = await redis_client.get(f"session:{hmac_token}")
    if not session_active:
        raise credentials_exception

    stmt = select(SessionToken).where(SessionToken.hmac_token == hmac_token)
    result = await session.execute(stmt)
    session_token = result.scalar_one_or_none()
    
    if not session_token:
        raise credentials_exception
        
    if session_token.expires_at < datetime.utcnow():
        raise credentials_exception

    return hmac_token
