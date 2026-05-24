from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
import uuid
from app.db.session import get_db
from app.schemas.flag import FlagCreate, FlagResponse
from app.services.moderation_service import flag_post
from app.api.dependencies import get_current_user

router = APIRouter(tags=["flags"])

@router.post("/posts/{post_id}/flag", response_model=FlagResponse)
async def flag(post_id: uuid.UUID, request: FlagCreate, hmac_token: str = Depends(get_current_user), session: AsyncSession = Depends(get_db)):
    return await flag_post(session, post_id, request.reason, hmac_token)
