#!/usr/bin/env python3
"""
Simple migration script to add email verification fields
"""
import os
import asyncio
import asyncpg

async def run_migration():
    # Get database URL from environment
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        print("DATABASE_URL not found in environment")
        return
    
    # Convert postgres:// to postgresql:// if needed
    if database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://", 1)
    
    try:
        # Connect to database
        conn = await asyncpg.connect(database_url)
        
        # Run migration
        await conn.execute("""
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS verification_token VARCHAR(255),
            ADD COLUMN IF NOT EXISTS verification_token_expires TIMESTAMP
        """)
        
        # Update existing users to be verified
        await conn.execute("""
            UPDATE users 
            SET is_verified = true 
            WHERE is_verified IS NULL OR is_verified = false
        """)
        
        print("Migration completed successfully!")
        
        # Check results
        result = await conn.fetchrow("""
            SELECT COUNT(*) as total, 
                   COUNT(CASE WHEN is_verified = true THEN 1 END) as verified
            FROM users
        """)
        print(f"Total users: {result['total']}, Verified: {result['verified']}")
        
        await conn.close()
        
    except Exception as e:
        print(f"Migration failed: {e}")

if __name__ == "__main__":
    asyncio.run(run_migration())