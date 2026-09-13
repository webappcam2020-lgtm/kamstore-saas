from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Any, List, Optional
from uuid import UUID

from app.api import deps
from app.services import housing_service, tourism_service
from app.models.user import User, UserRole
from app.schemas.listing import ListingCreate, ListingUpdate, ListingResponse, ListingFilter
from app.schemas.notification import ContactRequestCreate, ContactRequestResponse
from app.models.listing import ListingType

router = APIRouter()

@router.get("/listings", response_model=List[ListingResponse])
async def search_housing(
    city: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    db: AsyncSession = Depends(deps.get_db)
) -> Any:
    filters = ListingFilter(
        listing_type=ListingType.housing,
        city=city,
        min_price=min_price,
        max_price=max_price
    )
    return await housing_service.get_housing_listings(filters, db)

@router.get("/listings/{id}", response_model=ListingResponse)
async def get_housing(
    id: UUID,
    db: AsyncSession = Depends(deps.get_db)
) -> Any:
    listing = await housing_service.get_housing_by_id(id, db)
    if not listing:
        raise HTTPException(status_code=404, detail="Housing not found")
    return listing

@router.post("/listings", response_model=ListingResponse)
async def create_housing(
    listing_in: ListingCreate,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    if current_user.role not in [UserRole.admin, UserRole.host]:
        raise HTTPException(status_code=403, detail="Not authorized to create housing")
    return await housing_service.create_housing_listing(current_user.id, listing_in, db)

@router.put("/listings/{id}", response_model=ListingResponse)
async def update_housing(
    id: UUID,
    listing_in: ListingUpdate,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    listing = await housing_service.update_housing(id, current_user.id, listing_in, db)
    if not listing:
        raise HTTPException(status_code=404, detail="Housing not found or not authorized")
    return listing

@router.delete("/listings/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_housing(
    id: UUID,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    success = await tourism_service.delete_listing(id, current_user.id, db)
    if not success:
        raise HTTPException(status_code=404, detail="Housing not found or not authorized")

@router.post("/listings/{id}/contact", response_model=ContactRequestResponse)
async def contact_owner(
    id: UUID,
    contact_in: ContactRequestCreate,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    listing = await housing_service.get_housing_by_id(id, db)
    if not listing:
        raise HTTPException(status_code=404, detail="Housing not found")
    return await housing_service.contact_owner(current_user.id, id, contact_in.message, db)

@router.get("/contact-requests", response_model=List[ContactRequestResponse])
async def get_contact_requests(
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    if current_user.role not in [UserRole.admin, UserRole.host]:
        raise HTTPException(status_code=403, detail="Not authorized")
    return await housing_service.get_contact_requests(current_user.id, db)
