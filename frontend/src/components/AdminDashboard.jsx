import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';

const AdminDashboard = ({ token }) => {
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState(null);
    const [editFormData, setEditFormData] = useState({ username: '', email: '', role: 'Student' });

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            const [userRes, courseRes] = await Promise.all([
                axios.get(`${API_URL}/users/`, {
                    headers: { Authorization: `Token ${token}` }
                }),
                axios.get(`${API_URL}/courses/`, {
                    headers: { Authorization: `Token ${token}` }
                })
            ]);
            setUsers(Array.isArray(userRes.data) ? userRes.data : []);
            setCourses(Array.isArray(courseRes.data) ? courseRes.data : []);
            setLoading(false);
        } catch (err) {
            console.error("Admin fetch error:", err);
            setLoading(false);
        }
    };

    const deleteUser = async (userId) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await axios.delete(`${API_URL}/users/${userId}/`, {
                headers: { Authorization: `Token ${token}` }
            });
            setUsers(users.filter(u => u.id !== userId));
        } catch (err) { console.error(err); }
    };

    const deleteCourse = async (courseId) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await axios.delete(`${API_URL}/courses/${courseId}/`, {
                headers: { Authorization: `Token ${token}` }
            });
            setCourses(courses.filter(c => c.id !== courseId));
        } catch (err) { console.error(err); }
    };

    const startEdit = (user) => {
        setEditingUser(user.id);
        setEditFormData({ 
            username: user.username, 
            email: user.email || '', 
            role: user.role 
        });
    };

    const saveEdit = async (userId) => {
        try {
            const payload = {
                username: editFormData.username,
                email: editFormData.email,
                is_superuser: editFormData.role === 'Admin',
                is_staff: editFormData.role === 'Admin' || editFormData.role === 'Teacher'
            };

            const res = await axios.patch(`${API_URL}/users/${userId}/`, payload, {
                headers: { Authorization: `Token ${token}` }
            });
            setUsers(users.map(u => u.id === userId ? res.data : u));
            setEditingUser(null);
        } catch (err) {
            console.error("Update error:", err);
            alert("Failed to update user.");
        }
    };

    const containerStyle = { padding: '40px', fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#f8f9fc', minHeight: '100vh' };
    const tableStyle = { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' };
    const thStyle = { backgroundColor: '#1a1f36', color: 'white', padding: '18px', textAlign: 'left', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' };
    const tdStyle = { padding: '16px', borderBottom: '1px solid #f0f0f0', verticalAlign: 'middle' };
    
    const inputStyle = {
        padding: '8px 12px',
        borderRadius: '6px',
        border: '1px solid #dcdfe6',
        fontSize: '14px',
        width: '100%',
        outline: 'none',
        transition: 'border-color 0.2s',
        boxSizing: 'border-box'
    };

    const selectStyle = { ...inputStyle, cursor: 'pointer', backgroundColor: '#fff' };

    const btnBase = { padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', transition: 'all 0.2s', marginRight: '8px' };
    const btnEdit = { ...btnBase, backgroundColor: '#e8f0fe', color: '#1a73e8' };
    const btnSave = { ...btnBase, backgroundColor: '#34a853', color: 'white' };
    const btnCancel = { ...btnBase, backgroundColor: '#f1f3f4', color: '#5f6368' };
    const btnDelete = { ...btnBase, backgroundColor: '#fce8e6', color: '#d93025', marginRight: '0' };

    const getRoleStyle = (role) => {
        if (role === 'Admin') return { backgroundColor: '#feecf0', color: '#cc0f35' };
        if (role === 'Teacher') return { backgroundColor: '#e8f0fe', color: '#1a73e8' };
        return { backgroundColor: '#e6f4ea', color: '#1e8e3e' };
    };

    if (loading) return <div style={containerStyle}>Loading Admin Dashboard...</div>;

    return (
        <div style={containerStyle}>
            <h1 style={{ color: '#1a1f36', fontSize: '28px', marginBottom: '8px' }}>Admin Dashboard</h1>
            <p style={{ color: '#5f6368', marginBottom: '32px' }}>Manage user permissions and course content</p>

            <div style={{ marginBottom: '48px' }}>
                <h2 style={{ fontSize: '20px', marginBottom: '16px', color: '#1a1f36' }}>User Management</h2>
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={{...thStyle, width: '80px'}}>ID</th>
                            <th style={thStyle}>Username</th>
                            <th style={thStyle}>Role</th>
                            <th style={{...thStyle, textAlign: 'right'}}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id} style={{ transition: 'background 0.2s' }}>
                                <td style={{...tdStyle, color: '#9ea3ac'}}>#{u.id}</td>
                                <td style={tdStyle}>
                                    {editingUser === u.id ? (
                                        <input 
                                            style={inputStyle}
                                            value={editFormData.username} 
                                            onChange={(e) => setEditFormData({...editFormData, username: e.target.value})}
                                        />
                                    ) : (
                                        <span style={{ fontWeight: '600', color: '#1a1f36' }}>{u.username}</span>
                                    )}
                                </td>
                                <td style={tdStyle}>
                                    {editingUser === u.id ? (
                                        <select 
                                            style={selectStyle}
                                            value={editFormData.role} 
                                            onChange={(e) => setEditFormData({...editFormData, role: e.target.value})}
                                        >
                                            <option value="Student">Student</option>
                                            <option value="Teacher">Teacher</option>
                                            <option value="Admin">Admin</option>
                                        </select>
                                    ) : (
                                        <span style={{ 
                                            padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold',
                                            ...getRoleStyle(u.role)
                                        }}>
                                            {u.role || 'Student'}
                                        </span>
                                    )}
                                </td>
                                <td style={{...tdStyle, textAlign: 'right'}}>
                                    {editingUser === u.id ? (
                                        <>
                                            <button onClick={() => saveEdit(u.id)} style={btnSave}>Save</button>
                                            <button onClick={() => setEditingUser(null)} style={btnCancel}>Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => startEdit(u)} style={btnEdit}>Edit</button>
                                            <button onClick={() => deleteUser(u.id)} style={btnDelete}>Delete</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div>
                <h2 style={{ fontSize: '20px', marginBottom: '16px', color: '#1a1f36' }}>Course Overview</h2>
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={thStyle}>Title</th>
                            <th style={thStyle}>Instructor</th>
                            <th style={{...thStyle, textAlign: 'right'}}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map(c => (
                            <tr key={c.id}>
                                <td style={{...tdStyle, fontWeight: '600'}}>{c.title}</td>
                                <td style={tdStyle}>{c.teacher_name}</td>
                                <td style={{...tdStyle, textAlign: 'right'}}>
                                    <button onClick={() => deleteCourse(c.id)} style={btnDelete}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;