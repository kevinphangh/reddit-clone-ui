import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SubmitPage } from '../SubmitPage';
import { render } from '../../test/utils';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock useData
vi.mock('../../contexts/DataContext', async () => {
  const actual = await vi.importActual('../../contexts/DataContext');
  return {
    ...actual,
    useData: () => ({
      createPost: vi.fn().mockResolvedValue({ id: '1' }),
    }),
  };
});

// Mock useAuth
vi.mock('../../contexts/AuthContext', async () => {
  const actual = await vi.importActual('../../contexts/AuthContext');
  return {
    ...actual,
    useAuth: () => ({
      isLoggedIn: true,
      user: { username: 'testuser' },
    }),
  };
});

describe('SubmitPage', () => {
  it('renders create post form for logged in users', () => {
    render(<SubmitPage />);
    
    expect(screen.getByRole('heading', { name: /del dine tanker med fællesskabet/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/hvad handler dit indlæg om/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /del med fællesskabet/i })).toBeInTheDocument();
  });

});