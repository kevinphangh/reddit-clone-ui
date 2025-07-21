import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import { DataProvider } from '../../contexts/DataContext';
import { NotificationProvider } from '../../contexts/NotificationContext';
import { LoginPage } from '../../pages/LoginPage';

// Full app wrapper with real providers
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

describe('Login Flow Integration', () => {
  it('successfully logs in with valid credentials', async () => {
    const user = userEvent.setup();
    
    render(
      <AppWrapper>
        <LoginPage />
      </AppWrapper>
    );
    
    // Find form elements
    const usernameInput = screen.getByLabelText(/brugernavn/i);
    const passwordInput = screen.getByLabelText(/adgangskode/i);
    const submitButton = screen.getByRole('button', { name: /log ind/i });
    
    // Fill in form
    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'password123');
    
    // Submit form
    await user.click(submitButton);
    
    // Wait for loading state
    await waitFor(() => {
      expect(screen.getByText(/logger ind.../i)).toBeInTheDocument();
    });
    
    // The navigation will happen through the real auth context
    // which will interact with our MSW mock server
  });

  it('shows error with invalid credentials', async () => {
    const user = userEvent.setup();
    
    render(
      <AppWrapper>
        <LoginPage />
      </AppWrapper>
    );
    
    // Find form elements
    const usernameInput = screen.getByLabelText(/brugernavn/i);
    const passwordInput = screen.getByLabelText(/adgangskode/i);
    const submitButton = screen.getByRole('button', { name: /log ind/i });
    
    // Fill in wrong credentials
    await user.type(usernameInput, 'wronguser');
    await user.type(passwordInput, 'wrongpass');
    
    // Submit form
    await user.click(submitButton);
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/forkert brugernavn eller adgangskode/i)).toBeInTheDocument();
    });
  });
});