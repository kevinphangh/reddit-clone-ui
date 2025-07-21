import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { HomePage } from '../HomePage';
import { render } from '../../test/utils';

// Mock the contexts
vi.mock('../../contexts/DataContext', async () => {
  const actual = await vi.importActual('../../contexts/DataContext');
  return {
    ...actual,
    useData: vi.fn(() => ({
      posts: [],
      loading: false,
      error: null,
    })),
  };
});

describe('HomePage', () => {
  it('renders loading state', async () => {
    const { useData } = vi.mocked(await import('../../contexts/DataContext'));
    useData.mockReturnValueOnce({
      posts: [],
      loading: true,
      error: null,
      refreshPosts: vi.fn(),
      createPost: vi.fn(),
      updatePost: vi.fn(),
      deletePost: vi.fn(),
      votePost: vi.fn(),
      comments: [],
      createComment: vi.fn(),
      voteComment: vi.fn(),
      deleteComment: vi.fn(),
    });

    render(<HomePage />);
    expect(screen.getByText('Indlæser...')).toBeInTheDocument();
  });

  it('renders error state', async () => {
    const { useData } = vi.mocked(await import('../../contexts/DataContext'));
    useData.mockReturnValueOnce({
      posts: [],
      loading: false,
      error: 'Network error',
      refreshPosts: vi.fn(),
      createPost: vi.fn(),
      updatePost: vi.fn(),
      deletePost: vi.fn(),
      votePost: vi.fn(),
      comments: [],
      createComment: vi.fn(),
      voteComment: vi.fn(),
      deleteComment: vi.fn(),
    });

    render(<HomePage />);
    expect(screen.getByText('Network error')).toBeInTheDocument();
  });

  it('renders empty state', async () => {
    const { useData } = vi.mocked(await import('../../contexts/DataContext'));
    useData.mockReturnValueOnce({
      posts: [],
      loading: false,
      error: null,
      refreshPosts: vi.fn(),
      createPost: vi.fn(),
      updatePost: vi.fn(),
      deletePost: vi.fn(),
      votePost: vi.fn(),
      comments: [],
      createComment: vi.fn(),
      voteComment: vi.fn(),
      deleteComment: vi.fn(),
    });

    render(<HomePage />);
    expect(screen.getByText(/Velkommen til fællesskabet/)).toBeInTheDocument();
    expect(screen.getByText(/Der er ikke nogen indlæg endnu/)).toBeInTheDocument();
  });

  it('renders posts when available', async () => {
    const mockPosts = [{
      id: '1',
      title: 'Test Post',
      content: 'Test content',
      author: {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        cakeDay: new Date(),
        is_active: true,
        is_verified: true,
        created_at: '2024-01-01T00:00:00Z',
        points: { post: 0, comment: 0 }
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      editedAt: undefined,
      score: 5,
      commentCount: 2,
      isLocked: false,
      type: 'text' as const,
      userVote: null,
      saved: false,
      subreddit: 'general',
      upvoteRatio: 0.8
    }];

    const { useData } = vi.mocked(await import('../../contexts/DataContext'));
    useData.mockReturnValueOnce({
      posts: mockPosts,
      loading: false,
      error: null,
      refreshPosts: vi.fn(),
      createPost: vi.fn(),
      updatePost: vi.fn(),
      deletePost: vi.fn(),
      votePost: vi.fn(),
      comments: [],
      createComment: vi.fn(),
      voteComment: vi.fn(),
      deleteComment: vi.fn(),
    });

    render(<HomePage />);
    expect(screen.getByText('Velkommen til fællesskabet')).toBeInTheDocument();
    // PostCard will be rendered but we don't need to test its internals here
  });
});