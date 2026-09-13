import enum
import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, Enum, Integer, ForeignKey, Text, Boolean
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship

from app.core.database import Base

class ScrapingEngine(str, enum.Enum):
    scrapy = "scrapy"
    playwright = "playwright"
    puppeteer = "puppeteer"
    async_http = "async_http"

class ScrapingStatus(str, enum.Enum):
    pending = "pending"
    running = "running"
    completed = "completed"
    failed = "failed"

class ScrapingJob(Base):
    __tablename__ = "scraping_jobs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True)
    
    target_url = Column(String, nullable=False)
    keyword = Column(String, nullable=True)
    engine = Column(Enum(ScrapingEngine), default=ScrapingEngine.async_http, nullable=False)
    
    proxy_rotation_enabled = Column(Boolean, default=True)
    proxy_used = Column(String, nullable=True)
    
    status = Column(Enum(ScrapingStatus), default=ScrapingStatus.pending, nullable=False)
    leads_extracted = Column(Integer, default=0)
    error_message = Column(Text, nullable=True)
    
    celery_task_id = Column(String, nullable=True, index=True)
    metadata_ = Column("metadata", JSONB, nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    completed_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    leads = relationship("Lead", back_populates="scraping_job", cascade="all, delete-orphan")
