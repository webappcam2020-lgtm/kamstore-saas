from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field

class ChatMessage(BaseModel):
    role: str = Field(..., description="'user', 'assistant', or 'system'")
    content: str

class ChatbotRequest(BaseModel):
    message: str = Field(..., min_length=1)
    history: Optional[List[ChatMessage]] = Field(default_factory=list)
    context_type: Optional[str] = Field("general", description="'general', 'tourism', 'housing', 'leads'")

class ChatbotResponse(BaseModel):
    reply: str
    suggestions: List[str] = Field(default_factory=list)
    confidence: float = 0.95
    model_used: str

class MatchRequest(BaseModel):
    city: Optional[str] = None
    category: Optional[str] = None
    budget_min: Optional[float] = None
    budget_max: Optional[float] = None
    preferences: Optional[List[str]] = Field(default_factory=list)

class MatchResponse(BaseModel):
    matches: List[Dict[str, Any]]
    total_matched: int
    recommendation_rationale: str
