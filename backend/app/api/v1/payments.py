from typing import Any, List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Request, Header, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.api import deps
from app.models.user import User
from app.models.payment import Payment
from app.schemas.payment import (
    PaymentCreate,
    PaymentResponse,
    PaymentVerificationResponse,
    NotchPayWebhookPayload,
    CampayWebhookPayload
)
from app.services.payment_service import payment_service
from app.tasks.email_tasks import send_async_email_receipt

router = APIRouter()

@router.post("/initialize", response_model=PaymentResponse)
async def initialize_payment(
    payment_in: PaymentCreate,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Initialize payment via Notch Pay API or Campay API.
    Supports MTN Mobile Money and Orange Money (Cameroon XAF).
    """
    payment = await payment_service.create_payment(
        db=db,
        user_id=current_user.id,
        payment_in=payment_in
    )
    return payment

@router.get("/verify/{reference}", response_model=PaymentVerificationResponse)
async def verify_payment(
    reference: str,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """Verify transaction status with Notch Pay or Campay gateway."""
    try:
        res = await payment_service.verify_payment(db, reference)
        
        # If successfully completed and user has email, trigger async receipt email
        if res.status.value == "completed" and current_user.email:
            try:
                send_async_email_receipt.delay(
                    current_user.email,
                    {
                        "transaction_ref": res.transaction_ref,
                        "amount": res.amount,
                        "currency": res.currency,
                        "provider": res.provider.value
                    }
                )
            except Exception:
                pass

        return res
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/history", response_model=List[PaymentResponse])
async def get_payment_history(
    skip: int = 0,
    limit: int = 20,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """Retrieve current user's payment transaction history."""
    stmt = (
        select(Payment)
        .where(Payment.user_id == current_user.id)
        .order_by(Payment.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    res = await db.execute(stmt)
    return res.scalars().all()

@router.get("/{id}", response_model=PaymentResponse)
async def get_payment(
    id: UUID,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """Get single payment details."""
    stmt = select(Payment).where(Payment.id == id)
    res = await db.execute(stmt)
    payment = res.scalar_one_or_none()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    if payment.user_id != current_user.id and current_user.role.value != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    return payment

@router.post("/webhook/notchpay")
async def notchpay_webhook(
    request: Request,
    db: AsyncSession = Depends(deps.get_db),
    x_notch_signature: Optional[str] = Header(None)
) -> Any:
    """Handle Notch Pay webhook notifications for MTN MoMo and Orange Money."""
    body = await request.body()
    if x_notch_signature:
        if not payment_service.verify_notchpay_signature(body, x_notch_signature):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid signature")

    payload = await request.json()
    success = await payment_service.process_notchpay_webhook(db, payload)
    return {"status": "ok", "processed": success}

@router.post("/webhook/campay")
async def campay_webhook(
    request: Request,
    db: AsyncSession = Depends(deps.get_db)
) -> Any:
    """Handle Campay webhook notifications for direct Mobile Money transactions."""
    payload = await request.json()
    success = await payment_service.process_campay_webhook(db, payload)
    return {"status": "ok", "processed": success}
