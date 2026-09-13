from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Any, List
from uuid import UUID
from datetime import datetime

from app.api import deps
from app.services import geolocation_service, notification_service
from app.models.user import User
from app.schemas.device import (
    DeviceCreate, DeviceResponse, DeviceLocationUpdate, 
    DeviceLocationResponse, GeofenceCreate, GeofenceResponse
)

router = APIRouter()

@router.post("/devices", response_model=DeviceResponse)
async def register_device(
    device_in: DeviceCreate,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    return await geolocation_service.register_device(current_user.id, device_in, db)

@router.get("/devices", response_model=List[DeviceResponse])
async def list_user_devices(
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    return await geolocation_service.get_user_devices(current_user.id, db)

@router.put("/devices/{id}/location", response_model=DeviceLocationResponse)
async def update_location(
    id: UUID,
    location_in: DeviceLocationUpdate,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    # Verify device belongs to user
    devices = await geolocation_service.get_user_devices(current_user.id, db)
    if id not in [d.id for d in devices]:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    loc = await geolocation_service.update_device_location(
        id, location_in.latitude, location_in.longitude, db, location_in.altitude, location_in.accuracy
    )
    
    # Check geofences
    breached = await geolocation_service.check_geofence_breach(id, location_in.latitude, location_in.longitude, db)
    device = next(d for d in devices if d.id == id)
    for gf in breached:
        await notification_service.send_geofence_alert(device, gf, db)
        
    return loc

@router.get("/devices/{id}/location", response_model=DeviceLocationResponse)
async def get_location(
    id: UUID,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    devices = await geolocation_service.get_user_devices(current_user.id, db)
    if id not in [d.id for d in devices]:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    loc = await geolocation_service.get_device_location(id, db)
    if not loc:
        raise HTTPException(status_code=404, detail="Location not found")
    return loc

@router.get("/devices/{id}/history", response_model=List[DeviceLocationResponse])
async def get_history(
    id: UUID,
    start_date: datetime,
    end_date: datetime,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    devices = await geolocation_service.get_user_devices(current_user.id, db)
    if id not in [d.id for d in devices]:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    return await geolocation_service.get_location_history(id, start_date, end_date, db)

@router.post("/devices/{id}/geofences", response_model=GeofenceResponse)
async def create_geofence(
    id: UUID,
    geofence_in: GeofenceCreate,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    devices = await geolocation_service.get_user_devices(current_user.id, db)
    if id not in [d.id for d in devices]:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    return await geolocation_service.create_geofence(
        id, geofence_in.center_latitude, geofence_in.center_longitude, geofence_in.radius_meters, geofence_in.name, db
    )

@router.post("/devices/{id}/check-geofence")
async def check_geofence(
    id: UUID,
    lat: float,
    lng: float,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    devices = await geolocation_service.get_user_devices(current_user.id, db)
    if id not in [d.id for d in devices]:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    breached = await geolocation_service.check_geofence_breach(id, lat, lng, db)
    return {"breached": [{"id": gf.id, "name": gf.name} for gf in breached]}
