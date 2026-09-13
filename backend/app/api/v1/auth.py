from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from jose import jwt
from pydantic import ValidationError
from uuid import UUID

from app.api import deps
from app.core.config import settings
from app.core.security import TokenPayload, create_access_token, create_refresh_token
from app.schemas.auth import RegisterRequest, TokenResponse, LoginRequest
from app.schemas.user import UserResponse
from app.services import auth_service, user_service

router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register(
    request: RegisterRequest,
    db: AsyncSession = Depends(deps.get_db)
) -> Any:
    return await auth_service.register_user(db, request)

@router.post("/login", response_model=TokenResponse)
async def login(
    db: AsyncSession = Depends(deps.get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    user = await auth_service.authenticate_user(
        db, LoginRequest(email=form_data.username, password=form_data.password)
    )
    return auth_service.create_tokens(user)

@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    refresh_token: str,
    db: AsyncSession = Depends(deps.get_db)
) -> Any:
    try:
        payload = jwt.decode(
            refresh_token, settings.secret_key, algorithms=[settings.algorithm]
        )
        token_data = TokenPayload(**payload)
        
        if token_data.type != "refresh":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid token type",
            )
            
    except (jwt.JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
        
    user_id = UUID(token_data.sub)
    user = await user_service.get_user_by_id(db, user_id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
        
    return auth_service.create_tokens(user)

@router.get("/me", response_model=UserResponse)
async def get_me(
    current_user = Depends(deps.get_current_active_user)
) -> Any:
    return current_user
