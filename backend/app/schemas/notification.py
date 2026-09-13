from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict

from app.models.notification import NotificationType, ContactRequestStatus

class NotificationResponse(BaseModel):
    id: UUID
    user_id: UUID
    title: str
    message: str
    notification_type: NotificationType
    is_read: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class ContactRequestCreate(BaseModel):
    message: str

class ContactRequestResponse(ContactRequestCreate):
    id: UUID
    sender_id: UUID
    listing_id: UUID
    status: ContactRequestStatus
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
