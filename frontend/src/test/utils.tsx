import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { NotificationProvider } from '../contexts/NotificationContext';
import { AuthProvider } from '../contexts/AuthContext';
import { DataProvider } from '../contexts/DataContext';
import { vi } from 'vitest';

// Mock NotificationContext  
vi.mock('../contexts/NotificationContext', () => ({
  NotificationProvider: ({ children }: { children: React.ReactNode }) => children,
  useNotification: () => ({
    showNotification: vi.fn(),
  }),
}));

// Don't mock contexts globally - let them work with test data

// Mock window.confirm for tests
(window as any).confirm = vi.fn(() => true);

// Mock user for testing
export const mockUser = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  cakeDay: new Date('2024-01-01'),
  is_active: true,
  is_verified: true,
  created_at: '2024-01-01T00:00:00Z',
  points: { post: 10, comment: 5 }
};

// Mock post for testing
export const mockPost = {
  id: 1,
  title: 'Test Post',
  content: 'This is a test post content',
  author: mockUser,
  created_at: '2024-01-01T00:00:00Z',
  createdAt: new Date('2024-01-01T00:00:00Z'),
  updated_at: '2024-01-01T00:00:00Z',
  updatedAt: new Date('2024-01-01T00:00:00Z'),
  edited_at: null,
  score: 5,
  comment_count: 2,
  commentCount: 2,
  is_locked: false,
  type: 'text' as const,
  user_vote: null,
  userVote: null,
  saved: false,
  subreddit: 'general',
  upvoteRatio: 0.8
};

// Custom render with providers
export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <BrowserRouter>
        <AuthProvider>
          <DataProvider>
            <NotificationProvider>
              {children}
            </NotificationProvider>
          </DataProvider>
        </AuthProvider>
      </BrowserRouter>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

export * from '@testing-library/react';
export { renderWithProviders as render };