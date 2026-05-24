from sqlalchemy import String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
import uuid
from app.models.base_model import BaseModel

class Upvote(BaseModel):
    __tablename__ = 'upvote'

    post_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('post.id'))
    hmac_token: Mapped[str] = mapped_column(String(64))

    __table_args__ = (
        UniqueConstraint('post_id', 'hmac_token', name='uq_upvote_post_hmac'),
    )
