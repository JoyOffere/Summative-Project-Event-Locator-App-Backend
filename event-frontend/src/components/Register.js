import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Register({ setIsAuthenticated }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleGetLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLatitude(position.coords.latitude);
                    setLongitude(position.coords.longitude);
                },
                (error) => {
                    setError(`Geolocation error: ${error.message}`);
                }
            );
        } else {
            setError('Geolocation is not supported by this browser');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!latitude || !longitude) {
            setError('Please provide your location');
            return;
        }

        try {
            await api.post('/register', { username, password, latitude, longitude });
            const loginResponse = await api.post('/login', { username, password });
            localStorage.setItem('token', loginResponse.data.token);
            setIsAuthenticated(true);
            navigate('/events');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="auth-form">
            <h2>Register</h2>
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
                <div className="form-group">
                    <label>Location</label>
                    <div className="location-input">
                        <div>
                            <input
                                type="number"
                                placeholder="Latitude"
                                value={latitude}
                                onChange={(e) => setLatitude(e.target.value)}
                                step="any"
                                required
                            />
                            <input
                                type="number"
                                placeholder="Longitude"
                                value={longitude}
                                onChange={(e) => setLongitude(e.target.value)}
                                step="any"
                                required
                            />
                        </div>
                        <button type="button" onClick={handleGetLocation} className="btn btn-secondary">
                            Get Current Location
                        </button>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">Register</button>
            </form>
            <p>
                Already have an account? <a href="/login">Login</a>
            </p>
        </div>
    );
}

export default Register;