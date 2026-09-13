from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict

class ReviewCreate(BaseModel):
    rating: int
    comment: Optional[str] = None

class ReviewResponse(ReviewCreate):
    id: UUID
    user_id: UUID
    listing_id: UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
