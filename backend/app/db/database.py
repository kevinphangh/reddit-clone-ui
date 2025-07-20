from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from app.core.config import settings

database_url = settings.DATABASE_URL
if database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql://", 1)

if database_url.startswith("sqlite"):
    if not database_url.startswith("sqlite+aiosqlite"):
        database_url = database_url.replace("sqlite://", "sqlite+aiosqlite://", 1)
    engine = create_async_engine(
        database_url,
        echo=settings.ENVIRONMENT == "development",
        connect_args={"check_same_thread": False}
    )
else:
    if not database_url.startswith("postgresql+asyncpg"):
        database_url = database_url.replace("postgresql://", "postgresql+asyncpg://", 1)
    engine = create_async_engine(
        database_url,
        echo=settings.ENVIRONMENT == "development"
    )

AsyncSessionLocal = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()