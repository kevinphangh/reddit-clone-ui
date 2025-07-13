from typing import Literal, Optional, Union
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.vote import Vote
from app.models.post import Post
from app.models.comment import Comment
from app.models.user import User

async def handle_vote(
    db: AsyncSession,
    user_id: int,
    target_id: int,
    target_type: Literal["post", "comment"],
    vote_value: int
) -> dict:
    """
    Generic vote handling for posts and comments.
    
    Args:
        db: Database session
        user_id: ID of the voting user
        target_id: ID of the post or comment
        target_type: Type of the target (post or comment)
        vote_value: Vote value (1, -1, or 0)
    
    Returns:
        Dictionary with score and user_vote
    """
    # Get or create vote
    vote = await db.scalar(
        select(Vote).where(
            Vote.user_id == user_id,
            Vote.target_id == target_id,
            Vote.target_type == target_type
        )
    )
    
    if vote_value == 0:
        # Remove vote
        if vote:
            await db.delete(vote)
    else:
        if vote:
            # Update existing vote
            vote.value = vote_value
        else:
            # Create new vote
            vote = Vote(
                user_id=user_id,
                target_id=target_id,
                target_type=target_type,
                value=vote_value
            )
            db.add(vote)
    
    await db.commit()
    
    # Calculate new score
    score_result = await db.scalar(
        select(func.coalesce(func.sum(Vote.value), 0)).where(
            Vote.target_id == target_id,
            Vote.target_type == target_type
        )
    )
    
    # Update the target's score
    if target_type == "post":
        target = await db.get(Post, target_id)
        if target:
            target.score = score_result
    else:
        target = await db.get(Comment, target_id)
        if target:
            target.score = score_result
    
    await db.commit()
    
    return {
        "score": score_result,
        "user_vote": vote_value if vote_value != 0 else None
    }