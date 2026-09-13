import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, Float, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship

from app.core.database import Base

class Lead(Base):
    __tablename__ = "leads"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True)
    job_id = Column(UUID(as_uuid=True), ForeignKey("scraping_jobs.id", ondelete="SET NULL"), nullable=True, index=True)
    
    company_name = Column(String, nullable=False, index=True)
    contact_person = Column(String, nullable=True)
    email = Column(String, nullable=True, index=True)
    phone = Column(String, nullable=True, index=True)
    category = Column(String, nullable=True, index=True)  # e.g., Hotel, Tourism, Real Estate, Retail
    
    address = Column(String, nullable=True)
    city = Column(String, nullable=True, index=True)      # e.g., Douala, Yaoundé, Kribi
    country = Column(String, default="Cameroun")
    
    source_url = Column(String, nullable=True)
    confidence_score = Column(Float, default=0.85)
    
    raw_text = Column(Text, nullable=True)
    ai_summary = Column(Text, nullable=True)
    sentiment = Column(String, nullable=True)             # positive, neutral, negative
    metadata_ = Column("metadata", JSONB, nullable=True)   # social handles, opening hours, etc.
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    user = relationship("User", backref="leads")
    scraping_job = relationship("ScrapingJob", back_populates="leads")
