#!/usr/bin/env python
"""Check database connection and tables"""

import os
import sys
from sqlalchemy import create_engine, inspect
from app.core.config import settings

def check_database():
    print(f"DATABASE_URL: {settings.DATABASE_URL}")
    print(f"Environment: {settings.ENVIRONMENT}")
    
    # Convert async URL to sync for inspection
    db_url = settings.DATABASE_URL
    if db_url.startswith("sqlite+aiosqlite"):
        db_url = db_url.replace("sqlite+aiosqlite", "sqlite")
    elif db_url.startswith("postgresql+asyncpg"):
        db_url = db_url.replace("postgresql+asyncpg", "postgresql")
    
    try:
        engine = create_engine(db_url)
        
        # Test connection
        with engine.connect() as conn:
            print("✓ Database connection successful")
        
        # List tables
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        
        print(f"\nTables found: {len(tables)}")
        for table in tables:
            columns = inspector.get_columns(table)
            print(f"  - {table} ({len(columns)} columns)")
            
        if not tables or len(tables) == 1:  # Only alembic_version
            print("\n⚠️  No application tables found!")
            print("Run 'alembic upgrade head' to create tables")
            
    except Exception as e:
        print(f"✗ Database connection failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    check_database()