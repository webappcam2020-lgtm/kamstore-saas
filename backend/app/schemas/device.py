from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict

from app.models.device import DeviceType

class DeviceCreate(BaseModel):
    name: str
    device_type: DeviceType

class DeviceResponse(DeviceCreate):
    id: UUID
    user_id: UUID
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class DeviceLocationUpdate(BaseModel):
    latitude: float
    longitude: float
    altitude: Optional[float] = None
    accuracy: Optional[float] = None

class DeviceLocationResponse(DeviceLocationUpdate):
    id: UUID
    device_id: UUID
    recorded_at: datetime

    model_config = ConfigDict(from_attributes=True)

class GeofenceCreate(BaseModel):
    name: str
    center_latitude: float
    center_longitude: float
    radius_meters: float

class GeofenceResponse(GeofenceCreate):
    id: UUID
    device_id: UUID
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
