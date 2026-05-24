from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException
import uuid
from app.models.petition import Petition
from app.models.petition_signature import PetitionSignature
from app.models.post import Post

async def create_petition(session: AsyncSession, post_id: uuid.UUID, hmac_token: str) -> Petition:
    try:
        async with session.begin():
            post = await session.get(Post, post_id)
            if not post:
                raise HTTPException(status_code=404, detail="Post not found")
                
            petition = Petition(
                post_id=post_id,
                signature_count=1,
                status='active'
            )
            session.add(petition)
            await session.flush()
            
            signature = PetitionSignature(
                petition_id=petition.id,
                hmac_token=hmac_token
            )
            session.add(signature)
            
        return petition
    except IntegrityError:
        raise HTTPException(status_code=409, detail="Petition already exists for this post")

async def sign_petition(session: AsyncSession, petition_id: uuid.UUID, hmac_token: str) -> Petition:
    try:
        async with session.begin():
            stmt = select(PetitionSignature).where(
                PetitionSignature.petition_id == petition_id, 
                PetitionSignature.hmac_token == hmac_token
            )
            result = await session.execute(stmt)
            if result.scalar_one_or_none() is not None:
                raise HTTPException(status_code=409, detail="Already signed")
                
            signature = PetitionSignature(petition_id=petition_id, hmac_token=hmac_token)
            session.add(signature)
            
            update_stmt = (
                update(Petition)
                .where(Petition.id == petition_id)
                .values(signature_count=Petition.signature_count + 1)
                .returning(Petition)
            )
            update_result = await session.execute(update_stmt)
            petition = update_result.scalar_one_or_none()
            if not petition:
                raise HTTPException(status_code=404, detail="Petition not found")
                
        from app.workers.tasks.petition_threshold import check_petition_threshold
        check_petition_threshold.apply_async(args=[str(petition.id)], ignore_result=True)
        
        return petition
    except IntegrityError:
        raise HTTPException(status_code=409, detail="Already signed")
