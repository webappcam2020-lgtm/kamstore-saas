import httpx
from typing import Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from uuid import UUID

from app.models.notification import PhoneLookupHistory
from app.core.config import settings

def lookup_phone_number(phone: str) -> Dict[str, Any]:
    """Validate Cameroon format (+237) and identify carrier."""
    # Strip spaces and plus
    clean_phone = phone.replace(" ", "").replace("+", "")
    
    if not clean_phone.startswith("237") or len(clean_phone) != 12:
        return {"valid": False, "reason": "Invalid Cameroon format"}
        
    prefix = clean_phone[3:6]
    carrier = "Unknown"
    region = "Unknown"
    
    # MTN (650-659, 670-679, 680-681)
    if (650 <= int(prefix) <= 659 and int(prefix) != 655) or (670 <= int(prefix) <= 679) or prefix in ["680", "681"]:
        carrier = "MTN Cameroon"
    # Orange (655-659, 690-699)
    elif (655 <= int(prefix) <= 659) or (690 <= int(prefix) <= 699):
        carrier = "Orange Cameroun"
    # Nexttel (660-669)
    elif 660 <= int(prefix) <= 669:
        carrier = "Nexttel"
    # Camtel (622-623, 233-234)
    elif prefix in ["622", "623", "233", "234"]:
        carrier = "Camtel"
        
    return {
        "valid": True,
        "phone": f"+{clean_phone}",
        "carrier": carrier,
        "country": "Cameroon",
        "region": region,
        "location_type": "Mobile" if prefix.startswith("6") else "Fixed"
    }

async def get_phone_location(phone: str) -> Dict[str, Any]:
    """Call NumVerify API to get location data."""
    if not settings.numverify_api_key:
        return {"error": "API key not configured"}
        
    clean_phone = phone.replace("+", "")
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"http://apilayer.net/api/validate?access_key={settings.numverify_api_key}&number={clean_phone}"
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            return {"error": str(e)}

async def save_lookup_history(user_id: UUID, phone: str, result: Dict[str, Any], db: AsyncSession) -> PhoneLookupHistory:
    history = PhoneLookupHistory(
        user_id=user_id,
        phone=phone,
        result=result
    )
    db.add(history)
    await db.commit()
    await db.refresh(history)
    return history

async def get_user_lookup_history(user_id: UUID, db: AsyncSession) -> List[PhoneLookupHistory]:
    query = select(PhoneLookupHistory).where(PhoneLookupHistory.user_id == user_id).order_by(PhoneLookupHistory.created_at.desc())
    result = await db.execute(query)
    return list(result.scalars().all())
