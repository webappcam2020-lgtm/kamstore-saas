import pytest
from app.services.payment_service import payment_service
from app.models.payment import PaymentProvider, PaymentStatus
from app.schemas.payment import PaymentCreate

def test_notchpay_signature_verification():
    # If no secret configured, allows dev mode
    assert payment_service.verify_notchpay_signature(b'{"test": 1}', "sig") is True

    # With key configured
    payment_service.notch_hash = "my_super_hash_key_123"
    import hmac, hashlib
    payload = b'{"amount": 5000}'
    expected = hmac.new(b"my_super_hash_key_123", payload, hashlib.sha256).hexdigest()
    assert payment_service.verify_notchpay_signature(payload, expected) is True
    assert payment_service.verify_notchpay_signature(payload, "invalid_sig") is False
    payment_service.notch_hash = ""  # Reset
