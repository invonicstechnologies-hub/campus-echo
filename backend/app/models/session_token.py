from sqlalchemy import String, Index
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
from app.models.base_model import BaseModel

class SessionToken(BaseModel):
    __tablename__ = 'session_token'

    hmac_token: Mapped[str] = mapped_column(String(64), unique=True)
    expires_at: Mapped[datetime] = mapped_column()

    __table_args__ = (
        Index('ix_session_token_hmac', 'hmac_token'),
    )
