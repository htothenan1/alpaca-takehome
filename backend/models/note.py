from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class Note(BaseModel):
    title: str
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None
