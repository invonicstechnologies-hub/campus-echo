import logging
from app.workers.celery_app import celery_app
from app.core.config import settings
from openai import OpenAI
import asyncio
from app.db.session import async_session_maker
from app.models.post import Post

client = OpenAI(api_key=settings.OPENAI_API_KEY)

async def _do_moderation(post_id: str):
    # Phase 1: Read
    async with async_session_maker() as session:
        async with session.begin():
            post = await session.get(Post, post_id)
            if not post or post.status != 'published':
                return
            content = post.content

    # Phase 2: External call - no DB connection held
    response = client.moderations.create(input=content)
    result = response.results[0]
    
    # Phase 3: Write if flagged
    if result.flagged:
        async with async_session_maker() as session:
            async with session.begin():
                post = await session.get(Post, post_id)
                if post and post.status == 'published':
                    post.status = 'under_review'
                    logging.info(f"Post {post_id} flagged by AI moderation.")

async def _set_post_flagged(post_id: str):
    async with async_session_maker() as session:
        async with session.begin():
            post = await session.get(Post, post_id)
            if post and post.status == 'published':
                post.status = 'flagged'
                logging.warning(f"Post {post_id} marked as flagged due to moderation failure.")

from celery.exceptions import MaxRetriesExceededError

@celery_app.task(bind=True, max_retries=3, ignore_result=True)
def ai_moderation(self, post_id: str):
    try:
        asyncio.run(_do_moderation(post_id))
    except Exception as exc:
        try:
            raise self.retry(exc=exc, countdown=2 ** self.request.retries)
        except MaxRetriesExceededError:
            asyncio.run(_set_post_flagged(post_id))
