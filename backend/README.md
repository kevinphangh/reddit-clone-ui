# VIA Pædagoger Backend API

Modern, high-performance backend API for VIA Pædagoger forum built with FastAPI, SQLAlchemy, and PostgreSQL. Features complete user authentication, post management, commenting system, and voting functionality.

## 🚀 Features

- **🔐 Secure Authentication**: JWT-based auth with user registration and login
- **📝 Post Management**: Full CRUD operations for forum posts
- **💬 Comment System**: Nested comments with replies and threading
- **🗳️ Voting System**: Upvote/downvote for posts and comments
- **👤 User Profiles**: User information and activity tracking
- **📊 Database Relations**: Optimized SQLAlchemy models with proper relationships
- **🔄 Async Support**: Full async/await for optimal performance
- **📖 Auto Documentation**: Interactive API docs with Swagger UI
- **🛡️ Security**: Input validation, CORS protection, and SQL injection prevention

## 🛠️ Tech Stack

- **Framework**: FastAPI (modern, fast Python web framework)
- **Database**: PostgreSQL with SQLAlchemy ORM (async)
- **Authentication**: JWT tokens with OAuth2 password flow
- **Validation**: Pydantic schemas for request/response validation
- **Migrations**: Alembic for database schema management
- **Server**: Uvicorn ASGI server
- **Deployment**: Optimized for Fly.io

## 📁 Project Structure

```
backend/
├── app/
│   ├── api/                 # API route handlers
│   │   ├── auth.py         # Authentication endpoints
│   │   ├── posts.py        # Post CRUD operations
│   │   ├── comments.py     # Comment management
│   │   └── users.py        # User profile endpoints
│   ├── core/               # Core functionality
│   │   ├── config.py       # Settings and configuration
│   │   ├── deps.py         # Dependencies and auth
│   │   ├── security.py     # Password hashing and JWT
│   │   └── voting.py       # Shared voting logic
│   ├── db/                 # Database configuration
│   │   └── database.py     # SQLAlchemy setup
│   ├── models/             # SQLAlchemy models
│   │   ├── user.py         # User model
│   │   ├── post.py         # Post model
│   │   ├── comment.py      # Comment model
│   │   ├── vote.py         # Vote model
│   │   └── saved_item.py   # Saved items model
│   └── schemas/            # Pydantic schemas
│       ├── auth.py         # Auth request/response schemas
│       ├── post.py         # Post schemas
│       ├── comment.py      # Comment schemas
│       └── user.py         # User schemas
├── alembic/                # Database migrations
├── requirements.txt        # Production dependencies
├── requirements-dev.txt    # Development dependencies (SQLite)
├── main.py                # Application entry point
├── init_db.py             # Database initialization script
└── .env                   # Environment variables
```

## 📦 Installation & Setup

### Prerequisites
- Python 3.11+
- PostgreSQL (for production) or SQLite (automatic for development)

### 1. Clone and setup environment
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements-dev.txt  # For development with SQLite
# OR
pip install -r requirements.txt      # For production with PostgreSQL
```

### 2. Environment configuration
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your settings
# For development, SQLite is configured by default
# For production, set your PostgreSQL DATABASE_URL
```

### 3. Initialize database
```bash
# Create database tables
python init_db.py
```

### 4. Run development server
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API will be available at http://localhost:8000

## 📖 API Documentation

When running, visit these auto-generated documentation endpoints:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user (OAuth2 compatible)
- `GET /api/auth/me` - Get current user info

### Posts
- `GET /api/posts` - List all posts (with pagination)
- `POST /api/posts` - Create new post
- `GET /api/posts/{id}` - Get specific post
- `PUT /api/posts/{id}` - Update post (owner only)
- `DELETE /api/posts/{id}` - Delete post (owner only)
- `POST /api/posts/{id}/vote` - Vote on post (1, -1, or 0)
- `POST /api/posts/{id}/save` - Save/unsave post

