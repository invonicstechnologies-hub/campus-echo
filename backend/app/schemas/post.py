from pydantic import BaseModel, ConfigDict, Field, field_validator
import uuid
from datetime import datetime
from typing import List, Optional
import re

class PostCreate(BaseModel):
    topic_id: uuid.UUID
    content: str = Field(..., max_length=1000)

    @field_validator('content')
    @classmethod
    def validate_content(cls, v: str) -> str:
        clean_text = re.sub(r'<[^>]+>', '', v).strip()
        if not clean_text:
            raise ValueError("Content cannot be empty")
        if len(clean_text) > 1000:
            raise ValueError("Content exceeds 1000 characters")
        return clean_text

class PostResponse(BaseModel):
    post_id: uuid.UUID = Field(alias='id')
    topic_id: uuid.UUID
    content: str
    upvote_count: int
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

class PaginatedPostResponse(BaseModel):
    posts: List[PostResponse]
    next_cursor: Optional[str] = None

