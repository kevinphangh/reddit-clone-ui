# Alembic Database Migrations

This directory contains database migration files managed by Alembic.

## Configuration

The Alembic configuration is set up to work with both SQLite (local development) and PostgreSQL (production):

1. **Database URL**: The database URL is read from the `DATABASE_URL` environment variable
2. **Async Support**: The configuration automatically converts async database URLs to sync URLs for migrations:
   - `sqlite+aiosqlite://` → `sqlite://`
   - `postgresql+asyncpg://` → `postgresql://`
   - `postgres://` → `postgresql://` (for Heroku-style URLs)

## Running Migrations

### Local Development
```bash
# Set DATABASE_URL for SQLite
export DATABASE_URL="sqlite:///./app.db"

# Run migrations
alembic upgrade head

# Check current revision
alembic current

# Create a new migration
alembic revision --autogenerate -m "Description of changes"
```

### Production (Docker)
Migrations are automatically run when the container starts via the `start.sh` script.

## Files

- `env.py`: Configures Alembic to use the DATABASE_URL environment variable
- `script.py.mako`: Template for generating new migration files
- `versions/`: Contains all migration files
- `../alembic.ini`: Main Alembic configuration file