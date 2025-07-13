#!/usr/bin/env python
"""Create initial migration for the database"""

import subprocess
import sys

def main():
    print("Creating initial migration...")
    
    # Create migration
    result = subprocess.run([
        sys.executable, "-m", "alembic", "revision", 
        "--autogenerate", "-m", "Initial migration"
    ])
    
    if result.returncode == 0:
        print("Migration created successfully!")
        print("Run 'alembic upgrade head' to apply the migration.")
    else:
        print("Failed to create migration")
        sys.exit(1)

if __name__ == "__main__":
    main()