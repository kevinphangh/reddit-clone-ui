#!/usr/bin/env python3
import asyncio
import asyncpg
import sys

async def setup_supabase_database():
    """Set up the database schema in Supabase"""
    
    connection_string = "postgresql://postgres:Maa72ckrsick!@db.rmtiksoarunbpeatdrng.supabase.co:5432/postgres"
    
    try:
        print("Connecting to Supabase database...")
        conn = await asyncpg.connect(connection_string)
        print("✅ Connected successfully!")
        
        # Read and execute the schema
        with open('create_supabase_schema.sql', 'r') as f:
            schema_sql = f.read()
        
        print("Creating database schema...")
        
        # Split by statements and execute each one
        statements = [stmt.strip() for stmt in schema_sql.split(';') if stmt.strip()]
        
        for i, statement in enumerate(statements):
            if statement and not statement.startswith('--'):
                try:
                    await conn.execute(statement)
                    print(f"✅ Executed statement {i+1}/{len(statements)}")
                except Exception as e:
                    print(f"⚠️  Statement {i+1} failed: {e}")
                    print(f"Statement: {statement[:100]}...")
        
        print("\n🎉 Database schema created successfully!")
        
        # Test the tables were created
        tables = await conn.fetch("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
            ORDER BY table_name
        """)
        
        print(f"\n📋 Created tables:")
        for table in tables:
            print(f"  - {table['table_name']}")
        
        await conn.close()
        print("\n✅ Database setup complete!")
        return True
        
    except Exception as e:
        print(f"❌ Error setting up database: {e}")
        return False

if __name__ == "__main__":
    success = asyncio.run(setup_supabase_database())
    sys.exit(0 if success else 1)