import uuid
from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel

from app.api.dependencies import get_db
from app.core.config import settings
from app.models.moderator import Moderator
from app.core.hmac_identity import get_current_semester

router = APIRouter(prefix="/admin", tags=["admin"])


class GrantModeratorRequest(BaseModel):
    hmac_token: str


class ModeratorStatusResponse(BaseModel):
    hmac_token: str
    semester: str
    is_active: bool
    granted_at: str


def verify_admin(x_admin_secret: str = Header(...)):
    if x_admin_secret != settings.ADMIN_SECRET_KEY:
        raise HTTPException(status_code=403, detail="Admin access denied")


@router.post("/moderators", response_model=ModeratorStatusResponse)
async def grant_moderator(
    request: GrantModeratorRequest,
    session: AsyncSession = Depends(get_db),
    _: str = Depends(verify_admin),
):
    semester = get_current_semester()

    # Check if already exists for this semester
    stmt = select(Moderator).where(
        Moderator.hmac_token == request.hmac_token,
        Moderator.semester == semester,
    )
    result = await session.execute(stmt)
    existing = result.scalar_one_or_none()

    if existing:
        if existing.is_active:
            raise HTTPException(
                status_code=409,
                detail="This token already has moderator access this semester"
            )
        # Reactivate if previously revoked
        existing.is_active = True
        await session.commit()
        await session.refresh(existing)
        return ModeratorStatusResponse(
            hmac_token=existing.hmac_token,
            semester=existing.semester,
            is_active=existing.is_active,
            granted_at=existing.granted_at.isoformat(),
        )

    moderator = Moderator(
        hmac_token=request.hmac_token,
        semester=semester,
    )
    session.add(moderator)
    await session.commit()
    await session.refresh(moderator)

    return ModeratorStatusResponse(
        hmac_token=moderator.hmac_token,
        semester=moderator.semester,
        is_active=moderator.is_active,
        granted_at=moderator.granted_at.isoformat(),
    )


@router.patch("/moderators/{hmac_token}/revoke", response_model=ModeratorStatusResponse)
async def revoke_moderator(
    hmac_token: str,
    session: AsyncSession = Depends(get_db),
    _: str = Depends(verify_admin),
):
    semester = get_current_semester()

    stmt = select(Moderator).where(
        Moderator.hmac_token == hmac_token,
        Moderator.semester == semester,
    )
    result = await session.execute(stmt)
    moderator = result.scalar_one_or_none()

    if not moderator:
        raise HTTPException(
            status_code=404,
            detail="Moderator not found for current semester"
        )

    if not moderator.is_active:
        raise HTTPException(
            status_code=409,
            detail="Moderator is already revoked"
        )

    moderator.is_active = False
    await session.commit()
    await session.refresh(moderator)

    return ModeratorStatusResponse(
        hmac_token=moderator.hmac_token,
        semester=moderator.semester,
        is_active=moderator.is_active,
        granted_at=moderator.granted_at.isoformat(),
    )


@router.get("/moderators", response_model=list[ModeratorStatusResponse])
async def list_moderators(
    session: AsyncSession = Depends(get_db),
    _: str = Depends(verify_admin),
):
    semester = get_current_semester()
    stmt = select(Moderator).where(Moderator.semester == semester)
    result = await session.execute(stmt)
    moderators = result.scalars().all()

    return [
        ModeratorStatusResponse(
            hmac_token=m.hmac_token,
            semester=m.semester,
            is_active=m.is_active,
            granted_at=m.granted_at.isoformat(),
        )
        for m in moderators
    ]
