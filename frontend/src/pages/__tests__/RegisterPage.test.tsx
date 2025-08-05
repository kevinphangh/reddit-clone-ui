import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { RegisterPage } from '../RegisterPage';
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

describe('RegisterPage', () => {
  it('renders registration form', () => {
    render(<RegisterPage />);
    
    expect(screen.getByRole('heading', { name: /bliv en del af fællesskabet/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/mindst 3 tegn/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/din@email.dk/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/mindst 6 tegn/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /bliv medlem af fællesskabet/i })).toBeInTheDocument();
  });

  it('has link to login page', async () => {
    render(<RegisterPage />);
    
    // Wait for the component to fully render
    const loginLink = await screen.findByRole('link', { name: /log ind her/i });
    expect(loginLink).toHaveAttribute('href', '/login');
  });
});