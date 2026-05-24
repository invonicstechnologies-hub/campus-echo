from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
import uuid
from app.db.session import get_db
from app.schemas.petition import PetitionResponse
from app.services.petition_service import create_petition, sign_petition
from app.api.dependencies import get_current_user

router = APIRouter(tags=["petitions"])

@router.post("/posts/{post_id}/petition", response_model=PetitionResponse)
async def create(post_id: uuid.UUID, hmac_token: str = Depends(get_current_user), session: AsyncSession = Depends(get_db)):
    return await create_petition(session, post_id, hmac_token)

@router.post("/petitions/{petition_id}/sign", response_model=PetitionResponse)
async def sign(petition_id: uuid.UUID, hmac_token: str = Depends(get_current_user), session: AsyncSession = Depends(get_db)):
    return await sign_petition(session, petition_id, hmac_token)
