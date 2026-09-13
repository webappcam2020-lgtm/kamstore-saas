from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Any, List, Optional
from uuid import UUID

from app.api import deps
from app.services import tourism_service
from app.models.user import User, UserRole
from app.schemas.listing import ListingCreate, ListingUpdate, ListingResponse, ListingFilter, ListingImageResponse
from app.schemas.review import ReviewCreate, ReviewResponse
from app.models.listing import ListingType
from app.models.review import Review

router = APIRouter()

@router.get("/listings", response_model=List[ListingResponse])
async def search_listings(
    category: Optional[str] = None,
    city: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    guests: Optional[int] = None,
    db: AsyncSession = Depends(deps.get_db)
) -> Any:
    filters = ListingFilter(
        category=category,
        listing_type=ListingType.tourism,
        city=city,
        min_price=min_price,
        max_price=max_price,
        guests=guests
    )
    return await tourism_service.get_listings(filters, db)

@router.get("/listings/{id}", response_model=ListingResponse)
async def get_listing(
    id: UUID,
    db: AsyncSession = Depends(deps.get_db)
) -> Any:
    listing = await tourism_service.get_listing_by_id(id, db)
    if not listing or listing.listing_type != ListingType.tourism:
        raise HTTPException(status_code=404, detail="Listing not found")
    return listing

@router.post("/listings", response_model=ListingResponse)
async def create_listing(
    listing_in: ListingCreate,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    if current_user.role not in [UserRole.admin, UserRole.host]:
        raise HTTPException(status_code=403, detail="Not authorized to create listings")
    listing_in.listing_type = ListingType.tourism
    return await tourism_service.create_listing(current_user.id, listing_in, db)

@router.put("/listings/{id}", response_model=ListingResponse)
async def update_listing(
    id: UUID,
    listing_in: ListingUpdate,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    listing = await tourism_service.update_listing(id, current_user.id, listing_in, db)
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found or not authorized")
    return listing

@router.delete("/listings/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_listing(
    id: UUID,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    success = await tourism_service.delete_listing(id, current_user.id, db)
    if not success:
        raise HTTPException(status_code=404, detail="Listing not found or not authorized")

@router.get("/featured", response_model=List[ListingResponse])
async def get_featured(
    db: AsyncSession = Depends(deps.get_db)
) -> Any:
    return await tourism_service.get_featured_listings(db)

@router.get("/nearby", response_model=List[ListingResponse])
async def get_nearby(
    lat: float,
    lng: float,
    radius_km: float = 10.0,
    category: Optional[str] = None,
    db: AsyncSession = Depends(deps.get_db)
) -> Any:
    return await tourism_service.search_nearby(lat, lng, radius_km, category, db)

@router.post("/listings/{id}/images", response_model=ListingImageResponse)
async def add_image(
    id: UUID,
    url: str,
    is_primary: bool = False,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    listing = await tourism_service.get_listing_by_id(id, db)
    if not listing or listing.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Listing not found or not authorized")
    return await tourism_service.add_listing_image(id, url, is_primary, db)

@router.post("/listings/{id}/reviews", response_model=ReviewResponse)
async def add_review(
    id: UUID,
    review_in: ReviewCreate,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    listing = await tourism_service.get_listing_by_id(id, db)
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
        
    review = Review(
        user_id=current_user.id,
        listing_id=id,
        rating=review_in.rating,
        comment=review_in.comment
    )
    db.add(review)
    await db.commit()
    await db.refresh(review)
    return review

@router.get("/listings/{id}/reviews", response_model=List[ReviewResponse])
async def get_reviews(
    id: UUID,
    db: AsyncSession = Depends(deps.get_db)
) -> Any:
    listing = await tourism_service.get_listing_by_id(id, db)
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    return listing.reviews
