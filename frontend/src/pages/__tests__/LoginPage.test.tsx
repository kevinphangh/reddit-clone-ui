import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginPage } from '../LoginPage';
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

describe('LoginPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders login form', () => {
    render(<LoginPage />);
    
    expect(screen.getByRole('heading', { name: /velkommen tilbage/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/brugernavn/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/adgangskode/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log ind/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    
    const submitButton = screen.getByRole('button', { name: /log ind/i });
    await user.click(submitButton);
    
    // Check for required field validation (browser default)
    const usernameInput = screen.getByLabelText(/brugernavn/i);
    const passwordInput = screen.getByLabelText(/adgangskode/i);
    
    expect(usernameInput).toBeRequired();
    expect(passwordInput).toBeRequired();
  });

  it('submits form with valid credentials', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    
    const usernameInput = screen.getByLabelText(/brugernavn/i);
    const passwordInput = screen.getByLabelText(/adgangskode/i);
    const submitButton = screen.getByRole('button', { name: /log ind/i });
    
    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('shows loading state during submission', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    
    const usernameInput = screen.getByLabelText(/brugernavn/i);
    const passwordInput = screen.getByLabelText(/adgangskode/i);
    const submitButton = screen.getByRole('button', { name: /log ind/i });
    
    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    expect(screen.getByText(/logger ind.../i)).toBeInTheDocument();
  });
});