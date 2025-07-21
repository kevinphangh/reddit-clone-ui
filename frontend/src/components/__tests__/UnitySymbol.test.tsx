import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { UnitySymbol } from '../UnitySymbol';

describe('UnitySymbol', () => {
  it('renders without crashing', () => {
    const { container } = render(<UnitySymbol />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('applies correct size classes', () => {
    const { container: small } = render(<UnitySymbol size="small" />);
    expect(small.firstChild).toHaveClass('w-8', 'h-8');

    const { container: medium } = render(<UnitySymbol size="medium" />);
    expect(medium.firstChild).toHaveClass('w-12', 'h-12');

    const { container: large } = render(<UnitySymbol size="large" />);
    expect(large.firstChild).toHaveClass('w-16', 'h-16');
  });

  it('renders two overlapping circles', () => {
    const { container } = render(<UnitySymbol />);
    const circles = container.querySelectorAll('circle');
    expect(circles).toHaveLength(2);
  });

  it('applies custom className', () => {
    const { container } = render(<UnitySymbol className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});