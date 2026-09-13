import pytest
from app.core.security import get_password_hash, verify_password, create_access_token, TokenPayload
from jose import jwt
from app.core.config import settings

def test_password_hashing():
    pwd = "KamStorePassword2024!"
    hashed = get_password_hash(pwd)
    assert hashed != pwd
    assert verify_password(pwd, hashed) is True
    assert verify_password("WrongPassword", hashed) is False

def test_jwt_token_generation():
    subject = "123e4567-e89b-12d3-a456-426614174000"
    token = create_access_token(subject=subject)
    assert isinstance(token, str)
    
    payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
    assert payload["sub"] == subject
    assert payload["type"] == "access"
