from sqlalchemy import Column, Integer, Text, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.db.database import Base

class Comment(Base):
    __tablename__ = "comments"
    
    id = Column(Integer, primary_key=True, index=True)
    body = Column(Text, nullable=False)
    
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    post_id = Column(Integer, ForeignKey("posts.id"), nullable=False, index=True)
    parent_id = Column(Integer, ForeignKey("comments.id"), nullable=True, index=True)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    edited_at = Column(DateTime, nullable=True)
    
    score = Column(Integer, default=0)
    depth = Column(Integer, default=0)
    
    is_deleted = Column(Boolean, default=False)
    
    author = relationship("User", back_populates="comments")
    post = relationship("Post", back_populates="comments")
    parent = relationship("Comment", remote_side=[id], backref="replies")
    votes = relationship("Vote",
                        primaryjoin="and_(Comment.id==Vote.target_id, Vote.target_type=='comment')",
                        foreign_keys="[Vote.target_id]",
                        cascade="all, delete-orphan",
                        overlaps="votes")
    saved_by = relationship("SavedItem",
                           primaryjoin="and_(Comment.id==SavedItem.item_id, SavedItem.item_type=='comment')",
                           foreign_keys="[SavedItem.item_id]",
                           cascade="all, delete-orphan",
                           overlaps="saved_by")