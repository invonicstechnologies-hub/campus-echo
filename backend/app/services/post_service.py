from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException
import uuid
from app.models.post import Post
from app.models.upvote import Upvote

async def create_post(session: AsyncSession, hmac_token: str, topic_id: uuid.UUID, content: str) -> Post:
    try:
        async with session.begin():
            post = Post(
                hmac_token=hmac_token,
                topic_id=topic_id,
                content=content,
                status='published'
            )
            session.add(post)
            await session.flush()
            post_id = post.id
            
        from app.workers.tasks.ai_moderation import ai_moderation
        ai_moderation.apply_async(args=[str(post_id)], ignore_result=True, countdown=2)
        
        return post
    except IntegrityError:
        raise HTTPException(status_code=400, detail="Failed to create post. Invalid topic_id?")

async def upvote_post(session: AsyncSession, post_id: uuid.UUID, hmac_token: str) -> Post:
    try:
        async with session.begin():
            stmt = select(Upvote).where(Upvote.post_id == post_id, Upvote.hmac_token == hmac_token)
            result = await session.execute(stmt)
            if result.scalar_one_or_none() is not None:
                raise HTTPException(status_code=409, detail="Already upvoted")

            upvote = Upvote(post_id=post_id, hmac_token=hmac_token)
            session.add(upvote)
            
            update_stmt = (
                update(Post)
                .where(Post.id == post_id)
                .values(upvote_count=Post.upvote_count + 1)
                .returning(Post)
            )
            update_result = await session.execute(update_stmt)
            post = update_result.scalar_one_or_none()
            if not post:
                raise HTTPException(status_code=404, detail="Post not found")
                
            return post
    except IntegrityError:
        raise HTTPException(status_code=409, detail="Already upvoted")
