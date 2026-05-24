from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
import uuid
from typing import List
from app.db.session import get_db
from app.schemas.post import PostResponse
from app.schemas.moderation import ModerationAction, ModerationResponse
from app.services.moderation_service import get_moderation_queue, action_post
from app.api.dependencies import get_current_user, get_moderator

router = APIRouter(prefix="/moderation", tags=["moderation"])

@router.get("/queue", response_model=List[PostResponse])
async def queue(session: AsyncSession = Depends(get_db), hmac_token: str = Depends(get_moderator)):
    return await get_moderation_queue(session)

@router.post("/posts/{post_id}/action", response_model=ModerationResponse)
async def moderate_post(
    post_id: uuid.UUID,
    request: ModerationAction,
    hmac_token: str = Depends(get_moderator),
    session: AsyncSession = Depends(get_db),
):
    return await action_post(session, post_id, request.action, hmac_token)
