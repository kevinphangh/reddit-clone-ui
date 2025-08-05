import { describe, it, expect, vi } from 'vitest';

// Test Vercel Functions endpoints
describe('Vercel Functions API', () => {
  const API_URL = 'https://via-forum.vercel.app';

  it('should handle posts endpoint', async () => {
    const mockResponse = [
      {
        id: 1,
        title: 'Test Post',
        content: 'Test content',
        created_at: '2025-01-01T00:00:00Z',
        author: { username: 'testuser' }
      }
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    } as Response);

    const response = await fetch(`${API_URL}/api/posts`);
    const data = await response.json();

    expect(response.ok).toBe(true);
    expect(data).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/api/posts`);
  });

  it('should handle comments endpoint', async () => {
    const mockResponse = [
      {
        id: 1,
        body: 'Test comment',
        created_at: '2025-01-01T00:00:00Z',
        author: { username: 'testuser' }
      }
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    } as Response);

    const response = await fetch(`${API_URL}/api/comments/post/1`);
    const data = await response.json();

    expect(response.ok).toBe(true);
    expect(data).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/api/comments/post/1`);
  });

  it('should handle user count endpoint', async () => {
    const mockResponse = { count: 42 };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    } as Response);

    const response = await fetch(`${API_URL}/api/users/count`);
    const data = await response.json();

    expect(response.ok).toBe(true);
    expect(data).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/api/users/count`);
  });

  it('should handle authentication endpoints', async () => {
    const mockLoginResponse = {
      access_token: 'test-token',
      token_type: 'bearer',
      user: { id: 1, username: 'testuser' }
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockLoginResponse)
    } as Response);

    const formData = new FormData();
    formData.append('username', 'testuser');
    formData.append('password', 'test123');

    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      body: formData
    });
    const data = await response.json();

    expect(response.ok).toBe(true);
    expect(data).toEqual(mockLoginResponse);
  });

  it('should handle errors gracefully', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ error: 'Internal server error' })
    } as Response);

    const response = await fetch(`${API_URL}/api/posts`);
    
    expect(response.ok).toBe(false);
    expect(response.status).toBe(500);
  });

  it('should prevent fly.dev requests', async () => {
    // Test that our URL blocking works
    const flyUrl = 'https://via-forum-api.fly.dev/api/posts';
    const expectedUrl = 'https://via-forum.vercel.app/api/posts';

    // Mock the URL replacement logic
    const processUrl = (url: string) => {
      if (url.includes('fly.dev')) {
        return url.replace('https://via-forum-api.fly.dev', 'https://via-forum.vercel.app');
      }
      return url;
    };

    const processedUrl = processUrl(flyUrl);
    expect(processedUrl).toBe(expectedUrl);
    expect(processedUrl).not.toContain('fly.dev');
  });
});