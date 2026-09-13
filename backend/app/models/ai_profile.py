import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, DateTime, ForeignKey, Float
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector

from app.core.database import Base

class AIProfile(Base):
    __tablename__ = "ai_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    preferences = Column(JSONB, nullable=True)
    social_data = Column(JSONB, nullable=True)
    embedding = Column(Vector(1536), nullable=True)
    matching_score = Column(Float, nullable=True)
    interests = Column(JSONB, nullable=True)
    last_analyzed = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    user = relationship("User", back_populates="ai_profile")
