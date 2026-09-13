from datetime import datetime
from typing import Optional, Dict, Any, List
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field

from app.models.scraping_job import ScrapingEngine, ScrapingStatus
from app.schemas.lead import LeadResponse

class ProxyConfig(BaseModel):
    proxies: List[str] = Field(default_factory=list, description="List of proxy URLs e.g. http://ip:port")
    strategy: str = Field("round_robin", description="round_robin, random, health_weighted")
    timeout_seconds: int = 15
    max_retries: int = 3

class ScrapingJobCreate(BaseModel):
    target_url: str = Field(..., description="Target website or directory URL")
    keyword: Optional[str] = None
    engine: ScrapingEngine = ScrapingEngine.async_http
    enable_proxy_rotation: bool = True
    custom_proxies: Optional[List[str]] = None
    extract_leads_with_ai: bool = True
    ai_model: Optional[str] = "auto"
    max_pages: int = Field(default=3, ge=1, le=20)

class ScrapingJobResponse(BaseModel):
    id: UUID
    user_id: Optional[UUID] = None
    target_url: str
    keyword: Optional[str] = None
    engine: ScrapingEngine
    proxy_rotation_enabled: bool
    proxy_used: Optional[str] = None
    status: ScrapingStatus
    leads_extracted: int
    error_message: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None
    leads: Optional[List[LeadResponse]] = None

    model_config = ConfigDict(from_attributes=True)

class ProxyStatusResponse(BaseModel):
    active_proxies_count: int
    proxies: List[Dict[str, Any]]
    rotation_strategy: str
    last_health_check: Optional[str] = None
