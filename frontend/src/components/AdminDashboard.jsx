import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = ({ token }) => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/users/', {
                    headers: { Authorization: `Token ${token}` }
                });
                setUsers(response.data);
            } catch (err) {
                setError('Failed to fetch users. Access denied.');
            }
        };
        fetchUsers();
    }, [token]);

    return (
        <div style={{ padding: '20px' }}>
            <h1>Admin Dashboard</h1>
            <p>Master User Management</p>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#eee', textAlign: 'left' }}>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Username</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Email</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u.id}>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{u.id}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{u.username}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{u.email}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                {u.is_superuser ? 'Admin' : u.is_staff ? 'Teacher' : 'Student'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;