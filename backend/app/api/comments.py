from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from sqlalchemy.orm import selectinload
from app.db.database import get_db
from app.models import Comment, Post, User, Vote, SavedItem
from app.models.vote import VoteType
from app.models.saved_item import ItemType
from app.schemas.comment import Comment as CommentSchema, CommentCreate, CommentUpdate
from app.core.deps import get_current_active_user, get_current_user_optional
from app.core.voting import handle_vote

router = APIRouter()

async def get_comment_with_user_data(
    comment: Comment,
    user: Optional[User],
    db: AsyncSession
) -> Comment:
    """Add user-specific data to comment"""
    if user:
        # Check user vote
        vote_result = await db.execute(
            select(Vote).where(
                and_(
                    Vote.user_id == user.id,
                    Vote.target_id == comment.id,
                    Vote.target_type == VoteType.COMMENT
                )
            )
        )
        vote = vote_result.scalar_one_or_none()
        comment.user_vote = vote.value if vote else None
        
        # Check if saved
        saved_result = await db.execute(
            select(SavedItem).where(
                and_(
                    SavedItem.user_id == user.id,
                    SavedItem.item_id == comment.id,
                    SavedItem.item_type == ItemType.COMMENT
                )
            )
        )
        comment.saved = saved_result.scalar_one_or_none() is not None
    
    return comment

