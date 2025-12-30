import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';
import AdminDashboard from './components/AdminDashboard';

vi.mock('axios');

describe('AdminDashboard Component', () => {
    const mockToken = 'fake-admin-token';

    it('renders the admin portal and shows both management sections', async () => {
        axios.get.mockResolvedValueOnce({ data: [] }); 
        axios.get.mockResolvedValueOnce({ data: [] }); 

        render(<AdminDashboard token={mockToken} />);

        expect(screen.getByText(/Loading Admin Dashboard.../i)).toBeDefined();

        await waitFor(() => {
            expect(screen.getByText(/Admin Dashboard/i)).toBeDefined();
            expect(screen.getByText(/User Management/i)).toBeDefined();
            expect(screen.getByText(/Course Overview/i)).toBeDefined();
        });
    });

    it('displays user data and enters edit mode', async () => {
        const mockUsers = [{ id: 1, username: 'StudentUser', role: 'Student' }];
        const mockCourses = [];
        
        axios.get.mockResolvedValueOnce({ data: mockUsers });
        axios.get.mockResolvedValueOnce({ data: mockCourses });

        render(<AdminDashboard token={mockToken} />);

        const usernameDisplay = await screen.findByText(/StudentUser/i);
        expect(usernameDisplay).toBeDefined();

        const editBtn = screen.getByRole('button', { name: /edit/i });
        fireEvent.click(editBtn);

        expect(screen.getByDisplayValue(/StudentUser/i)).toBeDefined();
        expect(screen.getByRole('button', { name: /save/i })).toBeDefined();
    });

    it('displays course data correctly in the overview table', async () => {
        const mockUsers = [];
        const mockCourses = [{ id: 10, title: 'Global Admin Course', teacher_name: 'Super Admin' }];
        
        axios.get.mockResolvedValueOnce({ data: mockUsers });
        axios.get.mockResolvedValueOnce({ data: mockCourses });

        render(<AdminDashboard token={mockToken} />);

        await waitFor(() => {
            expect(screen.getByText(/Global Admin Course/i)).toBeDefined();
            expect(screen.getByText(/Super Admin/i)).toBeDefined();
        });

        const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
        expect(deleteButtons.length).toBeGreaterThan(0);
    });
});