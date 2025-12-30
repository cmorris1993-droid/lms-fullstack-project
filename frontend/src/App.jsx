import React, { useState } from 'react';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';

const App = () => {
    const [auth, setAuth] = useState({
        token: localStorage.getItem('token'),
        role: localStorage.getItem('role') || '',
        username: localStorage.getItem('username') || ''
    });

    const handleLogin = (token, role, username) => {
        console.log("--- Login Data Received ---");
        console.log("Token:", token);
        console.log("Role:", role);
        console.log("Username:", username);

        const formattedRole = role ? role.toLowerCase() : '';
        
        localStorage.setItem('token', token);
        localStorage.setItem('role', formattedRole);
        localStorage.setItem('username', username);
        
        setAuth({ token, role: formattedRole, username });
    };

    const handleLogout = () => {
        localStorage.clear();
        setAuth({ token: null, role: '', username: '' });
    };

    const headerStyle = {
        backgroundColor: '#1a1f36',
        color: 'white',
        padding: '15px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        fontFamily: 'Segoe UI, sans-serif',
        position: 'sticky',
        top: 0,
        zIndex: 1000
    };

    const logoStyle = {
        fontSize: '22px',
        fontWeight: 'bold',
        letterSpacing: '1px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    };

    const logoutBtnStyle = {
        backgroundColor: '#d93025',
        color: 'white',
        border: 'none',
        padding: '8px 18px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '14px'
    };

    if (!auth.token) {
        return <Login onLogin={handleLogin} />;
    }

    const renderDashboard = () => {
        const role = auth.role.toLowerCase();
        if (role === 'admin') return <AdminDashboard token={auth.token} />;
        if (role === 'teacher') return <TeacherDashboard token={auth.token} />;
        if (role === 'student') return <StudentDashboard token={auth.token} user={{username: auth.username}} />;
        
        return (
            <div style={{padding: '40px', textAlign: 'center'}}>
                <h2>Role not recognized</h2>
                <p>The system sees your role as: "<strong>{auth.role}</strong>"</p>
                <button onClick={handleLogout} style={logoutBtnStyle}>Go Back to Login</button>
            </div>
        );
    };

    return (
        <div style={{ backgroundColor: '#f8f9fc', minHeight: '100vh' }}>
            <header style={headerStyle}>
                <div style={logoStyle}>
                    <div style={{ 
                        width: '32px', height: '32px', backgroundColor: '#1a73e8', borderRadius: '8px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px'
                    }}>C</div>
                    <span>CYAN-PRO LEARNING</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ textAlign: 'right', borderRight: '1px solid #3c4257', paddingRight: '20px' }}>
                        <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{auth.username}</div>
                        <div style={{ fontSize: '11px', color: '#9ea3ac', textTransform: 'uppercase' }}>{auth.role}</div>
                    </div>
                    <button onClick={handleLogout} style={logoutBtnStyle}>Logout</button>
                </div>
            </header>

            <main style={{ padding: '20px' }}>
                {renderDashboard()}
            </main>
        </div>
    );
};

export default App;