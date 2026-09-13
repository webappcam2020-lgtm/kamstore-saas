import logging
from typing import Dict, Any
from app.core.celery_app import celery_app
from app.services.email_service import email_service

logger = logging.getLogger(__name__)

@celery_app.task(name="app.tasks.email_tasks.send_async_email_receipt")
def send_async_email_receipt(recipient_email: str, payment_data: Dict[str, Any]):
    """Async task to dispatch payment receipt email."""
    logger.info(f"Dispatching async payment receipt email to {recipient_email}")
    return email_service.send_payment_receipt(recipient_email, payment_data)

@celery_app.task(name="app.tasks.email_tasks.send_async_booking_confirmation")
def send_async_booking_confirmation(recipient_email: str, booking_data: Dict[str, Any]):
    """Async task to dispatch booking confirmation email."""
    logger.info(f"Dispatching async booking confirmation email to {recipient_email}")
    return email_service.send_booking_confirmation(recipient_email, booking_data)
