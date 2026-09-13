from typing import List, Optional
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import math

from app.models.device import Device, DeviceLocation, Geofence
from app.schemas.device import DeviceCreate

async def register_device(user_id: UUID, device_data: DeviceCreate, db: AsyncSession) -> Device:
    device = Device(
        user_id=user_id,
        name=device_data.name,
        device_type=device_data.device_type
    )
    db.add(device)
    await db.commit()
    await db.refresh(device)
    return device

async def update_device_location(device_id: UUID, latitude: float, longitude: float, db: AsyncSession, altitude: Optional[float] = None, accuracy: Optional[float] = None) -> DeviceLocation:
    location = DeviceLocation(
        device_id=device_id,
        latitude=latitude,
        longitude=longitude,
        altitude=altitude,
        accuracy=accuracy
    )
    db.add(location)
    await db.commit()
    await db.refresh(location)
    return location

async def get_device_location(device_id: UUID, db: AsyncSession) -> Optional[DeviceLocation]:
    query = select(DeviceLocation).where(DeviceLocation.device_id == device_id).order_by(DeviceLocation.recorded_at.desc()).limit(1)
    result = await db.execute(query)
    return result.scalars().first()

async def get_user_devices(user_id: UUID, db: AsyncSession) -> List[Device]:
    query = select(Device).where(Device.user_id == user_id)
    result = await db.execute(query)
    return list(result.scalars().all())

async def create_geofence(device_id: UUID, center_lat: float, center_lng: float, radius_meters: float, name: str, db: AsyncSession) -> Geofence:
    geofence = Geofence(
        device_id=device_id,
        name=name,
        center_latitude=center_lat,
        center_longitude=center_lng,
        radius_meters=radius_meters
    )
    db.add(geofence)
    await db.commit()
    await db.refresh(geofence)
    return geofence

def haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371000  # radius of Earth in meters
    phi_1 = math.radians(lat1)
    phi_2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)
    a = math.sin(delta_phi / 2.0)**2 + math.cos(phi_1) * math.cos(phi_2) * math.sin(delta_lambda / 2.0)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

async def check_geofence_breach(device_id: UUID, lat: float, lng: float, db: AsyncSession) -> List[Geofence]:
    query = select(Geofence).where(Geofence.device_id == device_id, Geofence.is_active == True)
    result = await db.execute(query)
    geofences = result.scalars().all()
    
    breached = []
    for gf in geofences:
        dist = haversine(lat, lng, gf.center_latitude, gf.center_longitude)
        if dist > gf.radius_meters:
            breached.append(gf)
            
    return breached

async def get_location_history(device_id: UUID, start_date, end_date, db: AsyncSession) -> List[DeviceLocation]:
    query = select(DeviceLocation).where(
        DeviceLocation.device_id == device_id,
        DeviceLocation.recorded_at >= start_date,
        DeviceLocation.recorded_at <= end_date
    ).order_by(DeviceLocation.recorded_at.desc())
    result = await db.execute(query)
    return list(result.scalars().all())
