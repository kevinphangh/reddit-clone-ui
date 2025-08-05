import { afterAll, afterEach, beforeAll, vi } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

// Mock window.confirm globally
global.confirm = vi.fn(() => true);

// Mock user for testing
export const mockUser = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  is_verified: true,
  created_at: '2024-01-01T00:00:00Z',
  points: { post: 10, comment: 5 }
};

// Mock API handlers
export const handlers = [
  // Auth endpoints
  http.post('https://via-forum.vercel.app/api/auth/login', async ({ request }) => {
    const body = await request.formData();
    const username = body.get('username');
    const password = body.get('password');
    
    if (username === 'testuser' && password === 'password123') {
      return HttpResponse.json({
        access_token: 'mock-token',
        token_type: 'bearer',
        user: mockUser
      });
    }
    
    return HttpResponse.json(
      { detail: 'Invalid credentials' },
      { status: 401 }
    );
  }),

  http.post('https://via-forum.vercel.app/api/auth/register', async ({ request }) => {
    return HttpResponse.json({
      message: 'User registered successfully'
    });
  }),

  http.post('https://via-forum.vercel.app/api/auth/verify-email', ({ request }) => {
    return HttpResponse.json({
      message: 'Email verified successfully'
    });
  }),

  http.get('https://via-forum.vercel.app/api/auth/me', ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (auth === 'Bearer mock-token' || auth === 'Bearer test-token') {
      return HttpResponse.json(mockUser);
    }
    return HttpResponse.json(
      { detail: 'Not authenticated' },
      { status: 401 }
    );
  }),

  // Posts endpoints
  http.get('https://via-forum.vercel.app/api/posts/', () => {
    return HttpResponse.json([
      {
        id: 1,
        title: 'Test Post',
        content: 'This is test content',
        author: mockUser,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        score: 5,
        comment_count: 2,
        user_vote: null,
        type: 'text',
        is_locked: false
      }
    ]);
  }),

  http.get('https://via-forum.vercel.app/api/posts/:id/', ({ params }) => {
    return HttpResponse.json({
      id: 1,
      title: 'Test Post',
      content: 'This is test content',
      author: mockUser,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      score: 5,
      comment_count: 2,
      user_vote: null,
      type: 'text',
      is_locked: false
    });
  }),

  http.post('https://via-forum.vercel.app/api/posts/', async ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth || (!auth.includes('mock-token') && !auth.includes('test-token'))) {
      return HttpResponse.json(
        { detail: 'Not authenticated' },
        { status: 401 }
      );
    }
    const body = await request.json();
    return HttpResponse.json({
      id: 2,
      title: body.title,
      content: body.content,
      type: body.type,
      author: mockUser,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      score: 0,
      comment_count: 0,
      user_vote: null,
      is_locked: false
    });
  }),

  http.put('https://via-forum.vercel.app/api/posts/:id/', async ({ request, params }) => {
    const auth = request.headers.get('Authorization');
    if (!auth || (!auth.includes('mock-token') && !auth.includes('test-token'))) {
      return HttpResponse.json(
        { detail: 'Not authenticated' },
        { status: 401 }
      );
    }
    const body = await request.json();
    return HttpResponse.json({
      id: parseInt(params.id as string),
      title: body.title,
      content: body.content,
      author: mockUser,
      updated_at: '2024-01-01T01:00:00Z',
      edited_at: '2024-01-01T01:00:00Z'
    });
  }),

  http.delete('https://via-forum.vercel.app/api/posts/:id/', ({ request, params }) => {
    const auth = request.headers.get('Authorization');
    if (!auth || (!auth.includes('mock-token') && !auth.includes('test-token'))) {
      return HttpResponse.json(
        { detail: 'Not authenticated' },
        { status: 401 }
      );
    }
    return HttpResponse.json({
      message: 'Post deleted successfully'
    });
  }),

  http.post('https://via-forum.vercel.app/api/posts/:id/vote', ({ request, params }) => {
    const auth = request.headers.get('Authorization');
    if (!auth || (!auth.includes('mock-token') && !auth.includes('test-token'))) {
      return HttpResponse.json(
        { detail: 'Not authenticated' },
        { status: 401 }
      );
    }
    return HttpResponse.json({
      score: 6,
      user_vote: 1
    });
  }),

  http.post('https://via-forum.vercel.app/api/posts/:id/save', ({ request, params }) => {
    const auth = request.headers.get('Authorization');
    if (!auth || (!auth.includes('mock-token') && !auth.includes('test-token'))) {
      return HttpResponse.json(
        { detail: 'Not authenticated' },
        { status: 401 }
      );
    }
    return HttpResponse.json({
      saved: true
    });
  }),

  // Comments endpoints
  http.get('https://via-forum.vercel.app/api/comments/post/:postId', ({ params }) => {
    return HttpResponse.json([
      {
        id: 1,
        body: 'Test comment',
        author: mockUser,
        post: { id: 1, title: 'Test Post' },
        parent_id: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        score: 3,
        depth: 0,
        is_deleted: false,
        user_vote: null,
        saved: false
      }
    ]);
  }),

  http.post('https://via-forum.vercel.app/api/comments/post/:postId', async ({ request, params }) => {
    const auth = request.headers.get('Authorization');
    if (!auth || (!auth.includes('mock-token') && !auth.includes('test-token'))) {
      return HttpResponse.json(
        { detail: 'Not authenticated' },
        { status: 401 }
      );
    }
    const body = await request.json();
    return HttpResponse.json({
      id: 2,
      body: body.body,
      parent_id: body.parent_id,
      author: mockUser,
      post: { id: parseInt(params.postId as string), title: 'Test Post' },
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      score: 0,
      depth: body.parent_id ? 1 : 0,
      is_deleted: false,
      user_vote: null,
      saved: false
    });
  }),

  http.put('https://via-forum.vercel.app/api/comments/:id', async ({ request, params }) => {
    const auth = request.headers.get('Authorization');
    if (!auth || (!auth.includes('mock-token') && !auth.includes('test-token'))) {
      return HttpResponse.json(
        { detail: 'Not authenticated' },
        { status: 401 }
      );
    }
    const body = await request.json();
    return HttpResponse.json({
      id: parseInt(params.id as string),
      body: body.body,
      updated_at: '2024-01-01T01:00:00Z',
      edited_at: '2024-01-01T01:00:00Z'
    });
  }),

  http.delete('https://via-forum.vercel.app/api/comments/:id', ({ request, params }) => {
    const auth = request.headers.get('Authorization');
    if (!auth || (!auth.includes('mock-token') && !auth.includes('test-token'))) {
      return HttpResponse.json(
        { detail: 'Not authenticated' },
        { status: 401 }
      );
    }
    return HttpResponse.json({
      message: 'Comment deleted successfully'
    });
  }),

  http.post('https://via-forum.vercel.app/api/comments/:id/vote', ({ request, params }) => {
    const auth = request.headers.get('Authorization');
    if (!auth || (!auth.includes('mock-token') && !auth.includes('test-token'))) {
      return HttpResponse.json(
        { detail: 'Not authenticated' },
        { status: 401 }
      );
    }
    return HttpResponse.json({
      score: 4,
      user_vote: 1
    });
  }),

  // Users endpoints
  http.get('https://via-forum.vercel.app/api/users/count', () => {
    return HttpResponse.json({ count: 42 });
  }),

  http.get('https://via-forum.vercel.app/api/users/:username', ({ params }) => {
    return HttpResponse.json(mockUser);
  }),

  http.get('https://via-forum.vercel.app/api/users/:username/posts', ({ params }) => {
    return HttpResponse.json([
      {
        id: 1,
        title: 'User Post',
        content: 'User content',
        author: mockUser,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        score: 5,
        comment_count: 2,
        user_vote: null,
        type: 'text',
        is_locked: false
      }
    ]);
  }),

  http.get('https://via-forum.vercel.app/api/users/:username/comments', ({ params }) => {
    return HttpResponse.json([
      {
        id: 1,
        body: 'User comment',
        author: mockUser,
        post: { id: 1, title: 'Test Post' },
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        score: 3,
        depth: 0,
        is_deleted: false
      }
    ]);
  }),
];

// Setup MSW server
export const server = setupServer(...handlers);

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reset handlers after each test
afterEach(() => server.resetHandlers());

// Clean up after all tests
afterAll(() => server.close());