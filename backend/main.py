from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from sqlalchemy import text
from app.core.config import settings
from app.api import auth, posts, comments, users
from app.db.database import AsyncSessionLocal

app = FastAPI(
    title="VIA Pædagoger API",
    description="Backend API for VIA Pædagoger forum",
    version="1.0.0"
)

# CORS middleware - MUST be added before other middleware and routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "https://via-paedagoger.vercel.app",
        "https://via-forum.vercel.app",
        "https://via-forum-2bjux99jd-kevins-projects-aa4b90de.vercel.app",
        "https://via-forum-842nw4l1g-kevins-projects-aa4b90de.vercel.app",
        "https://via-forum-ajg5xlvui-kevins-projects-aa4b90de.vercel.app",
        "https://via-forum-r1k7ex80x-kevins-projects-aa4b90de.vercel.app",
        "https://via-forum-6ms4atdw1-kevins-projects-aa4b90de.vercel.app",
        "https://via-forum-m5uc8v0w0-kevins-projects-aa4b90de.vercel.app",
        "https://via-forum-kz0u7b1bu-kevins-projects-aa4b90de.vercel.app",
        "https://via-forum-ov48gw630-kevins-projects-aa4b90de.vercel.app",
        "http://localhost:3000",
        "http://localhost:3001", 
        "http://localhost:3002",
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Custom exception handlers to ensure CORS headers are included
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
        headers={
            "Access-Control-Allow-Origin": request.headers.get("origin", "*"),
            "Access-Control-Allow-Credentials": "true",
        }
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()},
        headers={
            "Access-Control-Allow-Origin": request.headers.get("origin", "*"),
            "Access-Control-Allow-Credentials": "true",
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    # Log the error for debugging
    import traceback
    traceback.print_exc()
    
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
        headers={
            "Access-Control-Allow-Origin": request.headers.get("origin", "*"),
            "Access-Control-Allow-Credentials": "true",
        }
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
    """Health check endpoint that verifies database connectivity"""
    try:
        # Test database connection
        async with AsyncSessionLocal() as session:
            result = await session.execute(text("SELECT 1"))
            result.scalar()
        return {
            "status": "healthy",
            "database": "connected",
            "environment": settings.ENVIRONMENT
        }
    except Exception as e:
        return JSONResponse(
            status_code=503,
            content={
                "status": "unhealthy",
                "database": "disconnected",
                "error": str(e)
            }
        )