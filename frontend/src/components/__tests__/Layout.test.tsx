import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Layout } from '../Layout';
import { AuthProvider } from '../../contexts/AuthContext';
import { DataProvider } from '../../contexts/DataContext';
import { NotificationProvider } from '../../contexts/NotificationContext';

// Simple test that doesn't require auth context
describe('Layout', () => {
  it('renders header with logo', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <DataProvider>
            <NotificationProvider>
              <Layout>
                <div>Test content</div>
              </Layout>
            </NotificationProvider>
          </DataProvider>
        </AuthProvider>
      </BrowserRouter>
    );
    
    // Check for VIA Pædagoger text which is always visible
    expect(screen.getByText('VIA Pædagoger')).toBeInTheDocument();
  });

  it('renders children content', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <DataProvider>
            <NotificationProvider>
              <Layout>
                <div>Test content</div>
              </Layout>
            </NotificationProvider>
          </DataProvider>
        </AuthProvider>
      </BrowserRouter>
    );
    
    // Check that children are rendered
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });
});