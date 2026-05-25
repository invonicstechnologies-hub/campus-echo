from fastapi import Depends, HTTPException, status, Cookie
from sqlalchemy.ext.asyncio import AsyncSession
from jose import JWTError, jwt
from app.core.config import settings
from app.db.session import get_db
from app.models.session_token import SessionToken
from datetime import datetime
from sqlalchemy import select
import redis.asyncio as aioredis



redis_client = aioredis.from_url(settings.REDIS_URL, decode_responses=True)

async def get_current_user(
    access_token: str = Cookie(default=None),
    session: AsyncSession = Depends(get_db)
) -> str:
    credentials_exception = HTTPException(
        status_code=401,
        detail="Not authenticated",
    )

    if not access_token:
        raise credentials_exception

    try:
        payload = jwt.decode(
            access_token,
            settings.JWT_SECRET_KEY,
            algorithms=["HS256"]
        )
        hmac_token: str = payload.get("sub")
        if not hmac_token:
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

from app.models.moderator import Moderator
from app.core.hmac_identity import get_current_semester

async def get_moderator(
    hmac_token: str = Depends(get_current_user),
    session: AsyncSession = Depends(get_db),
) -> str:
    semester = get_current_semester()

    stmt = select(Moderator).where(
        Moderator.hmac_token == hmac_token,
        Moderator.semester == semester,
        Moderator.is_active == True,
    )
    result = await session.execute(stmt)
    moderator = result.scalar_one_or_none()

    if not moderator:
        raise HTTPException(
            status_code=403,
            detail="Moderator access required"
        )

    return hmac_token
