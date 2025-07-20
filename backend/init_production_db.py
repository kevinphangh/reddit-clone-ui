#!/usr/bin/env python3
"""
Initialize the production database tables without using Alembic.
This is a temporary solution to get the database working on Fly.io.
"""

import asyncio
import os
from sqlalchemy.ext.asyncio import create_async_engine
from app.db.database import Base
from app.models import user, post, comment, vote  # Import all models to register them

async def init_database():
    # Get database URL from environment
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        return False
    
    # Convert postgres:// to postgresql:// if needed
    if database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://", 1)
    
    # Convert to async URL
    if database_url.startswith("postgresql://"):
        database_url = database_url.replace("postgresql://", "postgresql+asyncpg://", 1)
    
    
    try:
        # Create engine
        engine = create_async_engine(database_url, echo=True)
        
        # Create all tables
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        
        # Close the engine
        await engine.dispose()
        return True
        
    except Exception:
        return False

if __name__ == "__main__":
    success = asyncio.run(init_database())
    if not success:
        exit(1)