@router.get("/post/{post_id}", response_model=List[CommentSchema])
async def get_post_comments(
    post_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    # First check if the post exists
    post_result = await db.execute(
        select(Post).where(and_(Post.id == post_id, Post.is_deleted == False))
    )
    post = post_result.scalar_one_or_none()
    
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Get all comments for post with author info
    result = await db.execute(
        select(Comment)
        .where(and_(Comment.post_id == post_id, Comment.is_deleted == False))
        .options(
            selectinload(Comment.author),
            selectinload(Comment.post).selectinload(Post.author)
        )
        .order_by(Comment.created_at)
    )
    comments = result.scalars().all()
    
    # Build comment tree and add user data
    comment_dict = {}
    root_comments = []
    
    # First pass: create dictionary of all comments with user data
    for comment in comments:
        await get_comment_with_user_data(comment, current_user, db)
        comment_dict[comment.id] = comment
    
    # Second pass: build the tree structure by creating proper response objects
    comment_responses = {}
    
    for comment in comments:
        # Create a dictionary representation for proper serialization
        comment_data = {
            "id": comment.id,
            "body": comment.body,
            "parent_id": comment.parent_id,
            "author": comment.author,
            "post": comment.post,
            "created_at": comment.created_at,
            "updated_at": comment.updated_at,
            "edited_at": comment.edited_at,
            "score": comment.score,
            "depth": comment.depth,
            "replies": [],
            "user_vote": getattr(comment, 'user_vote', None),
            "saved": getattr(comment, 'saved', False),
            "is_deleted": comment.is_deleted
        }
        comment_responses[comment.id] = comment_data
        
        if comment.parent_id is None:
            root_comments.append(comment_data)
    
    # Build tree structure
    for comment in comments:
        if comment.parent_id and comment.parent_id in comment_responses:
            comment_responses[comment.parent_id]["replies"].append(comment_responses[comment.id])
    
    return root_comments

@router.post("/post/{post_id}", response_model=CommentSchema)
async def create_comment(
    post_id: int,
    comment_data: CommentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Check if post exists
    post_result = await db.execute(
        select(Post)
        .where(and_(Post.id == post_id, Post.is_deleted == False))
        .options(selectinload(Post.author))
    )
    post = post_result.scalar_one_or_none()
    
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    if post.is_locked:
        raise HTTPException(status_code=403, detail="Post is locked")
    
    # Calculate depth if replying to another comment
    depth = 0
    if comment_data.parent_id:
        parent_result = await db.execute(
            select(Comment).where(Comment.id == comment_data.parent_id)
        )
        parent = parent_result.scalar_one_or_none()
        if not parent or parent.post_id != post_id:
            raise HTTPException(status_code=400, detail="Invalid parent comment")
        depth = parent.depth + 1
    
    # Create comment
    db_comment = Comment(
        body=comment_data.body,
        author_id=current_user.id,
        post_id=post_id,
        parent_id=comment_data.parent_id,
        depth=depth,
        score=1  # Start with author's upvote
    )
    db.add(db_comment)
    
    # Update post comment count
    post.comment_count += 1
    
    await db.commit()
    await db.refresh(db_comment)
    
    # Add author's upvote (after comment has ID)
    db_vote = Vote(
        user_id=current_user.id,
        target_id=db_comment.id,
        target_type=VoteType.COMMENT.value,
        value=1
    )
    db.add(db_vote)
    await db.commit()
    
    # Load relationships
    await db.refresh(db_comment, ["author", "post"])
    
    # Return properly formatted response
    return {
        "id": db_comment.id,
        "body": db_comment.body,
        "parent_id": db_comment.parent_id,
        "author": db_comment.author,
        "post": db_comment.post,
        "created_at": db_comment.created_at,
        "updated_at": db_comment.updated_at,
        "edited_at": db_comment.edited_at,
        "score": db_comment.score,
        "depth": db_comment.depth,
        "replies": [],
        "user_vote": 1,
        "saved": False,
        "is_deleted": db_comment.is_deleted
    }

@router.put("/{comment_id}", response_model=CommentSchema)
async def update_comment(
    comment_id: int,
    comment_update: CommentUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Get comment
    result = await db.execute(
        select(Comment)
        .where(and_(Comment.id == comment_id, Comment.is_deleted == False))
        .options(
            selectinload(Comment.author),
            selectinload(Comment.post).selectinload(Post.author)
        )
    )
    comment = result.scalar_one_or_none()
    
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    if comment.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to edit this comment")
    
    # Update comment
    comment.body = comment_update.body
    comment.edited_at = datetime.utcnow()
    
    await db.commit()
    await db.refresh(comment)
    
    await get_comment_with_user_data(comment, current_user, db)
    
    # Return properly formatted response
    return {
        "id": comment.id,
        "body": comment.body,
        "parent_id": comment.parent_id,
        "author": comment.author,
        "post": comment.post,
        "created_at": comment.created_at,
        "updated_at": comment.updated_at,
        "edited_at": comment.edited_at,
        "score": comment.score,
        "depth": comment.depth,
        "replies": [],
        "user_vote": getattr(comment, 'user_vote', None),
        "saved": getattr(comment, 'saved', False),
        "is_deleted": comment.is_deleted
    }

@router.delete("/{comment_id}")
async def delete_comment(
    comment_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Get comment
    result = await db.execute(
        select(Comment)
        .where(Comment.id == comment_id)
        .options(selectinload(Comment.post))
    )
    comment = result.scalar_one_or_none()
    
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    if comment.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this comment")
    
    # Soft delete
    comment.is_deleted = True
    comment.body = "[slettet]"
    
    # Update post comment count
    comment.post.comment_count = max(0, comment.post.comment_count - 1)
    
    await db.commit()
    
    return {"detail": "Comment deleted"}

@router.post("/{comment_id}/vote")
async def vote_comment(
    comment_id: int,
    vote_value: int = Query(..., ge=-1, le=1),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Vote on a comment. vote_value: 1 = upvote, -1 = downvote, 0 = remove vote"""
    # Check if comment exists
    result = await db.execute(
        select(Comment).where(and_(Comment.id == comment_id, Comment.is_deleted == False))
    )
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Comment not found")
    
    # Handle vote using shared utility
    return await handle_vote(
        db=db,
        user_id=current_user.id,
        target_id=comment_id,
        target_type="comment",
        vote_value=vote_value
    )