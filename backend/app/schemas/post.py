from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from app.schemas.user import User

class PostBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=100)
    content: Optional[str] = Field(None, max_length=5000)

class PostCreate(PostBase):
    pass

class PostUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=100)
    content: Optional[str] = Field(None, max_length=5000)

class Post(PostBase):
    id: int
    author: User
    created_at: datetime
    updated_at: datetime
    edited_at: Optional[datetime] = None
    score: int
    comment_count: int
    is_locked: bool
    
    type: str = "text"
    user_vote: Optional[int] = None
    saved: bool = False
    
    class Config:
        from_attributes = True