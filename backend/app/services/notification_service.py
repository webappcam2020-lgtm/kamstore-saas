from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models.notification import Notification, NotificationType
from app.models.booking import Booking
from app.models.user import User
from app.models.device import Device, Geofence
from app.models.listing import Listing

async def send_booking_confirmation(booking: Booking, user: User, db: AsyncSession) -> Notification:
    notif = Notification(
        user_id=user.id,
        title="Booking Confirmed",
        message=f"Your booking for {booking.check_in.strftime('%Y-%m-%d')} is confirmed.",
        notification_type=NotificationType.booking
    )
    db.add(notif)
    await db.commit()
    await db.refresh(notif)
    return notif

async def send_booking_cancellation(booking: Booking, user: User, db: AsyncSession) -> Notification:
    notif = Notification(
        user_id=user.id,
        title="Booking Cancelled",
        message=f"Your booking for {booking.check_in.strftime('%Y-%m-%d')} has been cancelled.",
        notification_type=NotificationType.booking
    )
    db.add(notif)
    await db.commit()
    await db.refresh(notif)
    return notif

async def send_geofence_alert(device: Device, geofence: Geofence, db: AsyncSession) -> Notification:
    notif = Notification(
        user_id=device.user_id,
        title="Geofence Alert",
        message=f"Device {device.name} has breached geofence {geofence.name}.",
        notification_type=NotificationType.geofence
    )
    db.add(notif)
    await db.commit()
    await db.refresh(notif)
    return notif

async def send_contact_request_notification(owner: User, requester: User, listing: Listing, db: AsyncSession) -> Notification:
    notif = Notification(
        user_id=owner.id,
        title="New Contact Request",
        message=f"{requester.full_name or requester.email} has sent a contact request for {listing.title}.",
        notification_type=NotificationType.contact
    )
    db.add(notif)
    await db.commit()
    await db.refresh(notif)
    return notif
