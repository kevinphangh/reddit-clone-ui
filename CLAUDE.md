# Claude Deployment Guide for VIA Forum

This guide contains deployment instructions for both frontend and backend of the VIA Forum project.

## Project Overview

VIA Pædagoger Forum - A community platform for pedagogy students at VIA University College.

**Live URLs:**
- Frontend: https://via-paedagoger.vercel.app (also https://via-forum.vercel.app)
- Backend API: https://via-forum-api.fly.dev

## Frontend Deployment (Vercel)

### Prerequisites
- npm installed
- Vercel CLI installed (already available in this environment)

### Deployment Steps

1. **Navigate to frontend directory:**
   ```bash
   cd /home/keph/projects/forum/frontend
   ```

2. **Build the frontend:**
   ```bash
   npm run build
   ```

3. **Deploy to Vercel production:**
   ```bash
   vercel --prod
   ```

### Important Notes
- The deployment automatically uses environment variables from production
- Build output is in the `dist/` directory
- Domain names configured: via-paedagoger.vercel.app and via-forum.vercel.app

## Backend Deployment (Fly.io)

### Prerequisites
- Fly CLI installed at: `/home/keph/.fly/bin/flyctl`
- Docker configuration in `Dockerfile`
- PostgreSQL database (managed by Fly.io)

### Deployment Steps

1. **Navigate to backend directory:**
   ```bash
   cd /home/keph/projects/forum/backend
   ```

2. **Deploy to Fly.io:**
   ```bash
   /home/keph/.fly/bin/flyctl deploy
   ```

### Email Configuration

The backend uses Resend for email verification with an easy toggle system:

#### Toggle Email Verification On/Off

```bash
# Quick toggle script (recommended)
cd /home/keph/projects/forum/backend
./toggle_email_verification.sh
```

#### Manual Configuration

```bash
# Disable email verification (for easy onboarding)
/home/keph/.fly/bin/flyctl secrets set EMAIL_DEV_MODE=true

# Enable email verification (for production security)
/home/keph/.fly/bin/flyctl secrets set EMAIL_DEV_MODE=false

# Other email settings (already configured)
/home/keph/.fly/bin/flyctl secrets set SMTP_PASSWORD=re_YOUR_API_KEY
/home/keph/.fly/bin/flyctl secrets set FROM_EMAIL=onboarding@resend.dev
```

**Current Status:** Email verification is **DISABLED** for initial launch phase.

**Recommendation:** Keep email verification disabled for the first few days to encourage user signups, then enable it to prevent spam.

### Database Management

- **Run migrations manually:**
  ```bash
  /home/keph/.fly/bin/flyctl ssh console -a via-forum-api -C 'python -c "
  import os
  import asyncio
  import asyncpg
  
  async def migrate():
      db_url = os.getenv(\"DATABASE_URL\", \"\").replace(\"postgres://\", \"postgresql://\", 1)
      conn = await asyncpg.connect(db_url)
      # Your SQL here
      await conn.close()
  
  asyncio.run(migrate())
  "'
  ```

- **Check logs:**
  ```bash
  /home/keph/.fly/bin/flyctl logs -a via-forum-api
  ```

## Quick Deploy Both

```bash
# Deploy Backend
cd /home/keph/projects/forum/backend && /home/keph/.fly/bin/flyctl deploy

# Deploy Frontend  
cd /home/keph/projects/forum/frontend && vercel --prod
```

## Design System

### Current Design (Danish Minimalist)
- **Primary Color:** Rose/beige (#ffb69e, #ffe3d8)
- **Secondary Color:** Soft coral tones
- **Typography:** Clean, no emojis
- **Symbol:** Unity symbol (two overlapping circles) representing togetherness
- **Border Radius:** Configurable in `src/config/branding.ts`

### Key Design Files
- `/frontend/src/config/branding.ts` - All colors and branding
- `/frontend/src/components/UnitySymbol.tsx` - Simple unity symbol
- `/frontend/tailwind.config.js` - Tailwind configuration

To change design elements:
1. Edit `branding.ts` for colors
2. Update `tailwind.config.js` to match
3. Adjust border radius values in both files

## Key Features Implemented

1. **Email Verification System**
   - New users must verify email before login
   - Uses Resend.com for email delivery
   - Prevents spam account creation

2. **Design System**
   - Centralized branding configuration
   - Danish minimalist aesthetic
   - Unity symbol instead of mascot
   - Configurable rounded corners

3. **User Features**
   - Registration with email verification
   - Login with JWT authentication
   - Create posts and comments
   - Upvote/downvote system
   - User profiles

4. **Technical Features**
   - Responsive design
   - Real-time user count
   - Character limits (100 for titles, 5000 for content)
   - CORS properly configured
   - Database migrations

## Common Issues and Solutions

1. **Email not sending:** Check EMAIL_DEV_MODE is false and Resend API key is set
2. **CORS errors:** Backend accepts requests from configured Vercel domains
3. **Database issues:** Use asyncpg for async operations, not psycopg2
4. **Fly CLI issues:** Always use full path `/home/keph/.fly/bin/flyctl`

## Testing After Deployment

1. Visit https://via-paedagoger.vercel.app
2. Register a new account and verify email works
3. Test login with verified account
4. Create a post and comment
5. Test voting functionality
6. Check responsive design on mobile

## Testing

### Frontend Tests
```bash
cd frontend
npm test -- --run                    # Run all tests once
npm test                             # Watch mode
npm test -- --run src/__tests__/integration/  # Integration tests only
npm run test:coverage                # With coverage report
```

**Test Structure:**
- Integration tests with MSW (Mock Service Worker) for API mocking
- Located in `src/__tests__/integration/`
- Uses real React components with mocked API responses

### Backend Tests
```bash
cd backend

# Activate virtual environment and run tests
source venv/bin/activate
python -m pytest tests/ -v

# Or use Docker (if available):
docker compose -f docker-compose.test.yml up --build --abort-on-container-exit
```

**Test Structure:**
- Async tests with pytest-asyncio
- Test fixtures in `tests/conftest.py`
- SQLite in-memory database for testing
- 20 tests covering auth, posts, and users endpoints

### CI/CD Pipeline
Tests run automatically on GitHub Actions when you push to `main` or `develop`.

## Development Commands

### Frontend
```bash
cd frontend
npm run dev          # Development server
npm run build        # Production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript checking
```

### Backend
```bash
cd backend
uvicorn main:app --reload  # Development server
alembic upgrade head       # Run migrations
```

## Environment Variables

### Frontend (automatic in Vercel)
- `VITE_API_URL`: https://via-forum-api.fly.dev

### Backend (Fly.io secrets)
- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: JWT secret
- `EMAIL_DEV_MODE`: false (production)
- `SMTP_PASSWORD`: Resend API key
- `FROM_EMAIL`: onboarding@resend.dev

## Future Domain Setup

When ready to use custom domain (e.g., viap.dk):
1. Add domain in Vercel dashboard
2. Configure DNS records
3. Verify domain in Resend
4. Update FROM_EMAIL in Fly.io

Last updated: 2025-07-21