import redis
from app.workers.celery_app import celery_app
from app.core.config import settings
import asyncio
from app.db.session import async_session_maker
from app.models.petition import Petition
from app.services.notification_service import notify_petition_threshold
from datetime import datetime

redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)

async def _check_threshold(petition_id: str):
    async with async_session_maker() as session:
        async with session.begin():
            petition = await session.get(Petition, petition_id)
            if not petition or petition.status != 'active':
                return
                
            count = petition.signature_count
            thresholds = [200, 100, 50]
            
            crossed = False
            for t in thresholds:
                if count >= t:
                    crossed = True
                    break
                    
            if crossed:
                petition.status = 'threshold_met'
                petition.threshold_met_at = datetime.utcnow()
                notify_petition_threshold(petition.id, count)

@celery_app.task(ignore_result=True)
def check_petition_threshold(petition_id: str):
    lock = redis_client.lock(f"petition_threshold_lock:{petition_id}", timeout=30)
    if not lock.acquire(blocking=False):
        return
    try:
        asyncio.run(_check_threshold(petition_id))
    finally:
        lock.release()
