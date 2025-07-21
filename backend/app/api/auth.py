from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, User as UserSchema
from app.schemas.auth import Token
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.deps import get_current_active_user
from app.services.email import email_service
import secrets
from datetime import datetime, timedelta, timezone
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/register", response_model=UserSchema)
async def register(
    user_data: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    logger.info(f"Registration attempt for username: {user_data.username}, email: {user_data.email}")
    
    try:
        # Check if username already exists
        result = await db.execute(select(User).where(User.username == user_data.username))
        if result.scalar_one_or_none():
            logger.warning(f"Username already exists: {user_data.username}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already registered"
            )
        
        # Check if email already exists
        result = await db.execute(select(User).where(User.email == user_data.email))
        if result.scalar_one_or_none():
            logger.warning(f"Email already exists: {user_data.email}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create new user with verification token
        verification_token = secrets.token_urlsafe(32)
        logger.info(f"Creating user object for {user_data.username}")
        db_user = User(
            username=user_data.username,
            email=user_data.email,
            hashed_password=get_password_hash(user_data.password),
            is_verified=email_service.dev_mode,  # Auto-verify in dev mode
            verification_token=verification_token,
            verification_token_expires=datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(hours=24)
        )
        db.add(db_user)
        await db.commit()
        await db.refresh(db_user)
        logger.info(f"User created in database: {db_user.username}")
        
        # Send verification email
        try:
            logger.info(f"Attempting to send verification email to {user_data.email}")
            email_sent = await email_service.send_verification_email(
                to_email=user_data.email,
                username=user_data.username,
                token=verification_token
            )
            logger.info(f"Email sent status: {email_sent}")
        except Exception as email_error:
            logger.error(f"Failed to send verification email: {type(email_error).__name__}: {str(email_error)}")
            # Don't fail registration if email fails - user is already created
            
        return db_user
    except Exception as e:
        logger.error(f"Registration failed: {type(e).__name__}: {str(e)}")
        raise

@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    # Find user by username
    result = await db.execute(select(User).where(User.username == form_data.username))
    user = result.scalar_one_or_none()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if user is verified (skip in dev mode)
    if not user.is_verified and not email_service.dev_mode:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email not verified. Please check your email for verification link."
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": user.username})
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserSchema)
async def get_me(current_user: User = Depends(get_current_active_user)):
    return current_user

@router.post("/verify-email")
async def verify_email(
    token: str,
    db: AsyncSession = Depends(get_db)
):
    # Find user by verification token
    result = await db.execute(
        select(User).where(
            User.verification_token == token,
            User.verification_token_expires > datetime.now(timezone.utc)
        )
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token"
        )
    
    # Mark user as verified
    user.is_verified = True
    user.verification_token = None
    user.verification_token_expires = None
    
    await db.commit()
    
    return {"message": "Email verified successfully"}