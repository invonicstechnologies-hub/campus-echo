from sqlalchemy import String, Text, ForeignKey, Integer, Enum
from sqlalchemy.orm import Mapped, mapped_column
import uuid
from app.models.base_model import BaseModel

class Post(BaseModel):
    __tablename__ = 'post'

    hmac_token: Mapped[str] = mapped_column(String(64), ForeignKey('session_token.hmac_token'))
    topic_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('topic.id'))
    content: Mapped[str] = mapped_column(Text)
    upvote_count: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[str] = mapped_column(
        Enum('published', 'flagged', 'under_review', 'removed', 'restored', name='post_status'),
        default='published'
    )
