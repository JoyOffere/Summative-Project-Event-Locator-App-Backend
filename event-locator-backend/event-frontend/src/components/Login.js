import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Login({ setIsAuthenticated }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await api.post('/login', { username, password });
            localStorage.setItem('token', response.data.token);
            setIsAuthenticated(true);
            navigate('/events');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="auth-form">
            <h2>Login</h2>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
            <p>
                Don't have an account? <a href="/register">Register</a>
            </p>
        </div>
    );
}

export default Login;