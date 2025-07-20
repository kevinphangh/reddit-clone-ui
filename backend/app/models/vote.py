from sqlalchemy import Column, Integer, ForeignKey, DateTime, Enum, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.db.database import Base

class VoteType(str, enum.Enum):
    POST = "post"
    COMMENT = "comment"

class Vote(Base):
    __tablename__ = "votes"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    target_id = Column(Integer, nullable=False, index=True)
    target_type = Column(Enum(VoteType), nullable=False)
    value = Column(Integer, nullable=False)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    user = relationship("User", back_populates="votes")
    __table_args__ = (
        UniqueConstraint('user_id', 'target_id', 'target_type', name='_user_target_uc'),
    )