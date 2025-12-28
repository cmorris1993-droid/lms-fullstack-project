import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';

const App = () => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(!!token);

    useEffect(() => {
        if (token) {
            axios.get('http://127.0.0.1:8000/profile/', {
                headers: { Authorization: `Token ${token}` }
            })
            .then(res => {
                setUser(res.data);
                setLoading(false);
            })
            .catch(() => {
                handleLogout();
                setLoading(false);
            });
        }
    }, [token]);

    const handleLoginSuccess = (userData, userToken) => {
        localStorage.setItem('token', userToken);
        setToken(userToken);
        setUser(userData);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;

    if (!user) {
        return <Login onLoginSuccess={handleLoginSuccess} />;
    }

    const navStyle = {
        padding: '15px 30px',
        backgroundColor: '#ffffff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
    };

    const logoutButtonStyle = {
        padding: '8px 16px',
        backgroundColor: '#1a73e8',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s'
    };

    return (
        <div className="app-container" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <nav style={navStyle}>
                <span style={{ color: '#1a1f36', fontSize: '16px' }}>
                    Welcome, <strong>{user.username}</strong>
                </span>
                <button 
                    onClick={handleLogout} 
                    style={logoutButtonStyle}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#1557b0'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#1a73e8'}
                >
                    Logout
                </button>
            </nav>

            <main>
                {user.is_superuser ? (
                    <AdminDashboard token={token} />
                ) : user.is_staff ? (
                    <TeacherDashboard token={token} />
                ) : (
                    <StudentDashboard token={token} />
                )}
            </main>
        </div>
    );
};

export default App;