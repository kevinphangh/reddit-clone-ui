from sqlalchemy import Column, Integer, ForeignKey, DateTime, Enum, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.db.database import Base

class ItemType(str, enum.Enum):
    POST = "post"
    COMMENT = "comment"

class SavedItem(Base):
    __tablename__ = "saved_items"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    item_id = Column(Integer, nullable=False, index=True)
    item_type = Column(Enum(ItemType), nullable=False)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="saved_items")
    
    # Unique constraint
    __table_args__ = (
        UniqueConstraint('user_id', 'item_id', 'item_type', name='_user_item_uc'),
    )