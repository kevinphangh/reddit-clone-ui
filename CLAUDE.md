# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VIA Pædagoger Forum - A Danish community platform for pedagogy students at VIA University College. Built with React 19 + TypeScript frontend and FastAPI Python backend.

**Live URLs:**
- Frontend: https://via-paedagoger.vercel.app (also https://via-forum.vercel.app)
- Backend API: https://via-forum.vercel.app/api (migrated from Fly.io to Vercel Functions)

## Development Commands

### Frontend Commands
```bash
cd frontend
npm run dev          # Development server on port 3000
npm run build        # Production build (runs TypeScript check + Vite build)
npm run typecheck    # TypeScript checking only
npm run lint         # TypeScript checking (same as typecheck)
npm test             # Run tests in watch mode
npm test -- --run    # Run all tests once
npm run test:coverage # Run tests with coverage report
```

### Backend Commands
```bash
cd backend
source venv/bin/activate                 # Activate virtual environment
uvicorn main:app --reload               # Development server
python -m pytest tests/ -v              # Run all tests
alembic upgrade head                     # Run database migrations
./toggle_email_verification.sh          # Toggle email verification on/off
```

### Testing Commands
- **Frontend:** 38 tests using Vitest + React Testing Library + MSW for API mocking
- **Backend:** 20 tests using pytest-asyncio with in-memory SQLite
- **Integration tests:** Located in `frontend/src/__tests__/integration/`

### Deployment Commands
```bash
# Deploy Frontend (Vercel)
cd frontend && vercel --prod

# Deploy Backend (Fly.io)
cd backend && /home/keph/.fly/bin/flyctl deploy

# Check Backend Logs
/home/keph/.fly/bin/flyctl logs -a via-forum-api
```

## Architecture Overview

### Backend Architecture (FastAPI + SQLAlchemy + PostgreSQL)

**Core Structure:**
- `main.py` - FastAPI app with CORS, error handlers, and route registration
- `app/api/` - REST endpoints (auth, posts, comments, users)
- `app/models/` - SQLAlchemy ORM models with relationships
- `app/schemas/` - Pydantic schemas for request/response validation
- `app/core/` - Security, JWT auth, and configuration
- `app/services/` - Business logic (email service with Resend)

**Key Features:**
- Async SQLAlchemy with AsyncSession for all database operations
- JWT authentication with configurable token expiration (default: 1 week)
- Email verification system with toggle (`EMAIL_DEV_MODE` environment variable)
- Comprehensive error handling with CORS-aware exception handlers
- Database supports both PostgreSQL (production) and SQLite (development/testing)

**Database Models:**
- User: username, email, verification status, username change tracking
- Post: title, content, voting score, comment count
- Comment: nested comments with parent_id relationships
- Vote: separate votes for posts and comments
- SavedItem: user's saved posts/comments

### Frontend Architecture (React 19 + TypeScript + Tailwind)

**Core Structure:**
- `src/App.tsx` - Main app with backend availability checking and provider hierarchy
- `src/contexts/` - React contexts for auth, data, notifications, comment cooldowns
- `src/pages/` - Route components (HomePage, PostPage, UserPage, etc.)
- `src/components/` - Reusable UI components
- `src/lib/api.ts` - Centralized API client with error handling and HTTPS enforcement

**Key Features:**
- Context-based state management (AuthContext, DataContext, NotificationContext)
- Backend availability checking with automatic reconnection attempts
- Centralized API client with proper error handling and token management
- Danish UI text throughout the application
- Real-time user count updates

