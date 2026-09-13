from datetime import datetime
from typing import Optional, Dict, Any
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field

from app.models.payment import PaymentProvider, PaymentStatus

class PaymentBase(BaseModel):
    amount: float = Field(..., gt=0, description="Amount in XAF")
    currency: str = "XAF"
    provider: PaymentProvider = PaymentProvider.notch_pay
    description: Optional[str] = "Paiement KamStore"

class PaymentCreate(PaymentBase):
    booking_id: Optional[UUID] = None
    customer_phone: Optional[str] = Field(None, description="Phone number (e.g. +237699000000)")
    customer_email: Optional[str] = Field(None, description="Customer email")
    channel: Optional[str] = Field("cm.mobile", description="Channel: cm.mtn, cm.orange, cm.mobile")

class PaymentResponse(PaymentBase):
    id: UUID
    user_id: UUID
    booking_id: Optional[UUID] = None
    status: PaymentStatus
    transaction_ref: str
    provider_ref: Optional[str] = None
    checkout_url: Optional[str] = None
    customer_phone: Optional[str] = None
    customer_email: Optional[str] = None
    metadata_: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class NotchPayInitializeRequest(BaseModel):
    amount: float
    currency: str = "XAF"
    email: str
    phone: Optional[str] = None
    description: Optional[str] = "Paiement KamStore"
    reference: Optional[str] = None
    callback_url: Optional[str] = None

class CampayCollectRequest(BaseModel):
    amount: float
    from_phone: str = Field(..., alias="from", description="Phone number 237xxxxxxxxx")
    description: str = "KamStore Payment"
    external_reference: Optional[str] = None

    model_config = ConfigDict(populate_by_name=True)

class PaymentVerificationResponse(BaseModel):
    transaction_ref: str
    status: PaymentStatus
    provider: PaymentProvider
    amount: float
    currency: str
    provider_ref: Optional[str] = None
    paid_at: Optional[datetime] = None
    raw_response: Optional[Dict[str, Any]] = None

class NotchPayWebhookPayload(BaseModel):
    event: str
    data: Dict[str, Any]

class CampayWebhookPayload(BaseModel):
    reference: str
    status: str
    amount: float
    currency: str
    operator: Optional[str] = None
    code: Optional[str] = None
    operator_reference: Optional[str] = None
    external_reference: Optional[str] = None
