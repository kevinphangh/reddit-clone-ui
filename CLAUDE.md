# Claude Deployment Guide for VIA Forum

This guide contains deployment instructions for both frontend and backend of the VIA Forum project.

## Frontend Deployment (Vercel)

The frontend is deployed to Vercel at: https://via-paedagoger.vercel.app

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

4. **Update the alias to use the correct domain:**
   ```bash
   vercel alias set [deployment-url] via-paedagoger.vercel.app
   ```
   Replace `[deployment-url]` with the URL from step 3.

### Important Notes
- Always use `via-paedagoger.vercel.app` as the production URL
- The deployment will automatically use environment variables from `vercel.json`
- Build output is in the `dist/` directory

## Backend Deployment (Fly.io)

The backend API is deployed to Fly.io at: https://via-forum-api.fly.dev

### Prerequisites
- Fly CLI installed at: `~/.fly/bin/fly`
- Docker configuration in `Dockerfile`
- PostgreSQL database attached (Fly.io Managed Postgres)

### Database Setup

The backend uses PostgreSQL hosted on Fly.io:
- Database was created using: `~/.fly/bin/fly postgres create --name via-forum-db`
- Database attached using: `~/.fly/bin/fly postgres attach via-forum-db --app via-forum-api`
- Connection string is automatically set as `DATABASE_URL` secret

### Deployment Steps

1. **Navigate to backend directory:**
   ```bash
   cd /home/keph/projects/forum/backend
   ```

2. **Deploy to Fly.io:**
   ```bash
   ~/.fly/bin/fly deploy
   ```

3. **Database migrations run automatically** during deployment via Dockerfile:
   ```dockerfile
   CMD alembic upgrade head && uvicorn main:app --host 0.0.0.0 --port ${PORT:-8080}
   ```

### Checking Deployment Status

- **View logs:**
  ```bash
  ~/.fly/bin/fly logs -a via-forum-api
  ```

- **Check app status:**
  ```bash
  ~/.fly/bin/fly status -a via-forum-api
  ```

- **View secrets (including DATABASE_URL):**
  ```bash
  ~/.fly/bin/fly secrets list -a via-forum-api
  ```

### Database Management

- **Connect to database:**
  ```bash
  ~/.fly/bin/fly postgres connect -a via-forum-db
  ```

- **Check users in database:**
  ```sql
  SELECT id, username, email, is_active FROM users;
  ```

### Testing Endpoints

Test if backend is working:
```bash
curl https://via-forum-api.fly.dev/api/users/count
```

## Quick Deploy Both

To deploy both frontend and backend:

```bash
# Deploy Backend
cd /home/keph/projects/forum/backend && ~/.fly/bin/fly deploy

# Deploy Frontend
cd /home/keph/projects/forum/frontend && npm run build && vercel --prod

# Update alias (replace with actual deployment URL)
vercel alias set [deployment-url] via-paedagoger.vercel.app
```

## Environment Details

- **Frontend Framework:** React + Vite + TypeScript + Tailwind CSS
- **Backend Framework:** FastAPI + SQLAlchemy + Alembic
- **Database:** PostgreSQL (Fly.io Managed Postgres)
- **Authentication:** JWT tokens
- **Frontend Host:** Vercel
- **Backend Host:** Fly.io
- **Frontend URL:** https://via-paedagoger.vercel.app
- **Backend API URL:** https://via-forum-api.fly.dev

## Key Features Implemented

1. **Typography System:** Consistent font sizes and styles throughout the interface
2. **User Registration:** With verification modal to ensure users can log in
3. **Dynamic Member Count:** Shows real registered users with localStorage fallback
4. **Character Limits:** 
   - Post titles: 100 characters
   - Post content: 5000 characters
5. **Proprietary License:** Changed from MIT to very private license

## Common Issues and Solutions

1. **Fly CLI not found:** Use full path `~/.fly/bin/fly`
2. **Vercel alias issues:** Always update to `via-paedagoger.vercel.app`
3. **CORS errors:** Backend is configured to accept requests from the Vercel domain
4. **ModuleNotFoundError psycopg2:** Added `psycopg2-binary==2.9.9` to requirements.txt
5. **Database connection issues:** Ensure DATABASE_URL secret is set via postgres attach

## Testing After Deployment

1. Visit https://via-paedagoger.vercel.app
2. Check member count is loading from API
3. Test user registration and login with verification
4. Create a post and verify character limits work
5. Verify posts and comments functionality

## Development Commands

### Linting and Type Checking
```bash
# Frontend
cd frontend
npm run lint
npm run type-check

# Backend
cd backend
# No linting commands set up yet
```

Last updated: 2025-07-20