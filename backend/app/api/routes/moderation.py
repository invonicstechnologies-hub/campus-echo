from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
import uuid
from typing import List
from app.db.session import get_db
from app.schemas.post import PostResponse
from app.schemas.moderation import ModerationAction, ModerationResponse
from app.services.moderation_service import get_moderation_queue, action_post
from app.api.dependencies import get_current_user

router = APIRouter(prefix="/moderation", tags=["moderation"])

async def get_moderator(hmac_token: str = Depends(get_current_user)):
    # Moderator check logic placeholder
    return hmac_token

@router.get("/queue", response_model=List[PostResponse])
async def queue(session: AsyncSession = Depends(get_db), moderator_hmac: str = Depends(get_moderator)):
    return await get_moderation_queue(session)

@router.patch("/posts/{post_id}", response_model=ModerationResponse)
async def action(post_id: uuid.UUID, req: ModerationAction, session: AsyncSession = Depends(get_db), moderator_hmac: str = Depends(get_moderator)):
    return await action_post(session, post_id, req.action, moderator_hmac)
