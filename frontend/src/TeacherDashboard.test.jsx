import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';
import TeacherDashboard from './components/TeacherDashboard';

vi.mock('axios');

describe('TeacherDashboard Component', () => {
    const mockToken = 'fake-teacher-token';

    it('renders the teacher portal and shows the management console', async () => {
        axios.get.mockResolvedValueOnce({ data: [] });

        render(<TeacherDashboard token={mockToken} />);

        expect(screen.getByText(/Loading.../i)).toBeDefined();

        await waitFor(() => {
            expect(screen.getByText(/Teacher Management Console/i)).toBeDefined();
            expect(screen.getByText(/Create New Course/i)).toBeDefined();
        });
    });

    it('displays courses and allows clicking Manage Lessons', async () => {
        const mockCourses = [
            { id: 1, title: 'React for Teachers', description: 'Testing Guide', lessons: [] }
        ];
        axios.get.mockResolvedValueOnce({ data: mockCourses });

        render(<TeacherDashboard token={mockToken} />);

        const courseTitle = await screen.findByText(/React for Teachers/i);
        expect(courseTitle).toBeDefined();

        const manageBtn = screen.getByRole('button', { name: /manage lessons/i });
        fireEvent.click(manageBtn);

        await waitFor(() => {
            expect(screen.getByText(/Back to All Courses/i)).toBeDefined();
            expect(screen.getByText(/Add New Lesson/i)).toBeDefined();
        });
    });

    it('shows the delete button for existing courses', async () => {
        const mockCourses = [
            { id: 99, title: 'Old Course', description: 'To be deleted', lessons: [] }
        ];
        axios.get.mockResolvedValueOnce({ data: mockCourses });

        render(<TeacherDashboard token={mockToken} />);

        const deleteButtons = await screen.findAllByRole('button', { name: /delete/i });
        expect(deleteButtons.length).toBeGreaterThan(0);
    });
});