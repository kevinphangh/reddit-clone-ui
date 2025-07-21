import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import { DataProvider } from '../../contexts/DataContext';
import { NotificationProvider } from '../../contexts/NotificationContext';
import { HomePage } from '../../pages/HomePage';
import { server } from '../../test/setup-integration';
import { http, HttpResponse } from 'msw';

function AppWrapper({ children }: { children: React.ReactNode }) {
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

describe('Posts Flow Integration', () => {
  it('displays posts on home page', async () => {
    render(
      <AppWrapper>
        <HomePage />
      </AppWrapper>
    );
    
    // Wait for posts to load
    await waitFor(() => {
      expect(screen.getByText('Test Post')).toBeInTheDocument();
    });
    
    // Check post details
    expect(screen.getByText('This is test content')).toBeInTheDocument();
    expect(screen.getByText('af testuser')).toBeInTheDocument();
  });

  it('handles voting on posts', async () => {
    const user = userEvent.setup();
    
    // Mock authenticated state
    server.use(
      http.get('/api/auth/me', () => {
        return HttpResponse.json({
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          is_verified: true
        });
      })
    );
    
    render(
      <AppWrapper>
        <HomePage />
      </AppWrapper>
    );
    
    // Wait for posts to load
    await waitFor(() => {
      expect(screen.getByText('Test Post')).toBeInTheDocument();
    });
    
    // Find and click upvote button
    const upvoteButton = screen.getByLabelText('Stem op');
    await user.click(upvoteButton);
    
    // Check that score updated
    await waitFor(() => {
      expect(screen.getByText('6')).toBeInTheDocument();
    });
  });

  it('shows login prompt when voting without auth', async () => {
    const user = userEvent.setup();
    
    render(
      <AppWrapper>
        <HomePage />
      </AppWrapper>
    );
    
    // Wait for posts to load
    await waitFor(() => {
      expect(screen.getByText('Test Post')).toBeInTheDocument();
    });
    
    // Find and click upvote button
    const upvoteButton = screen.getByLabelText('Stem op');
    await user.click(upvoteButton);
    
    // Check that confirm dialog was called
    expect(window.confirm).toHaveBeenCalledWith(
      'Du skal være logget ind for at stemme. Vil du logge ind nu?'
    );
  });
});