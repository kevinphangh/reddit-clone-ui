import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PostCard } from '../PostCard';
import { render, mockPost } from '../../test/utils';

// Mock voting function
const mockHandleVote = vi.fn();
vi.mock('../../contexts/DataContext', () => ({
  useData: () => ({
    handleVote: mockHandleVote,
    posts: [],
    loading: false,
    error: null,
  }),
}));

describe('PostCard', () => {
  beforeEach(() => {
    mockHandleVote.mockClear();
  });

  it('renders post information correctly', () => {
    render(<PostCard post={mockPost} />);
    
    expect(screen.getByText(mockPost.title)).toBeInTheDocument();
    expect(screen.getByText(mockPost.content!)).toBeInTheDocument();
    expect(screen.getByText(`u/${mockPost.author.username}`)).toBeInTheDocument();
    expect(screen.getByText(mockPost.score.toString())).toBeInTheDocument();
  });

  it('shows comment count', () => {
    render(<PostCard post={mockPost} />);
    
    expect(screen.getByText(`${mockPost.comment_count} kommentarer`)).toBeInTheDocument();
  });

  it('handles upvote click', async () => {
    const user = userEvent.setup();
    render(<PostCard post={mockPost} />);
    
    const upvoteButton = screen.getByLabelText('Stem op');
    await user.click(upvoteButton);
    
    expect(mockHandleVote).toHaveBeenCalledWith('post', mockPost.id, 1);
  });

  it('handles downvote click', async () => {
    const user = userEvent.setup();
    render(<PostCard post={mockPost} />);
    
    const downvoteButton = screen.getByLabelText('Stem ned');
    await user.click(downvoteButton);
    
    expect(mockHandleVote).toHaveBeenCalledWith('post', mockPost.id, -1);
  });

  it('shows active vote state', () => {
    const postWithUpvote = { ...mockPost, user_vote: 1 };
    render(<PostCard post={postWithUpvote} />);
    
    const upvoteButton = screen.getByLabelText('Stem op');
    expect(upvoteButton).toHaveClass('text-primary-600');
  });

  it('navigates to post page on click', async () => {
    const user = userEvent.setup();
    render(<PostCard post={mockPost} />);
    
    const postLink = screen.getByRole('link');
    expect(postLink).toHaveAttribute('href', `/post/${mockPost.id}`);
  });
});