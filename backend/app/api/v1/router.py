from fastapi import APIRouter

from app.api.v1 import (
    auth,
    users,
    localization,
    geolocation,
    tourism,
    housing,
    bookings,
    notifications,
    payments,
    scraping,
    ai,
)

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(localization.router, prefix="/localization", tags=["localization"])
api_router.include_router(geolocation.router, prefix="/geolocation", tags=["geolocation"])
api_router.include_router(tourism.router, prefix="/tourism", tags=["tourism"])
api_router.include_router(housing.router, prefix="/housing", tags=["housing"])
api_router.include_router(bookings.router, prefix="/bookings", tags=["bookings"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["notifications"])
api_router.include_router(payments.router, prefix="/payments", tags=["payments"])
api_router.include_router(scraping.router, prefix="/scraping", tags=["scraping"])
api_router.include_router(ai.router, prefix="/ai", tags=["ai"])
