from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from datetime import datetime
import base64
import json
import uuid
from app.db.session import get_db
from app.schemas.post import PostCreate, PostResponse, PaginatedPostResponse
from app.services.post_service import create_post, upvote_post
from app.api.dependencies import get_current_user
from sqlalchemy import select, and_, or_
from app.models.post import Post

router = APIRouter(prefix="/posts", tags=["posts"])

@router.post("", response_model=dict)
async def create_new_post(request: PostCreate, hmac_token: str = Depends(get_current_user), session: AsyncSession = Depends(get_db)):
    post = await create_post(session, hmac_token, request.topic_id, request.content)
    return {"post_id": post.id, "status": post.status}

@router.get("", response_model=PaginatedPostResponse)
async def get_posts(
    topic_id: Optional[uuid.UUID] = None,
    cursor: Optional[str] = Query(None, description="Base64 encoded cursor"),
    limit: int = Query(20, le=100),
    session: AsyncSession = Depends(get_db)
):
    stmt = select(Post).where(Post.status == 'published')
    if topic_id:
        stmt = stmt.where(Post.topic_id == topic_id)
        
    if cursor:
        try:
            cursor_data = json.loads(base64.b64decode(cursor).decode('utf-8'))
            cursor_time = datetime.fromisoformat(cursor_data['created_at'])
            cursor_id = uuid.UUID(cursor_data['post_id'])
        except (KeyError, ValueError, TypeError):
            raise HTTPException(status_code=400, detail="Invalid cursor")

        stmt = stmt.where(
            or_(
                Post.created_at < cursor_time,
                and_(Post.created_at == cursor_time, Post.id < cursor_id)
            )
        )
            
    stmt = stmt.order_by(Post.created_at.desc(), Post.id.desc()).limit(limit)
    result = await session.execute(stmt)
    posts = result.scalars().all()

    if posts:
        last = posts[-1]
        next_cursor = base64.b64encode(json.dumps({
            "created_at": last.created_at.isoformat(),
            "post_id": str(last.id)
        }).encode()).decode()
    else:
        next_cursor = None

    return PaginatedPostResponse(posts=posts, next_cursor=next_cursor)

@router.post("/{post_id}/upvote", response_model=PostResponse)
async def upvote(post_id: uuid.UUID, hmac_token: str = Depends(get_current_user), session: AsyncSession = Depends(get_db)):
    return await upvote_post(session, post_id, hmac_token)
