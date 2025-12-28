import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios({
                method: 'post',
                url: 'http://127.0.0.1:8000/api-token-auth/',
                data: {
                    username: username,
                    password: password
                },
                headers: { 'Content-Type': 'application/json' }
            });

            const token = response.data.token;
            
            const profileResponse = await axios.get('http://127.0.0.1:8000/profile/', {
                headers: { Authorization: `Token ${token}` }
            });

            onLoginSuccess(profileResponse.data, token);

        } catch (err) {
            console.error("Login detail:", err.response?.data);
            setError('Unable to log in. Please check credentials or user status.');
        }
    };

    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f8f9fa'
    };

    const cardStyle = {
        padding: '40px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
    };

    const inputStyle = {
        width: '100%',
        padding: '12px',
        margin: '10px 0 20px 0',
        border: '1px solid #ddd',
        borderRadius: '4px',
        boxSizing: 'border-box'
    };

    const buttonStyle = {
        width: '100%',
        padding: '12px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold'
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>LMS Portal Login</h2>
                <form onSubmit={handleSubmit}>
                    <label>Username</label>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        style={inputStyle}
                        required 
                    />
                    <label>Password</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        style={inputStyle}
                        required 
                    />
                    {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}
                    <button type="submit" style={buttonStyle}>Sign In</button>
                </form>
            </div>
        </div>
    );
};

export default Login;