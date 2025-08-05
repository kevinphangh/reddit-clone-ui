import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

class TestAuth:
    """Test authentication endpoints"""
    
    @pytest.mark.asyncio
    async def test_register_success(self, client: AsyncClient, db_session: AsyncSession):
        """Test successful user registration"""
        response = await client.post(
            "/api/auth/register",
            json={
                "username": "newuser",
                "email": "newuser@example.com",
                "password": "password123"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["username"] == "newuser"
        assert data["email"] == "newuser@example.com"
        # is_verified depends on EMAIL_DEV_MODE setting
        
    @pytest.mark.asyncio
    async def test_register_with_invalid_field(self, client: AsyncClient, db_session: AsyncSession):
        """Test registration fails with extra fields not in schema"""
        response = await client.post(
            "/api/auth/register",
            json={
                "username": "newuser2",
                "email": "newuser2@example.com",
                "password": "password123",
                "display_name": "Should Fail"  # This field doesn't exist
            }
        )
        assert response.status_code == 422  # Validation error
    
    @pytest.mark.asyncio
    async def test_register_duplicate_username(self, client: AsyncClient, test_user):
        """Test registration with duplicate username"""
        response = await client.post(
            "/api/auth/register",
            json={
                "username": test_user.username,
                "email": "different@example.com",
                "password": "password123"
            }
        )
        assert response.status_code == 400
        assert "Username already registered" in response.json()["detail"]
    
    @pytest.mark.asyncio
    async def test_register_duplicate_email(self, client: AsyncClient, test_user):
        """Test registration with duplicate email"""
        response = await client.post(
            "/api/auth/register",
            json={
                "username": "differentuser",
                "email": test_user.email,
                "password": "password123"
            }
        )
        assert response.status_code == 400
        assert "Email already registered" in response.json()["detail"]
    
    @pytest.mark.asyncio
    async def test_login_success(self, client: AsyncClient, test_user):
        """Test successful login"""
        response = await client.post(
            "/api/auth/login",
            data={
                "username": test_user.username,
                "password": "testpass123"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
    
    @pytest.mark.asyncio
    async def test_login_with_email(self, client: AsyncClient, test_user):
        """Test successful login with email instead of username"""
        response = await client.post(
            "/api/auth/login",
            data={
                "username": test_user.email,  # Using email in username field
                "password": "testpass123"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
    
    @pytest.mark.asyncio
    async def test_login_unverified_user(self, client: AsyncClient, db_session: AsyncSession):
        """Test login with unverified user - only applies when EMAIL_DEV_MODE is False"""
        from app.models import User
        from app.core.security import get_password_hash
        from app.core.config import settings
        
        # Skip test if EMAIL_DEV_MODE is enabled
        if hasattr(settings, 'EMAIL_DEV_MODE') and settings.EMAIL_DEV_MODE:
            pytest.skip("EMAIL_DEV_MODE is enabled, users are auto-verified")
        
        # Create unverified user
        user = User(
            username="unverified",
            email="unverified@example.com",
            hashed_password=get_password_hash("password123"),
            is_verified=False
        )
        db_session.add(user)
        await db_session.commit()
        
        response = await client.post(
            "/api/auth/login",
            data={
                "username": "unverified",
                "password": "password123"
            }
        )
        assert response.status_code == 403
        assert "Email not verified" in response.json()["detail"]
    
    @pytest.mark.asyncio
    async def test_login_invalid_credentials(self, client: AsyncClient, test_user):
        """Test login with invalid credentials"""
        response = await client.post(
            "/api/auth/login",
            data={
                "username": test_user.username,
                "password": "wrongpassword"
            }
        )
        assert response.status_code == 401
        assert "Incorrect username/email or password" in response.json()["detail"]
    
    @pytest.mark.asyncio
    async def test_verify_email(self, client: AsyncClient, db_session: AsyncSession):
        """Test email verification"""
        from app.models import User
        from app.core.security import get_password_hash
        import secrets
        from datetime import datetime, timedelta, timezone
        
        # Create user with verification token
        token = secrets.token_urlsafe(32)
        user = User(
            username="toverify",
            email="toverify@example.com",
            hashed_password=get_password_hash("password123"),
            is_verified=False,
            verification_token=token,
            verification_token_expires=datetime.now(timezone.utc) + timedelta(hours=24)
        )
        db_session.add(user)
        await db_session.commit()
        
        response = await client.post(
            "/api/auth/verify-email",
            params={"token": token}
        )
        assert response.status_code == 200
        assert response.json()["message"] == "Email verified successfully"
        
        # Check user is verified
        await db_session.refresh(user)
        assert user.is_verified == True
        assert user.verification_token is None