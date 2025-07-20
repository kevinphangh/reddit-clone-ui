from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, ForwardRef
from app.schemas.user import User
from app.schemas.post import Post

CommentRef = ForwardRef('Comment')

class CommentBase(BaseModel):
    body: str
    parent_id: Optional[int] = None

class CommentCreate(CommentBase):
    pass

class CommentUpdate(BaseModel):
    body: str

class Comment(CommentBase):
    id: int
    author: User
    post: Post
    created_at: datetime
    updated_at: datetime
    edited_at: Optional[datetime] = None
    score: int
    depth: int
    
    replies: List[CommentRef] = []
    user_vote: Optional[int] = None
    saved: bool = False
    is_deleted: bool
    
    class Config:
        from_attributes = True

Comment.model_rebuild()