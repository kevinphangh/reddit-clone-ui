#!/usr/bin/env python3
import asyncio
import asyncpg
import json
import os
from datetime import datetime

async def export_database():
    try:
        # Database URL should be available in Fly environment
        db_url = os.getenv('DATABASE_URL')
        if not db_url:
            print("DATABASE_URL not found in environment")
            return
            
        conn = await asyncpg.connect(db_url)
        print("Connected to database successfully")
        
        # Export users
        users = await conn.fetch("SELECT * FROM users ORDER BY id")
        with open('/tmp/users.json', 'w') as f:
            json.dump([dict(row) for row in users], f, default=str, indent=2)
        print(f"Exported {len(users)} users")
        
        # Export posts
        posts = await conn.fetch("SELECT * FROM posts ORDER BY id")
        with open('/tmp/posts.json', 'w') as f:
            json.dump([dict(row) for row in posts], f, default=str, indent=2)
        print(f"Exported {len(posts)} posts")
        
        # Export comments
        comments = await conn.fetch("SELECT * FROM comments ORDER BY id")
        with open('/tmp/comments.json', 'w') as f:
            json.dump([dict(row) for row in comments], f, default=str, indent=2)
        print(f"Exported {len(comments)} comments")
        
        # Export votes
        votes = await conn.fetch("SELECT * FROM votes ORDER BY id")
        with open('/tmp/votes.json', 'w') as f:
            json.dump([dict(row) for row in votes], f, default=str, indent=2)
        print(f"Exported {len(votes)} votes")
        
        await conn.close()
        print("Database export completed successfully")
        
    except Exception as e:
        print(f"Error exporting database: {e}")

if __name__ == "__main__":
    asyncio.run(export_database())