from sqlalchemy import String, ForeignKey, Enum, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
import uuid
from app.models.base_model import BaseModel

class Flag(BaseModel):
    __tablename__ = 'flag'

    post_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('post.id'))
    hmac_token: Mapped[str] = mapped_column(String(64), nullable=False)
    reason: Mapped[str] = mapped_column(
        Enum('harassment', 'defamation', 'spam', 'sexual_content', 'threat', 'other', name='flag_reason')
    )

    __table_args__ = (
        UniqueConstraint('post_id', 'hmac_token', name='uq_flag_post_hmac'),
    )
