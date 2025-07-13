from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.schemas.user import User

class PostBase(BaseModel):
    title: str
    content: Optional[str] = None

class PostCreate(PostBase):
    pass

class PostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None

class Post(PostBase):
    id: int
    author: User
    created_at: datetime
    updated_at: datetime
    edited_at: Optional[datetime] = None
    score: int
    comment_count: int
    is_locked: bool
    
    # Frontend compatibility
    type: str = "text"
    user_vote: Optional[int] = None
    saved: bool = False
    
    class Config:
        from_attributes = True

