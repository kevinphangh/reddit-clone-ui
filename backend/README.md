# VIA Pædagoger Backend

Backend API for VIA Pædagoger forum built with FastAPI and PostgreSQL.

## Tech Stack

- **Framework**: FastAPI
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT tokens
- **Async**: Full async/await support
- **Deployment**: Fly.io ready

## Setup

### 1. Create virtual environment
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Setup environment variables
```bash
cp .env.example .env
# Edit .env with your database credentials
```

### 4. Setup PostgreSQL database
```bash
# Create database
createdb via_forum

# Run migrations
alembic upgrade head
```

### 5. Run development server
```bash
uvicorn main:app --reload
```

API will be available at http://localhost:8000

## API Documentation

When running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Deployment to Fly.io

1. Install Fly CLI: https://fly.io/docs/hands-on/install-flyctl/

2. Login to Fly:
```bash
flyctl auth login
```

3. Create Fly app:
```bash
flyctl launch
```

4. Create PostgreSQL database:
```bash
flyctl postgres create
flyctl postgres attach <postgres-app-name>
```

5. Set secrets:
```bash
flyctl secrets set SECRET_KEY="your-secret-key"
flyctl secrets set FRONTEND_URL="https://your-frontend.vercel.app"
```

6. Deploy:
```bash
flyctl deploy
```

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string
- `SECRET_KEY` - Secret key for JWT tokens
- `ALGORITHM` - JWT algorithm (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES` - Token expiration time
- `FRONTEND_URL` - Frontend URL for CORS
- `ENVIRONMENT` - development/production