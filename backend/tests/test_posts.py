import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

class TestPosts:
    """Test posts endpoints"""
    
    @pytest.mark.asyncio
    async def test_get_posts(self, client: AsyncClient, test_post):
        """Test getting all posts"""
        response = await client.get("/api/posts/")
        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 1
        assert data[0]["title"] == test_post.title
    
    @pytest.mark.asyncio
    async def test_get_single_post(self, client: AsyncClient, test_post):
        """Test getting single post"""
        response = await client.get(f"/api/posts/{test_post.id}")
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == test_post.title
        assert data["content"] == test_post.content
    
    @pytest.mark.asyncio
    async def test_create_post_authenticated(self, client: AsyncClient, auth_headers):
        """Test creating post with authentication"""
        response = await client.post(
            "/api/posts/",
            json={
                "title": "New Test Post",
                "content": "This is new test content",
                "type": "text"
            },
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "New Test Post"
        assert data["content"] == "This is new test content"
    
    @pytest.mark.asyncio
    async def test_create_post_unauthenticated(self, client: AsyncClient):
        """Test creating post without authentication"""
        response = await client.post(
            "/api/posts/",
            json={
                "title": "New Test Post",
                "content": "This is new test content",
                "type": "text"
            }
        )
        assert response.status_code == 401
        assert "Not authenticated" in response.json()["detail"]
    
    @pytest.mark.asyncio
    async def test_create_post_title_too_long(self, client: AsyncClient, auth_headers):
        """Test creating post with title over 100 characters"""
        long_title = "x" * 101
        response = await client.post(
            "/api/posts/",
            json={
                "title": long_title,
                "content": "Test content",
                "type": "text"
            },
            headers=auth_headers
        )
        assert response.status_code == 422  # Validation error
    
    @pytest.mark.asyncio
    async def test_vote_post(self, client: AsyncClient, test_post, auth_headers):
        """Test voting on a post"""
        # Upvote
        response = await client.post(
            f"/api/posts/{test_post.id}/vote?vote_value=1",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["score"] == 1  # New post starts at 0, upvote makes it 1
        assert data["user_vote"] == 1
        
        # Change to downvote
        response = await client.post(
            f"/api/posts/{test_post.id}/vote?vote_value=-1",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["score"] == -1  # From 1 to -1 (change from upvote to downvote)
        assert data["user_vote"] == -1
        
        # Remove vote
        response = await client.post(
            f"/api/posts/{test_post.id}/vote?vote_value=0",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["score"] == 0  # Back to 0 (no votes)
        assert data["user_vote"] is None  # No vote = None
    
    @pytest.mark.asyncio
    async def test_delete_own_post(self, client: AsyncClient, test_post, auth_headers):
        """Test deleting own post"""
        response = await client.delete(
            f"/api/posts/{test_post.id}",
            headers=auth_headers
        )
        assert response.status_code == 200
        
        # Verify post is deleted
        response = await client.get(f"/api/posts/{test_post.id}")
        assert response.status_code == 404
    
    @pytest.mark.asyncio
    async def test_delete_other_user_post(self, client: AsyncClient, test_post, db_session: AsyncSession):
        """Test cannot delete other user's post"""
        from app.models import User
        from app.core.security import get_password_hash
        
        # Create another user
        other_user = User(
            username="otheruser",
            email="other@example.com",
            hashed_password=get_password_hash("password123"),
            is_verified=True
        )
        db_session.add(other_user)
        await db_session.commit()
        
        # Login as other user
        response = await client.post(
            "/api/auth/login",
            data={"username": "otheruser", "password": "password123"}
        )
        token = response.json()["access_token"]
        other_headers = {"Authorization": f"Bearer {token}"}
        
        # Try to delete first user's post
        response = await client.delete(
            f"/api/posts/{test_post.id}",
            headers=other_headers
        )
        assert response.status_code == 403
        assert "Not authorized" in response.json()["detail"]