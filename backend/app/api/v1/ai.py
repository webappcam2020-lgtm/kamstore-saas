from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.api import deps
from app.models.user import User
from app.models.listing import Listing
from app.schemas.lead import (
    LeadExtractionRequest,
    LeadExtractionResponse,
    LeadBase
)
from app.schemas.ai import (
    ChatbotRequest,
    ChatbotResponse,
    MatchRequest,
    MatchResponse
)
from app.ai.lead_extractor import lead_extractor
from app.ai.chatbot import ai_chatbot
from app.ai.recommender import ai_recommender

router = APIRouter()

@router.post("/extract-leads", response_model=LeadExtractionResponse)
async def extract_leads(
    req: LeadExtractionRequest,
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Extract structured leads (contacts, phone numbers, emails, addresses, categories)
    from unstructured text using OpenAI API, LangChain, HuggingFace, or Cameroon NLP.
    """
    return await lead_extractor.extract_leads(
        text=req.text,
        source_url=req.source_url,
        category_hint=req.category_hint,
        engine=req.use_ai_model or "auto"
    )

@router.post("/chatbot/message", response_model=ChatbotResponse)
async def chatbot_message(
    req: ChatbotRequest
) -> Any:
    """
    Interactive AI chatbot for user guidance on tourism, housing,
    lead extraction, scraping, and mobile money payments.
    """
    return await ai_chatbot.get_response(
        message=req.message,
        history=req.history,
        context_type=req.context_type or "general"
    )

@router.post("/match", response_model=MatchResponse)
async def match_recommendations(
    req: MatchRequest,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    AI-driven matching of tourism and housing listings based on user budget,
    city preferences, and activity tags.
    """
    stmt = select(Listing).limit(50)
    res = await db.execute(stmt)
    db_listings = res.scalars().all()

    items = [
        {
            "id": str(l.id),
            "title": l.title,
            "description": l.description,
            "price": l.price_per_night,
            "category": l.category.value if hasattr(l.category, "value") else str(l.category),
            "city": l.city,
            "images": [img.image_url for img in l.images] if l.images else []
        }
        for l in db_listings
    ]

    matched = ai_recommender.match_listings(
        listings=items,
        city=req.city,
        category=req.category,
        budget_min=req.budget_min,
        budget_max=req.budget_max,
        preferences=req.preferences
    )

    return MatchResponse(
        matches=matched[:10],
        total_matched=len(matched),
        recommendation_rationale=f"Classé intelligemment selon vos critères pour {req.city or 'le Cameroun'}."
    )
