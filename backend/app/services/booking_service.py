from typing import List, Optional
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import or_, and_
from sqlalchemy.orm import selectinload
from datetime import datetime
from fastapi import HTTPException, status

from app.models.booking import Booking, BookingStatus
from app.models.listing import Listing
from app.schemas.booking import BookingCreate, BookingUpdate

async def check_availability(listing_id: UUID, check_in: datetime, check_out: datetime, db: AsyncSession) -> bool:
    query = select(Booking).where(
        Booking.listing_id == listing_id,
        Booking.status.in_([BookingStatus.confirmed, BookingStatus.completed]),
        or_(
            and_(Booking.check_in <= check_in, Booking.check_out > check_in),
            and_(Booking.check_in < check_out, Booking.check_out >= check_out),
            and_(Booking.check_in >= check_in, Booking.check_out <= check_out)
        )
    )
    result = await db.execute(query)
    conflicts = result.scalars().all()
    return len(conflicts) == 0

async def calculate_total_price(listing_id: UUID, check_in: datetime, check_out: datetime, guests: int, db: AsyncSession) -> float:
    query = select(Listing).where(Listing.id == listing_id)
    result = await db.execute(query)
    listing = result.scalars().first()
    
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
        
    days = (check_out - check_in).days
    if days < 1:
        days = 1
        
    return listing.price * days

async def create_booking(user_id: UUID, data: BookingCreate, db: AsyncSession) -> Booking:
    is_available = await check_availability(data.listing_id, data.check_in, data.check_out, db)
    if not is_available:
        raise HTTPException(status_code=400, detail="Listing is not available for these dates")
        
    listing_query = select(Listing).where(Listing.id == data.listing_id)
    result = await db.execute(listing_query)
    listing = result.scalars().first()
    
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
        
    if data.guests > (listing.max_guests or 1):
        raise HTTPException(status_code=400, detail="Too many guests")
        
    total_price = await calculate_total_price(data.listing_id, data.check_in, data.check_out, data.guests, db)
    
    booking = Booking(
        user_id=user_id,
        listing_id=data.listing_id,
        check_in=data.check_in,
        check_out=data.check_out,
        guests=data.guests,
        total_price=total_price,
        currency=listing.currency,
        notes=data.notes
    )
    
    db.add(booking)
    await db.commit()
    await db.refresh(booking)
    return booking

async def get_booking(booking_id: UUID, db: AsyncSession) -> Optional[Booking]:
    query = select(Booking).where(Booking.id == booking_id).options(selectinload(Booking.listing))
    result = await db.execute(query)
    return result.scalars().first()

async def get_user_bookings(user_id: UUID, status: Optional[BookingStatus], db: AsyncSession) -> List[Booking]:
    query = select(Booking).where(Booking.user_id == user_id).options(selectinload(Booking.listing))
    if status:
        query = query.where(Booking.status == status)
    result = await db.execute(query)
    return list(result.scalars().all())

async def get_listing_bookings(listing_id: UUID, owner_id: UUID, db: AsyncSession) -> List[Booking]:
    query = select(Booking).join(Listing).where(Booking.listing_id == listing_id, Listing.owner_id == owner_id)
    result = await db.execute(query)
    return list(result.scalars().all())

async def update_booking_status(booking_id: UUID, status: BookingStatus, user_id: UUID, db: AsyncSession) -> Booking:
    booking = await get_booking(booking_id, db)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
        
    # Check if user is owner of the listing or the user who booked
    query = select(Listing).where(Listing.id == booking.listing_id)
    result = await db.execute(query)
    listing = result.scalars().first()
    
    if booking.user_id != user_id and listing.owner_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this booking")
        
    booking.status = status
    await db.commit()
    await db.refresh(booking)
    return booking
