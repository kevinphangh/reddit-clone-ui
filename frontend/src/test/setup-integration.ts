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

  http.get('https://via-forum.vercel.app/api/auth/me', ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (auth === 'Bearer mock-token') {
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

  http.post('https://via-forum.vercel.app/api/posts/:id/vote', ({ request, params }) => {
    const auth = request.headers.get('Authorization');
    if (!auth || auth !== 'Bearer mock-token') {
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

  // Users endpoints
  http.get('https://via-forum.vercel.app/api/users/count', () => {
    return HttpResponse.json({ count: 42 });
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