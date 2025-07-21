import pytest
from httpx import AsyncClient

class TestUsers:
    """Test users endpoints"""
    
    async def test_get_user_count(self, client: AsyncClient, test_user):
        """Test getting user count"""
        response = await client.get("/api/users/count")
        assert response.status_code == 200
        data = response.json()
        assert data["count"] >= 1
    
    async def test_get_user_profile(self, client: AsyncClient, test_user):
        """Test getting user profile"""
        response = await client.get(f"/api/users/{test_user.username}")
        assert response.status_code == 200
        data = response.json()
        assert data["username"] == test_user.username
        assert data["email"] == test_user.email
        assert "hashed_password" not in data
    
    async def test_get_nonexistent_user(self, client: AsyncClient):
        """Test getting non-existent user"""
        response = await client.get("/api/users/nonexistentuser")
        assert response.status_code == 404
        assert "User not found" in response.json()["detail"]
    
    async def test_get_user_posts(self, client: AsyncClient, test_user, test_post):
        """Test getting user's posts"""
        response = await client.get(f"/api/users/{test_user.username}/posts")
        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 1
        assert data[0]["title"] == test_post.title
        assert data[0]["author"]["username"] == test_user.username
    
    async def test_get_user_comments(self, client: AsyncClient, test_user, test_post, auth_headers):
        """Test getting user's comments"""
        # Create a comment first
        comment_response = await client.post(
            f"/api/comments/post/{test_post.id}",
            json={"body": "Test comment"},
            headers=auth_headers
        )
        assert comment_response.status_code == 200
        
        # Get user's comments
        response = await client.get(f"/api/users/{test_user.username}/comments")
        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 1
        assert data[0]["body"] == "Test comment"
        assert data[0]["author"]["username"] == test_user.username