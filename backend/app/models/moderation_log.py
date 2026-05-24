from sqlalchemy import String, ForeignKey, Enum, DateTime
from sqlalchemy.orm import Mapped, mapped_column
import uuid
from datetime import datetime
from sqlalchemy.sql import func
from app.models.base_model import BaseModel

class ModerationLog(BaseModel):
    __tablename__ = 'moderation_log'

    action: Mapped[str] = mapped_column(Enum('remove', 'restore', 'escalate', name='moderation_action'))
    post_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('post.id'))
    moderator_hmac_token: Mapped[str] = mapped_column(String(64), nullable=False)
    reason: Mapped[str | None] = mapped_column(String(255), nullable=True)
    actioned_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