**Design System:**
- **Configuration:** `src/config/branding.ts` - centralized colors, typography, spacing
- **Colors:** Rose/beige primary palette (#ffb69e, #ffe3d8) with soft coral accents
- **Typography:** Inter font family with Danish minimalist aesthetic
- **Symbol:** Unity symbol (two overlapping circles) instead of mascot
- **Responsive:** Mobile-first design with Tailwind CSS

### Authentication Flow
1. User registers with email verification (toggleable via `EMAIL_DEV_MODE`)
2. JWT tokens stored in localStorage with automatic refresh
3. Protected routes check authentication status via AuthContext
4. Backend validates JWT tokens on protected endpoints

### Data Flow
1. **API Layer:** `src/lib/api.ts` handles all HTTP requests with error handling
2. **Context Layer:** React contexts manage global state (auth, posts, users)
3. **Component Layer:** Pages and components consume context data
4. **Backend:** FastAPI endpoints with async database operations

### Testing Architecture
- **Frontend:** Vitest with jsdom environment, MSW for API mocking, React Testing Library
- **Backend:** pytest-asyncio with test fixtures and in-memory SQLite
- **CI/CD:** GitHub Actions runs tests on push to main/develop branches

## Email System

The backend uses Resend for email verification with an easy toggle:

**Toggle Email Verification:**
```bash
cd backend
./toggle_email_verification.sh  # Quick toggle script

# Manual configuration:
/home/keph/.fly/bin/flyctl secrets set EMAIL_DEV_MODE=true   # Disable verification
/home/keph/.fly/bin/flyctl secrets set EMAIL_DEV_MODE=false  # Enable verification
```

**Current Status:** Email verification is **DISABLED** for initial launch phase.

## Configuration Files

### Frontend Configuration
- `package.json` - Dependencies: React 19, TypeScript 5, Vite 7, Vitest 3
- `vite.config.ts` - Development server on port 3000
- `vitest.config.ts` - Test configuration with jsdom environment
- `tailwind.config.js` - Tailwind CSS with custom branding colors
- `vercel.json` - Vercel deployment configuration

### Backend Configuration
- `requirements.txt` - FastAPI 0.109, SQLAlchemy 2.0, asyncpg, JWT, Alembic
- `pytest.ini` - Test configuration with asyncio mode
- `fly.toml` - Fly.io deployment configuration
- `Dockerfile` - Container configuration for production

## Key Development Patterns

### Database Operations
Always use async/await with AsyncSession:
```python
async def get_user(db: AsyncSession, user_id: int):
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalar_one_or_none()
```

### Frontend API Calls
Use the centralized API client with proper error handling:
```typescript
try {
  const posts = await api.getPosts();
} catch (error) {
  if (error instanceof ApiError) {
    // Handle specific API errors
  }
}
```

### React Context Usage
Consume contexts with custom hooks:
```typescript
const { user, login, logout } = useAuth();
const { posts, loading, refreshPosts } = useData();
```

## Environment Variables

### Backend (Fly.io secrets)
- `DATABASE_URL` - PostgreSQL connection string
- `SECRET_KEY` - JWT signing secret
- `EMAIL_DEV_MODE` - Toggle email verification (true/false)
- `SMTP_PASSWORD` - Resend API key
- `FROM_EMAIL` - Sender email address
- `FRONTEND_URL` - Allowed CORS origin

### Frontend (Vercel environment)
- `VITE_API_URL` - Backend API URL (defaults to production)

## File Structure Insights

**Backend modular structure:**
- Models define database schema with relationships
- Schemas handle request/response serialization
- API modules group related endpoints (auth, posts, comments, users)
- Core modules provide shared utilities (security, config, dependencies)

**Frontend component hierarchy:**
- Layout component wraps all pages with header and navigation
- Pages handle route-specific logic and data fetching
- Components are reusable UI elements with props interfaces
- Contexts provide global state management across the component tree

## Common Development Tasks

### Adding New API Endpoint
1. Define Pydantic schema in `app/schemas/`
2. Add database model in `app/models/` if needed
3. Create endpoint in appropriate `app/api/` file
4. Add route to main.py router inclusion
5. Update frontend API client in `src/lib/api.ts`

### Database Schema Changes
1. Create migration: `alembic revision --autogenerate -m "description"`
2. Review generated migration in `alembic/versions/`
3. Apply migration: `alembic upgrade head`
4. Update model classes if needed

### Frontend Component Development
1. Follow existing component patterns in `src/components/`
2. Use TypeScript interfaces for props
3. Import colors from `src/config/branding.ts`
4. Add tests in `__tests__/` subdirectories

Last updated: 2025-07-25