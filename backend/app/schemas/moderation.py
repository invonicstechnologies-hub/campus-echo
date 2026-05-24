from pydantic import BaseModel, ConfigDict
from typing import Literal

class ModerationAction(BaseModel):
    action: Literal['remove', 'restore', 'escalate']

class ModerationResponse(BaseModel):
    status: str
    
    model_config = ConfigDict(from_attributes=True)
