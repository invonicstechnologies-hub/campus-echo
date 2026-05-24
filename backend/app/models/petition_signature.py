from sqlalchemy import String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
import uuid
from app.models.base_model import BaseModel

class PetitionSignature(BaseModel):
    __tablename__ = 'petition_signature'

    petition_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('petition.id'))
    hmac_token: Mapped[str] = mapped_column(String(64))

    __table_args__ = (
        UniqueConstraint('petition_id', 'hmac_token', name='uq_sig_petition_hmac'),
    )
