from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.database import get_db
from app.models import User
import os

router = APIRouter()

# Only enable in development
if os.getenv("ENVIRONMENT", "development") == "development":
    @router.get("/get-verification-link/{email}")
    async def get_verification_link(
        email: str,
        db: AsyncSession = Depends(get_db)
    ):
        """Get verification link for a user (DEV ONLY)"""
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        if user.is_verified:
            return {"message": "User already verified"}
        
        if not user.verification_token:
            return {"message": "No verification token found"}
        
        frontend_url = os.getenv("FRONTEND_URL", "https://via-forum.vercel.app")
        verification_link = f"{frontend_url}/verify-email?token={user.verification_token}"
        
        return {
            "username": user.username,
            "email": user.email,
            "verification_link": verification_link,
            "is_verified": user.is_verified
        }