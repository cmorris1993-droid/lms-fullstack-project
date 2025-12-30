import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Login from './components/Login';

describe('Login Component', () => {
  it('renders login form correctly', () => {
    render(<Login onLogin={() => {}} />);
    
    expect(screen.getByText(/LMS Portal Login/i)).toBeDefined();
    expect(screen.getByLabelText(/Username/i)).toBeDefined();
    expect(screen.getByLabelText(/Password/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeDefined();
  });
});