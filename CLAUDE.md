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

### Deployment Steps

1. **Navigate to backend directory:**
   ```bash
   cd /home/keph/projects/forum/backend
   ```

2. **Deploy to Fly.io:**
   ```bash
   ~/.fly/bin/fly deploy
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

- **Frontend Framework:** React + Vite + TypeScript
- **Backend Framework:** FastAPI + PostgreSQL
- **Frontend Host:** Vercel
- **Backend Host:** Fly.io
- **Frontend URL:** https://via-paedagoger.vercel.app
- **Backend API URL:** https://via-forum-api.fly.dev

## Common Issues

1. **Fly CLI not found:** Use full path `~/.fly/bin/fly`
2. **Vercel alias issues:** Always update to `via-paedagoger.vercel.app`
3. **CORS errors:** Backend is configured to accept requests from the Vercel domain

## Testing After Deployment

1. Visit https://via-paedagoger.vercel.app
2. Check member count is loading from API
3. Test user registration and login
4. Verify posts and comments work

Last updated: 2025-07-20