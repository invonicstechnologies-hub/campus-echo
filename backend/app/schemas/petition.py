from pydantic import BaseModel, ConfigDict, Field
import uuid
from datetime import datetime
from typing import Optional

class PetitionResponse(BaseModel):
    petition_id: uuid.UUID = Field(alias='id')
    post_id: uuid.UUID
    signature_count: int
    status: str
    threshold_met_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
