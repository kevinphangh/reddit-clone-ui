from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None

class User(UserBase):
    id: int
    created_at: datetime
    is_active: bool
    is_verified: bool
    
    # Computed fields for frontend compatibility
    points: dict = {"post": 0, "comment": 0}
    
    class Config:
        from_attributes = True

class UserInDB(User):
    hashed_password: str