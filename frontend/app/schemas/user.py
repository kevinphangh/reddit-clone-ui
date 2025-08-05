from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    created_at: datetime
    is_active: bool
    is_verified: bool
    is_admin: bool = False
    
    points: dict = {"post": 0, "comment": 0}
    
    model_config = ConfigDict(from_attributes=True)
