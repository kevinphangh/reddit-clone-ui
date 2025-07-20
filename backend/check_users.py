#!/usr/bin/env python3
"""Check users in the database"""

import asyncio
import os
from sqlalchemy import select
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.models.user import User

async def check_users():
    # Get database URL from environment
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        print("ERROR: DATABASE_URL not set")
        return
    
    # Convert postgres:// to postgresql:// if needed
    if database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://", 1)
    
    # Convert to async URL
    if database_url.startswith("postgresql://"):
        database_url = database_url.replace("postgresql://", "postgresql+asyncpg://", 1)
    
    print(f"Connecting to database...")
    
    try:
        # Create engine and session
        engine = create_async_engine(database_url)
        AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
        
        async with AsyncSessionLocal() as session:
            # Query all users
            result = await session.execute(select(User))
            users = result.scalars().all()
            
            if not users:
                print("\nNo users found in the database.")
            else:
                print(f"\nFound {len(users)} users:")
                print("-" * 80)
                for user in users:
                    print(f"ID: {user.id}")
                    print(f"Username: {user.username}")
                    print(f"Email: {user.email}")
                    print(f"Password Hash: {user.hashed_password[:20]}..." if user.hashed_password else "No password")
                    print(f"Active: {user.is_active}")
                    print(f"Created: {user.created_at}")
                    print("-" * 80)
        
        # Close the engine
        await engine.dispose()
        
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    asyncio.run(check_users())