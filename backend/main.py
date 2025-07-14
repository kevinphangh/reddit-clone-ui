from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import auth, posts, comments, users

app = FastAPI(
    title="VIA Pædagoger API",
    description="Backend API for VIA Pædagoger forum",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "https://via-paedagoger.vercel.app",
        "https://via-forum-2bjux99jd-kevins-projects-aa4b90de.vercel.app",
        "https://via-forum-842nw4l1g-kevins-projects-aa4b90de.vercel.app",
        "https://via-forum-ajg5xlvui-kevins-projects-aa4b90de.vercel.app",
        "https://via-forum-r1k7ex80x-kevins-projects-aa4b90de.vercel.app",
        "https://*.vercel.app",
        "http://localhost:3000",
        "http://localhost:3001", 
        "http://localhost:3002",
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(posts.router, prefix="/api/posts", tags=["posts"])
app.include_router(comments.router, prefix="/api/comments", tags=["comments"])
app.include_router(users.router, prefix="/api/users", tags=["users"])

@app.get("/")
async def root():
    return {"message": "VIA Pædagoger API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}