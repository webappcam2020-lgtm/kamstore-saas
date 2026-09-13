from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Any, List, Optional
from uuid import UUID
from datetime import datetime

from app.api import deps
from app.services import booking_service, notification_service
from app.models.user import User
from app.schemas.booking import BookingCreate, BookingUpdate, BookingResponse
from app.models.booking import BookingStatus
from app.services.tourism_service import get_listing_by_id

router = APIRouter()

@router.post("", response_model=BookingResponse)
async def create_booking(
    booking_in: BookingCreate,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    return await booking_service.create_booking(current_user.id, booking_in, db)

@router.get("", response_model=List[BookingResponse])
async def get_user_bookings(
    status: Optional[BookingStatus] = None,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    return await booking_service.get_user_bookings(current_user.id, status, db)

@router.get("/check-availability")
async def check_availability(
    listing_id: UUID,
    check_in: datetime,
    check_out: datetime,
    db: AsyncSession = Depends(deps.get_db)
) -> Any:
    is_available = await booking_service.check_availability(listing_id, check_in, check_out, db)
    return {"available": is_available}

@router.get("/{id}", response_model=BookingResponse)
async def get_booking(
    id: UUID,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    booking = await booking_service.get_booking(id, db)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
        
    listing = await get_listing_by_id(booking.listing_id, db)
    if booking.user_id != current_user.id and listing.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    return booking

@router.put("/{id}/status", response_model=BookingResponse)
async def update_status(
    id: UUID,
    status: BookingStatus,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    booking = await booking_service.update_booking_status(id, status, current_user.id, db)
    
    if status == BookingStatus.confirmed:
        await notification_service.send_booking_confirmation(booking, booking.user, db)
    elif status == BookingStatus.cancelled:
        await notification_service.send_booking_cancellation(booking, booking.user, db)
        
    return booking

@router.get("/listing/{listing_id}", response_model=List[BookingResponse])
async def get_listing_bookings(
    listing_id: UUID,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    listing = await get_listing_by_id(listing_id, db)
    if not listing or listing.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    return await booking_service.get_listing_bookings(listing_id, current_user.id, db)
