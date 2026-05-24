from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base_model import BaseModel

class Topic(BaseModel):
    __tablename__ = 'topic'

    name: Mapped[str] = mapped_column(String(50), unique=True)
    description: Mapped[str] = mapped_column(Text)
