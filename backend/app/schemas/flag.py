from typing import Literal
import uuid
from pydantic import BaseModel, ConfigDict, Field

class FlagCreate(BaseModel):
    reason: Literal['harassment', 'defamation', 'spam', 'sexual_content', 'threat', 'other']

class FlagResponse(BaseModel):
    flag_id: uuid.UUID = Field(alias='id')
    post_id: uuid.UUID
    reason: str

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
