"""
Run email verification migration
"""
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
import os

async def run_migration():
    database_url = os.getenv("DATABASE_URL", "")
    
    if not database_url:
        print("DATABASE_URL not set!")
        return
    
    # Convert postgres:// to postgresql://
    if database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://", 1)
    
    # Create async engine
    engine = create_async_engine(database_url)
    
    try:
        async with engine.begin() as conn:
            # Add verification columns if they don't exist
            await conn.execute(text("""
                ALTER TABLE users 
                ADD COLUMN IF NOT EXISTS verification_token VARCHAR(255),
                ADD COLUMN IF NOT EXISTS verification_token_expires TIMESTAMP
            """))
            
            # Update existing users to be verified
            await conn.execute(text("""
                UPDATE users 
                SET is_verified = true 
                WHERE is_verified IS NULL OR is_verified = false
            """))
            
            await conn.commit()
            
        print("Migration completed successfully!")
        
        # Verify the changes
        async with engine.connect() as conn:
            result = await conn.execute(text("""
                SELECT COUNT(*) as total, 
                       COUNT(CASE WHEN is_verified = true THEN 1 END) as verified
                FROM users
            """))
            row = result.fetchone()
            print(f"Total users: {row.total}, Verified: {row.verified}")
            
    except Exception as e:
        print(f"Migration failed: {e}")
    finally:
        await engine.dispose()

if __name__ == "__main__":
    asyncio.run(run_migration())