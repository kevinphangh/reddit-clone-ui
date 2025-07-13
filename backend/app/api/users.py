from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from sqlalchemy.orm import selectinload
from app.db.database import get_db
from app.models import User, Post, Comment
from app.schemas.user import User as UserSchema
from app.schemas.post import Post as PostSchema
from app.schemas.comment import Comment as CommentSchema
from app.core.deps import get_current_user_optional
from app.api.posts import get_post_with_user_data
from app.api.comments import get_comment_with_user_data

router = APIRouter()

@router.get("/{username}", response_model=UserSchema)
async def get_user(
    username: str,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(User).where(User.username == username)
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user

@router.get("/{username}/posts", response_model=List[PostSchema])
async def get_user_posts(
    username: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user_optional)
):
    # Get user
    user_result = await db.execute(
        select(User).where(User.username == username)
    )
    user = user_result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get user's posts
    result = await db.execute(
        select(Post)
        .where(and_(Post.author_id == user.id, Post.is_deleted == False))
        .options(selectinload(Post.author))
        .order_by(Post.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    posts = result.scalars().all()
    
    # Add user-specific data
    for post in posts:
        await get_post_with_user_data(post, current_user, db)
    
    return posts

@router.get("/{username}/comments", response_model=List[CommentSchema])
async def get_user_comments(
    username: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user_optional)
):
    # Get user
    user_result = await db.execute(
        select(User).where(User.username == username)
    )
    user = user_result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get user's comments
    result = await db.execute(
        select(Comment)
        .where(and_(Comment.author_id == user.id, Comment.is_deleted == False))
        .options(
            selectinload(Comment.author),
            selectinload(Comment.post).selectinload(Post.author)
        )
        .order_by(Comment.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    comments = result.scalars().all()
    
    # Add user-specific data
    for comment in comments:
        await get_comment_with_user_data(comment, current_user, db)
        comment.replies = []  # Don't load full reply tree for user page
    
    return comments