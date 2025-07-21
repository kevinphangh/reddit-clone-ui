import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PostCard } from '../PostCard';
import { render, mockPost } from '../../test/utils';


describe('PostCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders post information correctly', () => {
    render(<PostCard post={mockPost} />);
    
    expect(screen.getByText(mockPost.title)).toBeInTheDocument();
    expect(screen.getByText(mockPost.content!)).toBeInTheDocument();
    expect(screen.getByText(`af ${mockPost.author.username}`)).toBeInTheDocument();
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
    
    // Since user is not logged in, it should show confirm dialog
    expect(window.confirm).toHaveBeenCalledWith('Du skal være logget ind for at stemme. Vil du logge ind nu?');
  });

  it('handles downvote click', async () => {
    const user = userEvent.setup();
    render(<PostCard post={mockPost} />);
    
    const downvoteButton = screen.getByLabelText('Stem ned');
    await user.click(downvoteButton);
    
    // Since user is not logged in, it should show confirm dialog
    expect(window.confirm).toHaveBeenCalledWith('Du skal være logget ind for at stemme. Vil du logge ind nu?');
  });

  it('shows active vote state', () => {
    const postWithUpvote = { ...mockPost, user_vote: 1 };
    render(<PostCard post={postWithUpvote} />);
    
    const upvoteButton = screen.getByLabelText('Stem op');
    expect(upvoteButton).toHaveClass('text-gray-800');
  });

  it('navigates to post page on click', async () => {
    const user = userEvent.setup();
    render(<PostCard post={mockPost} />);
    
    const postLink = screen.getByText(mockPost.title);
    expect(postLink.closest('a')).toHaveAttribute('href', `/comments/${mockPost.id}`);
  });
});