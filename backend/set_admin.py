"""
Script to set kevinphangh@outlook.com as admin
"""
import asyncio
import asyncpg
import os
from datetime import datetime, timezone

async def set_admin():
    # Get database URL from environment
    db_url = os.getenv("DATABASE_URL", "sqlite:///./test.db")
    
    if db_url.startswith("sqlite"):
        # For local SQLite development
        import sqlite3
        conn = sqlite3.connect("test.db")
        cursor = conn.cursor()
        
        # Update user to be admin
        cursor.execute("""
            UPDATE users 
            SET is_admin = 1 
            WHERE email = 'kevinphangh@outlook.com'
        """)
        
        conn.commit()
        
        # Check if update was successful
        cursor.execute("SELECT username, email, is_admin FROM users WHERE email = 'kevinphangh@outlook.com'")
        result = cursor.fetchone()
        
        if result:
            print(f"Successfully set admin for user: {result[0]} ({result[1]}) - Admin: {bool(result[2])}")
        else:
            print("User kevinphangh@outlook.com not found")
        
        conn.close()
    else:
        # For production PostgreSQL
        db_url = db_url.replace("postgres://", "postgresql://", 1)
        conn = await asyncpg.connect(db_url)
        
        # Update user to be admin
        result = await conn.execute("""
            UPDATE users 
            SET is_admin = true 
            WHERE email = 'kevinphangh@outlook.com'
        """)
        
        # Check if update was successful
        user = await conn.fetchrow("SELECT username, email, is_admin FROM users WHERE email = 'kevinphangh@outlook.com'")
        
        if user:
            print(f"Successfully set admin for user: {user['username']} ({user['email']}) - Admin: {user['is_admin']}")
        else:
            print("User kevinphangh@outlook.com not found")
        
        await conn.close()

if __name__ == "__main__":
    asyncio.run(set_admin())