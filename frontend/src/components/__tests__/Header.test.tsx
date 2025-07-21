import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Header } from '../Header';
import { AuthProvider } from '../../contexts/AuthContext';
import { DataProvider } from '../../contexts/DataContext';
import { NotificationProvider } from '../../contexts/NotificationContext';

describe('Header', () => {
  it('renders header with logo', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <DataProvider>
            <NotificationProvider>
              <Header />
            </NotificationProvider>
          </DataProvider>
        </AuthProvider>
      </BrowserRouter>
    );
    
    // Check for logo text
    expect(screen.getByText('VIA Pædagoger')).toBeInTheDocument();
  });

  it('shows login and register buttons when not authenticated', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <DataProvider>
            <NotificationProvider>
              <Header />
            </NotificationProvider>
          </DataProvider>
        </AuthProvider>
      </BrowserRouter>
    );
    
    // Check for auth buttons
    expect(screen.getByText('Log ind')).toBeInTheDocument();
    expect(screen.getByText('Tilmeld')).toBeInTheDocument();
  });
});