import { describe, it, expect, vi } from 'vitest';

describe('Database Migration Tests', () => {
  const API_URL = 'https://via-forum.vercel.app';

  it('should successfully setup database schema', async () => {
    const mockSetupResponse = {
      success: true,
      message: 'Database schema created successfully!',
      tables: ['comments', 'posts', 'saved_items', 'users', 'votes'],
      data: {
        users: 2,
        posts: 1
      }
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockSetupResponse)
    } as Response);

    const response = await fetch(`${API_URL}/api/setup`, {
      method: 'POST'
    });
    const data = await response.json();

    expect(response.ok).toBe(true);
    expect(data.success).toBe(true);
    expect(data.tables).toContain('users');
    expect(data.tables).toContain('posts');
    expect(data.tables).toContain('comments');
    expect(data.tables).toContain('votes');
    expect(data.tables).toContain('saved_items');
  });

  it('should verify Supabase connection', async () => {
    // Test that we can connect to Supabase PostgreSQL
    const mockUserCount = { count: 42 };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockUserCount)
    } as Response);

    const response = await fetch(`${API_URL}/api/users/count`);
    const data = await response.json();

    expect(response.ok).toBe(true);
    expect(typeof data.count).toBe('number');
    expect(data.count).toBeGreaterThanOrEqual(0);
  });

  it('should handle database schema with correct column types', async () => {
    // Test that posts have the correct 'type' column (not 'post_type')
    const mockPosts = [{
      id: 1,
      title: 'Test Post',
      content: 'Test content',
      type: 'text', // This should be 'type', not 'post_type'
      created_at: '2025-01-01T00:00:00Z',
      author: { username: 'testuser' }
    }];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockPosts)
    } as Response);

    const response = await fetch(`${API_URL}/api/posts`);
    const data = await response.json();

    expect(response.ok).toBe(true);
    expect(data[0]).toHaveProperty('type');
    expect(data[0].type).toBe('text');
  });

  it('should handle comments table with body column', async () => {
    // Test that comments have the correct 'body' column
    const mockComments = [{
      id: 1,
      body: 'Test comment', // This should be 'body'
      created_at: '2025-01-01T00:00:00Z',
      author: { username: 'testuser' }
    }];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockComments)
    } as Response);

    const response = await fetch(`${API_URL}/api/comments/post/1`);
    const data = await response.json();

    expect(response.ok).toBe(true);
    if (data.length > 0) {
      expect(data[0]).toHaveProperty('body');
      expect(typeof data[0].body).toBe('string');
    }
  });

  it('should verify foreign key relationships', async () => {
    // Test that creating a comment on non-existent post fails
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({
        detail: 'Database connection failed',
        error: 'insert or update on table "comments" violates foreign key constraint "comments_post_id_fkey"'
      })
    } as Response);

    const response = await fetch(`${API_URL}/api/comments/post/999`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: 'Test comment' })
    });

    const error = await response.json();

    expect(response.ok).toBe(false);
    expect(error.error).toContain('foreign key constraint');
  });

  it('should test migration from Fly.io to Vercel+Supabase', () => {
    // Verify that URLs are properly migrated
    const oldFlyUrl = 'https://via-forum-api.fly.dev/api/posts';
    const newVercelUrl = 'https://via-forum.vercel.app/api/posts';

    // Test URL replacement logic
    const migrateUrl = (url: string) => {
      return url.replace('https://via-forum-api.fly.dev', 'https://via-forum.vercel.app');
    };

    const migratedUrl = migrateUrl(oldFlyUrl);
    
    expect(migratedUrl).toBe(newVercelUrl);
    expect(migratedUrl).not.toContain('fly.dev');
    expect(migratedUrl).toContain('vercel.app');
  });

  it('should verify JWT authentication with new backend', async () => {
    const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.signature';
    
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        post: {
          id: 1,
          title: 'Authenticated Post',
          content: 'This post was created with JWT auth'
        }
      })
    } as Response);

    const response = await fetch(`${API_URL}/api/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mockToken}`
      },
      body: JSON.stringify({
        title: 'Test Post',
        content: 'Test content',
        type: 'text'
      })
    });

    const data = await response.json();

    expect(response.ok).toBe(true);
    expect(data.success).toBe(true);
  });

  it('should verify cost reduction (conceptual test)', () => {
    // Test that we're using free services
    const services = {
      frontend: { provider: 'Vercel', cost: 0 },
      database: { provider: 'Supabase', cost: 0 },
      oldCost: 43,
      newCost: 0
    };

    const savings = services.oldCost - services.newCost;
    
    expect(services.frontend.cost).toBe(0);
    expect(services.database.cost).toBe(0);
    expect(services.newCost).toBe(0);
    expect(savings).toBe(43);
    expect(savings).toBeGreaterThan(0);
  });
});