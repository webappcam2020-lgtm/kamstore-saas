from typing import List, Optional
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import or_, and_, text
from sqlalchemy.orm import selectinload

from app.models.listing import Listing, ListingImage, ListingType
from app.models.review import Review
from app.schemas.listing import ListingCreate, ListingUpdate, ListingFilter
from app.services.geolocation_service import haversine

async def create_listing(owner_id: UUID, data: ListingCreate, db: AsyncSession) -> Listing:
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

async def get_listings(filters: ListingFilter, db: AsyncSession) -> List[Listing]:
    query = select(Listing).where(Listing.listing_type == ListingType.tourism).options(selectinload(Listing.images))
    
    if filters.category:
        query = query.where(Listing.category == filters.category)
    if filters.city:
        query = query.where(Listing.city.ilike(f"%{filters.city}%"))
    if filters.min_price is not None:
        query = query.where(Listing.price >= filters.min_price)
    if filters.max_price is not None:
        query = query.where(Listing.price <= filters.max_price)
    if filters.guests is not None:
        query = query.where(Listing.max_guests >= filters.guests)
        
    result = await db.execute(query)
    return list(result.scalars().all())

async def get_listing_by_id(listing_id: UUID, db: AsyncSession) -> Optional[Listing]:
    query = select(Listing).where(Listing.id == listing_id).options(selectinload(Listing.images), selectinload(Listing.reviews))
    result = await db.execute(query)
    return result.scalars().first()

async def update_listing(listing_id: UUID, owner_id: UUID, data: ListingUpdate, db: AsyncSession) -> Optional[Listing]:
    listing = await get_listing_by_id(listing_id, db)
    if not listing or listing.owner_id != owner_id:
        return None
        
    update_data = data.model_dump(exclude_unset=True)
    for k, v in update_data.items():
        setattr(listing, k, v)
        
    await db.commit()
    await db.refresh(listing)
    return listing

async def delete_listing(listing_id: UUID, owner_id: UUID, db: AsyncSession) -> bool:
    listing = await get_listing_by_id(listing_id, db)
    if not listing or listing.owner_id != owner_id:
        return False
        
    # Soft delete
    listing.is_active = False
    await db.commit()
    return True

async def get_featured_listings(db: AsyncSession) -> List[Listing]:
    # Placeholder for featured logic
    query = select(Listing).where(Listing.listing_type == ListingType.tourism, Listing.is_active == True, Listing.is_verified == True).limit(10).options(selectinload(Listing.images))
    result = await db.execute(query)
    return list(result.scalars().all())

async def search_nearby(lat: float, lng: float, radius_km: float, category: str, db: AsyncSession) -> List[Listing]:
    query = select(Listing).where(Listing.listing_type == ListingType.tourism, Listing.is_active == True).options(selectinload(Listing.images))
    if category:
        query = query.where(Listing.category == category)
        
    result = await db.execute(query)
    all_listings = result.scalars().all()
    
    nearby = []
    for l in all_listings:
        if l.latitude and l.longitude:
            dist = haversine(lat, lng, l.latitude, l.longitude) / 1000.0
            if dist <= radius_km:
                nearby.append(l)
                
    return nearby

async def add_listing_image(listing_id: UUID, image_url: str, is_primary: bool, db: AsyncSession) -> ListingImage:
    image = ListingImage(
        listing_id=listing_id,
        url=image_url,
        is_primary=is_primary
    )
    db.add(image)
    await db.commit()
    await db.refresh(image)
    return image
