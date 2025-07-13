from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class Post(Base):
    __tablename__ = "posts"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(300), nullable=False)
    content = Column(Text, nullable=True)
    
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    edited_at = Column(DateTime, nullable=True)
    
    score = Column(Integer, default=0, index=True)
    comment_count = Column(Integer, default=0)
    
    is_locked = Column(Boolean, default=False)
    is_deleted = Column(Boolean, default=False)
    
    # Relationships
    author = relationship("User", back_populates="posts")
    comments = relationship("Comment", back_populates="post", cascade="all, delete-orphan")
    votes = relationship("Vote", 
                        primaryjoin="and_(Post.id==Vote.target_id, Vote.target_type=='post')",
                        foreign_keys="[Vote.target_id]",
                        cascade="all, delete-orphan")
    saved_by = relationship("SavedItem",
                           primaryjoin="and_(Post.id==SavedItem.item_id, SavedItem.item_type=='post')",
                           foreign_keys="[SavedItem.item_id]",
                           cascade="all, delete-orphan")