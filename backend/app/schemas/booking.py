from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict

from app.models.booking import BookingStatus

class BookingBase(BaseModel):
    check_in: datetime
    check_out: datetime
    guests: int = 1
    notes: Optional[str] = None

class BookingCreate(BookingBase):
    listing_id: UUID

class BookingUpdate(BaseModel):
    status: Optional[BookingStatus] = None
    notes: Optional[str] = None

class BookingResponse(BookingBase):
    id: UUID
    user_id: UUID
    listing_id: UUID
    status: BookingStatus
    total_price: float
    currency: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
