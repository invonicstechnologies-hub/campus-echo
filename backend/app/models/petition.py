from sqlalchemy import ForeignKey, Integer, Enum, DateTime
from sqlalchemy.orm import Mapped, mapped_column
import uuid
from datetime import datetime
from app.models.base_model import BaseModel

class Petition(BaseModel):
    __tablename__ = 'petition'

    post_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('post.id'), unique=True)
    signature_count: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[str] = mapped_column(
        Enum('active', 'threshold_met', 'closed', name='petition_status'),
        default='active'
    )
    threshold_met_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
