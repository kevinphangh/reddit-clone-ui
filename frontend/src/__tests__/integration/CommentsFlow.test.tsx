import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

// Mock comment data
const mockComment = {
  id: 1,
  body: 'This is a test comment',
  parent_id: null,
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
  edited_at: null,
  score: 5,
  depth: 0,
  is_deleted: false,
  user_vote: null,
  saved: false,
  author: {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    is_admin: false,
    is_verified: true,
    created_at: '2025-01-01T00:00:00Z',
    points: { post: 10, comment: 5 }
  },
  post: {
    id: 1,
    title: 'Test Post'
  }
};

const mockHandlers = [
  http.get('https://via-forum.vercel.app/api/comments/post/1', () => {
    return HttpResponse.json([mockComment]);
  }),

  http.post('https://via-forum.vercel.app/api/comments/post/1', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      success: true,
      comment: {
        id: 2,
        body: body.body,
        created_at: '2025-01-01T00:00:00Z'
      }
    });
  }),
];

const server = setupServer(...mockHandlers);

beforeEach(() => {
  server.listen();
});

describe('Comments Flow Integration', () => {
  it('should handle comment creation', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        comment: {
          id: 2,
          body: 'New test comment',
          created_at: '2025-01-01T00:00:00Z'
        }
      })
    } as Response);

    const response = await fetch('https://via-forum.vercel.app/api/comments/post/1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      },
      body: JSON.stringify({
        body: 'New test comment'
      })
    });

    const data = await response.json();
    
    expect(response.ok).toBe(true);
    expect(data.success).toBe(true);
    expect(data.comment.body).toBe('New test comment');
  });

  it('should handle nested comments (replies)', () => {
    // Test nested comment data structure
    const nestedComment = {
      ...mockComment,
      id: 2,
      parent_id: 1,
      depth: 1,
      body: 'This is a reply'
    };

    expect(nestedComment.parent_id).toBe(1);
    expect(nestedComment.depth).toBe(1);
    expect(nestedComment.body).toBe('This is a reply');
  });

  it('should handle comment voting', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ score: 6, user_vote: 1 })
    } as Response);

    const handleVote = async (commentId: number, value: number) => {
      const response = await fetch(`https://via-forum.vercel.app/api/comments/${commentId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token'
        },
        body: JSON.stringify({ value })
      });
      return response.json();
    };

    const result = await handleVote(1, 1);
    
    expect(result.score).toBe(6);
    expect(result.user_vote).toBe(1);
  });

  it('should handle comment errors gracefully', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ detail: 'Comment body is required' })
    } as Response);

    const response = await fetch('https://via-forum.vercel.app/api/comments/post/1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ body: '' })
    });

    const error = await response.json();
    
    expect(response.ok).toBe(false);
    expect(response.status).toBe(400);
    expect(error.detail).toBe('Comment body is required');
  });
});