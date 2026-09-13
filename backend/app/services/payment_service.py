import hmac
import hashlib
import uuid
import logging
from datetime import datetime, timezone
from typing import Dict, Any, Optional
import httpx
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.config import settings
from app.models.payment import Payment, PaymentProvider, PaymentStatus
from app.schemas.payment import PaymentCreate, PaymentVerificationResponse

logger = logging.getLogger(__name__)

class PaymentGatewayService:
    """
    Unified Payment Gateway integrating:
    1. Notch Pay API (Supports MTN MoMo, Orange Money, Credit Card)
    2. Campay API (Direct MTN Mobile Money & Orange Money Cameroun)
    Supports both live API credentials and automated Sandbox/Mock mode for testing.
    """

    def __init__(self):
        self.notch_pub = settings.notchpay_public_key
        self.notch_priv = settings.notchpay_private_key
        self.notch_hash = settings.notchpay_hash_key
        self.notch_url = settings.notchpay_base_url.rstrip("/")

        self.campay_user = settings.campay_username
        self.campay_pass = settings.campay_password
        self.campay_url = settings.campay_base_url.rstrip("/")
        self.campay_token: Optional[str] = None

    # =========================================================================
    # Unified Payment Creation
    # =========================================================================
    async def create_payment(
        self,
        db: AsyncSession,
        user_id: uuid.UUID,
        payment_in: PaymentCreate
    ) -> Payment:
        transaction_ref = f"KAM-{uuid.uuid4().hex[:12].upper()}"

        # Initialize Payment record in DB
        payment = Payment(
            user_id=user_id,
            booking_id=payment_in.booking_id,
            amount=payment_in.amount,
            currency=payment_in.currency,
            provider=payment_in.provider,
            status=PaymentStatus.pending,
            transaction_ref=transaction_ref,
            customer_phone=payment_in.customer_phone,
            customer_email=payment_in.customer_email,
            description=payment_in.description or "Paiement KamStore Services",
            metadata_={"channel": payment_in.channel or "mobile_money"}
        )

        db.add(payment)
        await db.commit()
        await db.refresh(payment)

        # Route to chosen gateway provider
        if payment_in.provider == PaymentProvider.campay:
            payment = await self._init_campay(db, payment)
        else:
            # Default to Notch Pay
            payment = await self._init_notchpay(db, payment)

        return payment

    # =========================================================================
    # Notch Pay Integration
    # =========================================================================
    async def _init_notchpay(self, db: AsyncSession, payment: Payment) -> Payment:
        """Initialize payment with Notch Pay API (https://api.notchpay.co)"""
        # If no Notch Pay API key configured, use Sandbox Simulator
        if not self.notch_pub and not self.notch_priv:
            logger.info("Notch Pay keys not provided, running in sandbox simulation mode.")
            payment.provider_ref = f"NP-SIM-{uuid.uuid4().hex[:8]}"
            payment.checkout_url = f"https://pay.notchpay.co/checkout/{payment.provider_ref}?ref={payment.transaction_ref}&amount={payment.amount}"
            payment.metadata_ = {
                **(payment.metadata_ or {}),
                "mode": "sandbox_simulator",
                "instructions": "Simulez le paiement ou testez le webhook via /api/v1/payments/webhook/notchpay"
            }
            await db.commit()
            return payment

        # Real Notch Pay API Call
        auth_key = self.notch_pub or self.notch_priv
        headers = {
            "Authorization": auth_key,
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
        payload = {
            "amount": int(payment.amount),
            "currency": payment.currency,
            "description": payment.description,
            "email": payment.customer_email or f"customer_{payment.id.hex[:6]}@kamstore.cm",
            "phone": payment.customer_phone,
            "reference": payment.transaction_ref,
            "callback": f"http://localhost:3000/payments/verify?reference={payment.transaction_ref}"
        }

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                res = await client.post(f"{self.notch_url}/payments/initialize", json=payload, headers=headers)
                data = res.json()
                if res.status_code in (200, 201) and data.get("status") in ("Accepted", "success"):
                    payment.provider_ref = data.get("transaction", {}).get("reference")
                    payment.checkout_url = data.get("authorization_url")
                    payment.status = PaymentStatus.processing
                    payment.metadata_ = {**(payment.metadata_ or {}), "notchpay_response": data}
                else:
                    payment.status = PaymentStatus.failed
                    payment.metadata_ = {**(payment.metadata_ or {}), "error": data}
        except Exception as e:
            logger.error(f"Error communicating with Notch Pay: {e}")
            payment.status = PaymentStatus.failed
            payment.metadata_ = {**(payment.metadata_ or {}), "error": str(e)}

        await db.commit()
        await db.refresh(payment)
        return payment

    # =========================================================================
    # Campay Integration (MTN MoMo & Orange Money)
    # =========================================================================
    async def _get_campay_token(self) -> Optional[str]:
        """Authenticate with Campay and retrieve token."""
        if not self.campay_user or not self.campay_pass:
            return None
        
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(
                    f"{self.campay_url}/token/",
                    json={"username": self.campay_user, "password": self.campay_pass}
                )
                if res.status_code == 200:
                    self.campay_token = res.json().get("token")
                    return self.campay_token
        except Exception as e:
            logger.error(f"Campay authentication error: {e}")
        return None

    async def _init_campay(self, db: AsyncSession, payment: Payment) -> Payment:
        """Collect payment via Campay API (https://campay.net)"""
        # Format phone for Campay (e.g. 237xxxxxxxxx)
        raw_phone = payment.customer_phone or "237670000000"
        clean_phone = "".join(filter(str.isdigit, raw_phone))
        if not clean_phone.startswith("237") and len(clean_phone) == 9:
            clean_phone = f"237{clean_phone}"

        # If Campay credentials not provided, run in Sandbox Simulator
        if not self.campay_user or not self.campay_pass:
            logger.info("Campay credentials not provided, running in sandbox simulation mode.")
            payment.provider_ref = f"CAMPAY-SIM-{uuid.uuid4().hex[:8]}"
            payment.checkout_url = f"https://demo.campay.net/pay/{payment.provider_ref}"
            payment.metadata_ = {
                **(payment.metadata_ or {}),
                "mode": "sandbox_simulator",
                "phone_targeted": clean_phone,
                "instructions": "Simulez l'USSD prompt MTN MoMo ou Orange Money sur votre téléphone"
            }
            await db.commit()
            return payment

        token = await self._get_campay_token()
        if not token:
            payment.status = PaymentStatus.failed
            payment.metadata_ = {**(payment.metadata_ or {}), "error": "Campay auth failed"}
            await db.commit()
            return payment

        headers = {
            "Authorization": f"Token {token}",
            "Content-Type": "application/json"
        }
        payload = {
            "amount": str(int(payment.amount)),
            "from": clean_phone,
            "description": payment.description,
            "external_reference": payment.transaction_ref
        }

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                res = await client.post(f"{self.campay_url}/collect/", json=payload, headers=headers)
                data = res.json()
                if res.status_code in (200, 201):
                    payment.provider_ref = data.get("reference")
                    payment.status = PaymentStatus.processing
                    payment.metadata_ = {
                        **(payment.metadata_ or {}),
                        "campay_response": data,
                        "operator": data.get("operator")
                    }
                else:
                    payment.status = PaymentStatus.failed
                    payment.metadata_ = {**(payment.metadata_ or {}), "error": data}
        except Exception as e:
            logger.error(f"Campay collect error: {e}")
            payment.status = PaymentStatus.failed
            payment.metadata_ = {**(payment.metadata_ or {}), "error": str(e)}

        await db.commit()
        await db.refresh(payment)
        return payment

    # =========================================================================
    # Payment Verification & Webhook Handling
    # =========================================================================
    async def verify_payment(self, db: AsyncSession, transaction_ref: str) -> PaymentVerificationResponse:
        """Verify the transaction status in DB and with provider."""
        stmt = select(Payment).where(Payment.transaction_ref == transaction_ref)
        res = await db.execute(stmt)
        payment = res.scalar_one_or_none()

        if not payment:
            raise ValueError("Payment transaction not found")

        # In Sandbox Simulator mode, auto-advance pending payments to completed on verification
        if payment.metadata_ and payment.metadata_.get("mode") == "sandbox_simulator":
            payment.status = PaymentStatus.completed
            payment.updated_at = datetime.now(timezone.utc)
            await db.commit()
            return PaymentVerificationResponse(
                transaction_ref=payment.transaction_ref,
                status=PaymentStatus.completed,
                provider=payment.provider,
                amount=payment.amount,
                currency=payment.currency,
                provider_ref=payment.provider_ref,
                paid_at=payment.updated_at,
                raw_response={"mode": "sandbox_simulator", "verified": True}
            )

        # Real verification with Notch Pay
        if payment.provider == PaymentProvider.notch_pay and payment.provider_ref:
            auth_key = self.notch_pub or self.notch_priv
            try:
                async with httpx.AsyncClient(timeout=10.0) as client:
                    r = await client.get(
                        f"{self.notch_url}/payments/{payment.provider_ref}",
                        headers={"Authorization": auth_key}
                    )
                    if r.status_code == 200:
                        data = r.json()
                        st = data.get("transaction", {}).get("status", "").lower()
                        if st in ("complete", "successful", "paid"):
                            payment.status = PaymentStatus.completed
                        elif st in ("failed", "rejected"):
                            payment.status = PaymentStatus.failed
                        await db.commit()
            except Exception as e:
                logger.error(f"Notch Pay verify error: {e}")

        # Real verification with Campay
        elif payment.provider == PaymentProvider.campay and payment.provider_ref:
            token = await self._get_campay_token()
            if token:
                try:
                    async with httpx.AsyncClient(timeout=10.0) as client:
                        r = await client.get(
                            f"{self.campay_url}/transaction/{payment.provider_ref}/",
                            headers={"Authorization": f"Token {token}"}
                        )
                        if r.status_code == 200:
                            data = r.json()
                            st = data.get("status", "").upper()
                            if st == "SUCCESSFUL":
                                payment.status = PaymentStatus.completed
                            elif st == "FAILED":
                                payment.status = PaymentStatus.failed
                            await db.commit()
                except Exception as e:
                    logger.error(f"Campay verify error: {e}")

        return PaymentVerificationResponse(
            transaction_ref=payment.transaction_ref,
            status=payment.status,
            provider=payment.provider,
            amount=payment.amount,
            currency=payment.currency,
            provider_ref=payment.provider_ref,
            paid_at=payment.updated_at,
            raw_response=payment.metadata_
        )

    def verify_notchpay_signature(self, payload_bytes: bytes, signature_header: str) -> bool:
        """Verify HMAC-SHA256 signature from Notch Pay webhook header."""
        if not self.notch_hash:
            return True  # Dev mode allows without secret
        expected = hmac.new(self.notch_hash.encode(), payload_bytes, hashlib.sha256).hexdigest()
        return hmac.compare_digest(expected, signature_header)

    async def process_notchpay_webhook(self, db: AsyncSession, payload: Dict[str, Any]) -> bool:
        """Process webhook from Notch Pay."""
        data = payload.get("data", {})
        reference = data.get("reference")
        event = payload.get("event")

        stmt = select(Payment).where(
            (Payment.transaction_ref == reference) | (Payment.provider_ref == reference)
        )
        res = await db.execute(stmt)
        payment = res.scalar_one_or_none()

        if not payment:
            return False

        if event in ("payment.complete", "payment.successful"):
            payment.status = PaymentStatus.completed
        elif event in ("payment.failed", "payment.canceled"):
            payment.status = PaymentStatus.failed

        payment.metadata_ = {**(payment.metadata_ or {}), "webhook_event": event, "webhook_data": data}
        payment.updated_at = datetime.now(timezone.utc)
        await db.commit()
        return True

    async def process_campay_webhook(self, db: AsyncSession, payload: Dict[str, Any]) -> bool:
        """Process webhook from Campay."""
        reference = payload.get("external_reference") or payload.get("reference")
        status_str = payload.get("status", "").upper()

        stmt = select(Payment).where(
            (Payment.transaction_ref == reference) | (Payment.provider_ref == reference)
        )
        res = await db.execute(stmt)
        payment = res.scalar_one_or_none()

        if not payment:
            return False

        if status_str == "SUCCESSFUL":
            payment.status = PaymentStatus.completed
        elif status_str == "FAILED":
            payment.status = PaymentStatus.failed

        payment.metadata_ = {**(payment.metadata_ or {}), "campay_webhook": payload}
        payment.updated_at = datetime.now(timezone.utc)
        await db.commit()
        return True

payment_service = PaymentGatewayService()
