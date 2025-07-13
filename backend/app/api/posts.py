from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from sqlalchemy.orm import selectinload
from app.db.database import get_db
from app.models import Post, User, Vote, SavedItem
from app.models.vote import VoteType
from app.models.saved_item import ItemType
from app.schemas.post import Post as PostSchema, PostCreate, PostUpdate
from app.core.deps import get_current_active_user, get_current_user_optional

router = APIRouter()

async def get_post_with_user_data(
    post: Post,
    user: Optional[User],
    db: AsyncSession
) -> Post:
    """Add user-specific data to post (vote status, saved status)"""
    if user:
        # Check user vote
        vote_result = await db.execute(
            select(Vote).where(
                and_(
                    Vote.user_id == user.id,
                    Vote.target_id == post.id,
                    Vote.target_type == VoteType.POST
                )
            )
        )
        vote = vote_result.scalar_one_or_none()
        post.user_vote = vote.value if vote else None
        
        # Check if saved
        saved_result = await db.execute(
            select(SavedItem).where(
                and_(
                    SavedItem.user_id == user.id,
                    SavedItem.item_id == post.id,
                    SavedItem.item_type == ItemType.POST
                )
            )
        )
        post.saved = saved_result.scalar_one_or_none() is not None
    
    return post

@router.get("/", response_model=List[PostSchema])
async def get_posts(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    sort: str = Query("new", regex="^(new|top|hot)$"),
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    # Build query
    query = select(Post).where(Post.is_deleted == False).options(selectinload(Post.author))
    
    # Apply sorting
    if sort == "new":
        query = query.order_by(Post.created_at.desc())
    elif sort == "top":
        query = query.order_by(Post.score.desc())
    else:  # hot
        query = query.order_by(Post.score.desc(), Post.created_at.desc())
    
    # Apply pagination
    query = query.offset(skip).limit(limit)
    
    # Execute query
    result = await db.execute(query)
    posts = result.scalars().all()
    
    # Add user-specific data
    for post in posts:
        await get_post_with_user_data(post, current_user, db)
    
    return posts

@router.get("/{post_id}", response_model=PostSchema)
async def get_post(
    post_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    result = await db.execute(
        select(Post)
        .where(and_(Post.id == post_id, Post.is_deleted == False))
        .options(selectinload(Post.author))
    )
    post = result.scalar_one_or_none()
    
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    await get_post_with_user_data(post, current_user, db)
    
    return post

@router.post("/", response_model=PostSchema)
async def create_post(
    post_data: PostCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Create new post
    db_post = Post(
        **post_data.model_dump(),
        author_id=current_user.id,
        score=1  # Start with 1 (author's implicit upvote)
    )
    db.add(db_post)
    
    # Add author's upvote
    db_vote = Vote(
        user_id=current_user.id,
        target_id=db_post.id,
        target_type=VoteType.POST,
        value=1
    )
    db.add(db_vote)
    
    await db.commit()
    await db.refresh(db_post)
    
    # Load author relationship
    await db.refresh(db_post, ["author"])
    
    db_post.user_vote = 1
    db_post.saved = False
    
    return db_post

@router.put("/{post_id}", response_model=PostSchema)
async def update_post(
    post_id: int,
    post_update: PostUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Get post
    result = await db.execute(
        select(Post)
        .where(and_(Post.id == post_id, Post.is_deleted == False))
        .options(selectinload(Post.author))
    )
    post = result.scalar_one_or_none()
    
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    if post.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to edit this post")
    
    # Update post
    update_data = post_update.model_dump(exclude_unset=True)
    if update_data:
        for field, value in update_data.items():
            setattr(post, field, value)
        post.edited_at = func.now()
    
    await db.commit()
    await db.refresh(post)
    
    await get_post_with_user_data(post, current_user, db)
    
    return post

@router.delete("/{post_id}")
async def delete_post(
    post_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Get post
    result = await db.execute(select(Post).where(Post.id == post_id))
    post = result.scalar_one_or_none()
    
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    if post.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this post")
    
    # Soft delete
    post.is_deleted = True
    await db.commit()
    
    return {"detail": "Post deleted"}

@router.post("/{post_id}/vote")
async def vote_post(
    post_id: int,
    vote_value: int = Query(..., ge=-1, le=1),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Get post
    result = await db.execute(select(Post).where(and_(Post.id == post_id, Post.is_deleted == False)))
    post = result.scalar_one_or_none()
    
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Check existing vote
    vote_result = await db.execute(
        select(Vote).where(
            and_(
                Vote.user_id == current_user.id,
                Vote.target_id == post_id,
                Vote.target_type == VoteType.POST
            )
        )
    )
    existing_vote = vote_result.scalar_one_or_none()
    
    if vote_value == 0:
        # Remove vote
        if existing_vote:
            post.score -= existing_vote.value
            await db.delete(existing_vote)
    else:
        if existing_vote:
            # Update vote
            post.score += (vote_value - existing_vote.value)
            existing_vote.value = vote_value
        else:
            # Create new vote
            post.score += vote_value
            new_vote = Vote(
                user_id=current_user.id,
                target_id=post_id,
                target_type=VoteType.POST,
                value=vote_value
            )
            db.add(new_vote)
    
    await db.commit()
    
    return {"score": post.score, "user_vote": vote_value if vote_value != 0 else None}

@router.post("/{post_id}/save")
async def toggle_save_post(
    post_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Check if post exists
    result = await db.execute(select(Post).where(and_(Post.id == post_id, Post.is_deleted == False)))
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Check if already saved
    saved_result = await db.execute(
        select(SavedItem).where(
            and_(
                SavedItem.user_id == current_user.id,
                SavedItem.item_id == post_id,
                SavedItem.item_type == ItemType.POST
            )
        )
    )
    existing_save = saved_result.scalar_one_or_none()
    
    if existing_save:
        # Unsave
        await db.delete(existing_save)
        saved = False
    else:
        # Save
        new_save = SavedItem(
            user_id=current_user.id,
            item_id=post_id,
            item_type=ItemType.POST
        )
        db.add(new_save)
        saved = True
    
    await db.commit()
    
    return {"saved": saved}