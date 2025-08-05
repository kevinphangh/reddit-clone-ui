from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys
import os

# Add the app directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

try:
    from app.api import auth, posts, comments, users
    from app.core.config import settings
except ImportError as e:
    print(f"Import error: {e}")
    # Fallback for testing
    class MockRouter:
        pass
    auth = posts = comments = users = MockRouter()

app = FastAPI(
    title="VIA Pædagoger Forum API", 
    description="API for VIA University College pedagogy student forum",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://via-paedagoger.vercel.app",
        "https://via-forum.vercel.app",
        "http://localhost:3000", 
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes if available
if hasattr(auth, 'router'):
    app.include_router(auth.router, prefix="/auth", tags=["auth"])
if hasattr(posts, 'router'):
    app.include_router(posts.router, prefix="/posts", tags=["posts"])
if hasattr(comments, 'router'):
    app.include_router(comments.router, prefix="/comments", tags=["comments"])  
if hasattr(users, 'router'):
    app.include_router(users.router, prefix="/users", tags=["users"])

@app.get("/")
async def root():
    return {"message": "VIA Pædagoger Forum API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}