### Comments
- `GET /api/comments/post/{post_id}` - Get comments for post
- `POST /api/comments/post/{post_id}` - Create new comment
- `PUT /api/comments/{id}` - Update comment (owner only)
- `DELETE /api/comments/{id}` - Delete comment (owner only)
- `POST /api/comments/{id}/vote` - Vote on comment (1, -1, or 0)

### Users
- `GET /api/users/{username}` - Get user profile
- `GET /api/users/{username}/posts` - Get user's posts
- `GET /api/users/{username}/comments` - Get user's comments

### Health Check
- `GET /` - API status
- `GET /health` - Health check endpoint

## 🗄️ Database Models

### User
- Authentication and profile information
- Relationships to posts, comments, votes, and saved items

### Post
- Forum posts with title, content, and metadata
- Voting score and comment count tracking
- Soft delete support

### Comment
- Nested comment system with parent-child relationships
- Depth tracking for proper threading
- Reply system support

### Vote
- User voting on posts and comments
- Prevents duplicate votes per user per item
- Score calculation and tracking

### SavedItem
- User's saved posts and comments
- Personal bookmarking system

## 🔧 Available Commands

### Development
```bash
# Start development server with hot reload
uvicorn main:app --reload

# Initialize/reset database
python init_db.py

# Run with specific host/port
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Database Migrations
```bash
# Create new migration
alembic revision --autogenerate -m "Description of changes"

# Apply migrations
alembic upgrade head

# Check migration status
alembic current

# Downgrade migration
alembic downgrade -1
```

### Production
```bash
# Production server (no reload)
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## 🚀 Deployment

### Fly.io Deployment

1. **Install Fly CLI**
```bash
curl -L https://fly.io/install.sh | sh
```

2. **Login and initialize**
```bash
fly auth login
fly launch  # First time setup
```

3. **Create PostgreSQL database**
```bash
fly postgres create
fly postgres attach <postgres-app-name>
```

4. **Set environment secrets**
```bash
fly secrets set SECRET_KEY="your-super-secret-key-here"
fly secrets set FRONTEND_URL="https://your-frontend.vercel.app"
fly secrets set ENVIRONMENT="production"
```

5. **Deploy**
```bash
fly deploy
```

### Other Deployment Options
- **Heroku**: Use Procfile with `web: uvicorn main:app --host 0.0.0.0 --port $PORT`
- **DigitalOcean App Platform**: Configure with Python buildpack
- **Railway**: Connect GitHub repo and deploy automatically

## ⚙️ Environment Variables

### Required
- `SECRET_KEY` - Secret key for JWT tokens (generate with: `openssl rand -hex 32`)
- `DATABASE_URL` - Database connection string

### Optional
- `ALGORITHM` - JWT algorithm (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES` - Token expiration (default: 10080 = 7 days)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:5173)
- `ENVIRONMENT` - Environment setting (development/production)

### Example .env file
```bash
# Database (SQLite for development)
DATABASE_URL=sqlite+aiosqlite:///./test.db

# Database (PostgreSQL for production)
# DATABASE_URL=postgresql://user:password@localhost/via_forum

# Security
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# CORS
FRONTEND_URL=http://localhost:5173

# Environment
ENVIRONMENT=development
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Input Validation**: Pydantic schemas validate all requests
- **CORS Protection**: Configured for specific frontend domains
- **SQL Injection Prevention**: SQLAlchemy ORM prevents SQL injection
- **Rate Limiting**: Ready for rate limiting middleware (not implemented)

## 🧪 Testing

```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests (when implemented)
pytest

# Run with coverage
pytest --cov=app
```

## 🔍 Monitoring & Logging

The API includes comprehensive logging and is ready for monitoring:
- Structured logging with uvicorn
- Health check endpoints for monitoring
- Database connection monitoring
- Error tracking and reporting ready

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

---

*Fast, secure, and scalable backend for VIA Pædagoger forum*