from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import Any, List
from uuid import UUID

from app.api import deps
from app.models.user import User
from app.models.notification import Notification
from app.schemas.notification import NotificationResponse

router = APIRouter()

@router.get("", response_model=List[NotificationResponse])
async def get_notifications(
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    query = select(Notification).where(Notification.user_id == current_user.id).order_by(Notification.created_at.desc())
    result = await db.execute(query)
    return list(result.scalars().all())

@router.put("/{id}/read", response_model=NotificationResponse)
async def mark_as_read(
    id: UUID,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    query = select(Notification).where(Notification.id == id, Notification.user_id == current_user.id)
    result = await db.execute(query)
    notif = result.scalars().first()
    
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
        
    notif.is_read = True
    await db.commit()
    await db.refresh(notif)
    return notif

@router.put("/read-all")
async def mark_all_as_read(
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    query = select(Notification).where(Notification.user_id == current_user.id, Notification.is_read == False)
    result = await db.execute(query)
    notifs = result.scalars().all()
    
    for notif in notifs:
        notif.is_read = True
        
    await db.commit()
    return {"status": "success", "updated": len(notifs)}
