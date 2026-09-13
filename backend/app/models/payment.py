import enum
import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, Enum, Float, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship

from app.core.database import Base

class PaymentProvider(str, enum.Enum):
    notch_pay = "notch_pay"
    campay = "campay"
    mtn_momo = "mtn_momo"
    orange_money = "orange_money"
    card = "card"

class PaymentStatus(str, enum.Enum):
    pending = "pending"
    processing = "processing"
    completed = "completed"
    failed = "failed"
    cancelled = "cancelled"
    refunded = "refunded"

class Payment(Base):
    __tablename__ = "payments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    booking_id = Column(UUID(as_uuid=True), ForeignKey("bookings.id", ondelete="SET NULL"), nullable=True)
    
    amount = Column(Float, nullable=False)
    currency = Column(String, default="XAF")
    provider = Column(Enum(PaymentProvider), nullable=False, default=PaymentProvider.notch_pay)
    status = Column(Enum(PaymentStatus), default=PaymentStatus.pending, nullable=False)
    
    transaction_ref = Column(String, unique=True, index=True, nullable=False)
    provider_ref = Column(String, nullable=True, index=True)
    checkout_url = Column(String, nullable=True)
    
    customer_phone = Column(String, nullable=True)
    customer_email = Column(String, nullable=True)
    description = Column(String, nullable=True)
    
    metadata_ = Column("metadata", JSONB, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    user = relationship("User", back_populates="payments")
    booking = relationship("Booking", back_populates="payment")
