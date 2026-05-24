import uuid
from datetime import datetime
from sqlalchemy import String, Boolean, DateTime, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base_model import BaseModel

class Moderator(BaseModel):
    __tablename__ = 'moderator'

    hmac_token: Mapped[str] = mapped_column(String(64), nullable=False)
    semester: Mapped[str] = mapped_column(String(20), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    granted_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )

    __table_args__ = (
        UniqueConstraint('hmac_token', 'semester', name='uq_moderator_token_semester'),
    )
