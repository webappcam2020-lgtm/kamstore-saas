from datetime import datetime
from typing import Optional, Dict, Any, List
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field

class LeadBase(BaseModel):
    company_name: str
    contact_person: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    category: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = "Douala"
    country: Optional[str] = "Cameroun"
    source_url: Optional[str] = None
    confidence_score: float = Field(default=0.85, ge=0.0, le=1.0)
    ai_summary: Optional[str] = None
    sentiment: Optional[str] = "neutral"
    metadata_: Optional[Dict[str, Any]] = None

class LeadCreate(LeadBase):
    raw_text: Optional[str] = None
    job_id: Optional[UUID] = None

class LeadResponse(LeadBase):
    id: UUID
    user_id: Optional[UUID] = None
    job_id: Optional[UUID] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class LeadExtractionRequest(BaseModel):
    text: str = Field(..., min_length=5, description="Raw unstructured text or HTML content to extract leads from")
    source_url: Optional[str] = None
    category_hint: Optional[str] = None
    use_ai_model: Optional[str] = Field("auto", description="Model: auto, openai, langchain, huggingface, local_nlp")

class LeadExtractionResponse(BaseModel):
    leads_count: int
    leads: List[LeadBase]
    engine_used: str
    processing_time_ms: float
    summary: Optional[str] = None
