#!/usr/bin/env python
"""
Simple test runner for backend tests
"""
import subprocess
import sys
import os

# Set test environment
os.environ["DATABASE_URL"] = "sqlite+aiosqlite:///:memory:"
os.environ["SECRET_KEY"] = "test-secret-key"
os.environ["EMAIL_DEV_MODE"] = "true"

# Run pytest
result = subprocess.run([
    sys.executable, "-m", "pytest", 
    "-v", 
    "--tb=short",
    "--disable-warnings"
], cwd=os.path.dirname(os.path.abspath(__file__)))

sys.exit(result.returncode)