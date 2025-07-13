import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import engine, Base
from app.models import *  # Import all models

async def init_db():
    async with engine.begin() as conn:
        # Create all tables
        await conn.run_sync(Base.metadata.create_all)
    print("Database tables created successfully!")

if __name__ == "__main__":
    asyncio.run(init_db())