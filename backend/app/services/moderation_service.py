from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, func
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException
import uuid
from typing import Sequence
from app.models.post import Post
from app.models.flag import Flag
from app.models.moderation_log import ModerationLog

async def get_moderation_queue(session: AsyncSession) -> Sequence[Post]:
    stmt = (
        select(Post)
        .outerjoin(Flag, Post.id == Flag.post_id)
        .where(Post.status == 'under_review')
        .group_by(Post.id)
        .order_by(func.count(Flag.id).desc(), Post.created_at.asc())
    )
    result = await session.execute(stmt)
    return result.scalars().all()

async def flag_post(session: AsyncSession, post_id: uuid.UUID, reason: str, hmac_token: str) -> Flag:
    try:
        async with session.begin():
            post = await session.get(Post, post_id)
            if not post:
                raise HTTPException(status_code=404, detail="Post not found")
                
            flag = Flag(post_id=post_id, reason=reason, hmac_token=hmac_token)
            session.add(flag)
            await session.flush()
            
            stmt = select(func.count(Flag.id)).where(Flag.post_id == post_id)
            result = await session.execute(stmt)
            flag_count = result.scalar() or 0
            
            if flag_count >= 5 and post.status == 'published':
                post.status = 'under_review'
                
                from app.workers.tasks.ai_moderation import ai_moderation
                ai_moderation.apply_async(args=[str(post_id)], ignore_result=True, countdown=2)
                
        return flag
    except IntegrityError:
        raise HTTPException(status_code=409, detail="Already flagged")

async def action_post(session: AsyncSession, post_id: uuid.UUID, action: str, moderator_hmac: str) -> dict:
    try:
        async with session.begin():
            post = await session.get(Post, post_id)
            if not post:
                raise HTTPException(status_code=404, detail="Post not found")
                
            if action == 'remove':
                post.status = 'removed'
            elif action == 'restore':
                post.status = 'restored'
                
            log = ModerationLog(
                action=action,
                post_id=post_id,
                moderator_hmac=moderator_hmac,
                reason="Moderator action"
            )
            session.add(log)
            
        return {"status": post.status}
    except IntegrityError:
        raise HTTPException(status_code=500, detail="Failed to apply moderation action")
