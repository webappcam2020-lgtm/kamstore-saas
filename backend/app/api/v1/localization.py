from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import Any, List

from app.api import deps
from app.services import localization_service
from app.models.user import User

router = APIRouter()

class PhoneLookupRequest(BaseModel):
    phone: str

class PhoneLookupResponse(BaseModel):
    valid: bool
    phone: str = None
    carrier: str = None
    country: str = None
    region: str = None
    location_type: str = None
    error: str = None
    api_location: Any = None

@router.post("/lookup", response_model=PhoneLookupResponse)
async def lookup_phone(
    request: PhoneLookupRequest,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    local_info = localization_service.lookup_phone_number(request.phone)
    if not local_info.get("valid"):
        return PhoneLookupResponse(**local_info)
        
    api_location = await localization_service.get_phone_location(local_info["phone"])
    
    result = {**local_info, "api_location": api_location}
    await localization_service.save_lookup_history(current_user.id, request.phone, result, db)
    
    return PhoneLookupResponse(**result)

@router.get("/history")
async def get_history(
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    return await localization_service.get_user_lookup_history(current_user.id, db)
