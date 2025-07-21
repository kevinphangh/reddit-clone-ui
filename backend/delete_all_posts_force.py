import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import delete, select
import os
from dotenv import load_dotenv
from app.models.post import Post
from app.models.comment import Comment
from app.models.vote import Vote, VoteType
from app.models.saved_item import SavedItem, ItemType

# Load environment variables
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

# Convert to async URL
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

engine = create_async_engine(DATABASE_URL)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def delete_all_posts_from_db():
    async with AsyncSessionLocal() as session:
        print("🗑️  Sletter alle posts direkte fra databasen...")
        
        try:
            # First delete all votes on posts
            print("❌ Sletter alle votes på posts...")
            await session.execute(delete(Vote).where(Vote.target_type == VoteType.POST))
            await session.commit()
            
            # Delete all saved posts
            print("❌ Sletter alle gemte posts...")
            await session.execute(delete(SavedItem).where(SavedItem.item_type == ItemType.POST))
            await session.commit()
            
            # Delete all comments (they cascade delete their votes)
            print("❌ Sletter alle kommentarer...")
            result = await session.execute(select(Comment))
            comments = result.scalars().all()
            comment_count = len(comments)
            
            await session.execute(delete(Comment))
            await session.commit()
            
            # Finally delete all posts
            print("❌ Sletter alle posts...")
            result = await session.execute(select(Post))
            posts = result.scalars().all()
            post_count = len(posts)
            
            await session.execute(delete(Post))
            await session.commit()
            
            print(f"\n✅ Sletning færdig!")
            print(f"📊 Slettet:")
            print(f"   • {post_count} posts")
            print(f"   • {comment_count} kommentarer")
            print(f"   • Alle relaterede votes og gemte posts")
            print(f"\n✨ Databasen er nu tom og klar til nye posts!")
            
        except Exception as e:
            print(f"❌ Fejl ved sletning: {e}")
            await session.rollback()

if __name__ == "__main__":
    print("""
🗑️  FORCE DELETE ALLE POSTS
===========================
Dette script vil:
1. Slette ALLE votes på posts
2. Slette ALLE gemte posts
3. Slette ALLE kommentarer
4. Slette ALLE posts

⚠️  ADVARSEL: Dette kan IKKE fortrydes!
⚠️  Kører direkte mod produktionsdatabasen!

Starter om 3 sekunder...
""")
    
    import time
    time.sleep(3)
    
    asyncio.run(delete_all_posts_from_db())