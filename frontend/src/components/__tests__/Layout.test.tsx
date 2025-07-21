import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Layout } from '../Layout';

// Simple test that doesn't require auth context
describe('Layout', () => {
  it('renders header with logo', () => {
    render(
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    );
    
    // Check for Unity Symbol which is always visible
    expect(screen.getByRole('img', { name: /unity symbol/i })).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    );
    
    // Check for navigation items
    expect(screen.getByText('Populært')).toBeInTheDocument();
    expect(screen.getByText('Nyt')).toBeInTheDocument();
  });
});