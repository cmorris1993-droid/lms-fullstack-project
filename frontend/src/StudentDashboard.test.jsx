import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';
import StudentDashboard from './components/StudentDashboard';

vi.mock('axios');

describe('StudentDashboard Component', () => {
  const mockUser = { username: 'TestStudent' };
  const mockToken = 'fake-token';

  it('renders the dashboard and shows the welcome message', async () => {
    axios.get.mockResolvedValueOnce({ data: [] }); 
    axios.get.mockResolvedValueOnce({ data: [] }); 

    render(<StudentDashboard token={mockToken} user={mockUser} />);

    expect(screen.getByText(/Loading your learning portal/i)).toBeDefined();

    await waitFor(() => {
      expect(screen.getByText(/Welcome back,/i)).toBeDefined();
      expect(screen.getByText(/TestStudent/i)).toBeDefined();
    });
  });

  it('shows empty state when no courses exist', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.get.mockResolvedValueOnce({ data: [] });

    render(<StudentDashboard token={mockToken} user={mockUser} />);

    await waitFor(() => {
      expect(screen.getByText(/You haven't enrolled in any courses yet/i)).toBeDefined();
    });
  });
});