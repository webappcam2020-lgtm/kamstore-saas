from typing import List, Optional
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.models.listing import Listing, ListingType
from app.models.notification import ContactRequest
from app.schemas.listing import ListingCreate, ListingUpdate, ListingFilter

async def create_housing_listing(owner_id: UUID, data: ListingCreate, db: AsyncSession) -> Listing:
    data.listing_type = ListingType.housing
    listing = Listing(
        owner_id=owner_id,
        title=data.title,
        description=data.description,
        category=data.category,
        listing_type=data.listing_type,
        price=data.price,
        currency=data.currency,
        latitude=data.latitude,
        longitude=data.longitude,
        address=data.address,
        city=data.city,
        region=data.region,
        amenities=data.amenities,
        max_guests=data.max_guests
    )
    db.add(listing)
    await db.commit()
    await db.refresh(listing)
    return listing

async def get_housing_listings(filters: ListingFilter, db: AsyncSession) -> List[Listing]:
    query = select(Listing).where(Listing.listing_type == ListingType.housing).options(selectinload(Listing.images))
    
    if filters.city:
        query = query.where(Listing.city.ilike(f"%{filters.city}%"))
    if filters.min_price is not None:
        query = query.where(Listing.price >= filters.min_price)
    if filters.max_price is not None:
        query = query.where(Listing.price <= filters.max_price)
        
    result = await db.execute(query)
    return list(result.scalars().all())

async def get_housing_by_id(listing_id: UUID, db: AsyncSession) -> Optional[Listing]:
    query = select(Listing).where(Listing.id == listing_id, Listing.listing_type == ListingType.housing).options(selectinload(Listing.images))
    result = await db.execute(query)
    return result.scalars().first()

async def update_housing(listing_id: UUID, owner_id: UUID, data: ListingUpdate, db: AsyncSession) -> Optional[Listing]:
    listing = await get_housing_by_id(listing_id, db)
    if not listing or listing.owner_id != owner_id:
        return None
        
    update_data = data.model_dump(exclude_unset=True)
    for k, v in update_data.items():
        setattr(listing, k, v)
        
    await db.commit()
    await db.refresh(listing)
    return listing

async def contact_owner(user_id: UUID, listing_id: UUID, message: str, db: AsyncSession) -> ContactRequest:
    req = ContactRequest(
        sender_id=user_id,
        listing_id=listing_id,
        message=message
    )
    db.add(req)
    await db.commit()
    await db.refresh(req)
    return req

async def get_contact_requests(owner_id: UUID, db: AsyncSession) -> List[ContactRequest]:
    query = select(ContactRequest).join(Listing).where(Listing.owner_id == owner_id)
    result = await db.execute(query)
    return list(result.scalars().all())
