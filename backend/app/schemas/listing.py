from datetime import datetime
from typing import Optional, List, Dict, Any
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field

from app.models.listing import ListingCategory, ListingType

class ListingImageBase(BaseModel):
    url: str
    is_primary: bool = False
    display_order: int = 0

class ListingImageResponse(ListingImageBase):
    id: UUID
    listing_id: UUID

    model_config = ConfigDict(from_attributes=True)

class ListingBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: ListingCategory
    listing_type: ListingType
    price: float
    currency: str = "XAF"
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    address: Optional[str] = None
    city: Optional[str] = None
    region: Optional[str] = None
    amenities: Optional[Dict[str, Any]] = None
    max_guests: Optional[int] = None

class ListingCreate(ListingBase):
    pass

class ListingUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    currency: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    address: Optional[str] = None
    city: Optional[str] = None
    region: Optional[str] = None
    amenities: Optional[Dict[str, Any]] = None
    max_guests: Optional[int] = None
    is_active: Optional[bool] = None

class ListingResponse(ListingBase):
    id: UUID
    owner_id: UUID
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: datetime
    images: List[ListingImageResponse] = []

    model_config = ConfigDict(from_attributes=True)

class ListingFilter(BaseModel):
    category: Optional[ListingCategory] = None
    listing_type: Optional[ListingType] = None
    city: Optional[str] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    guests: Optional[int] = None
