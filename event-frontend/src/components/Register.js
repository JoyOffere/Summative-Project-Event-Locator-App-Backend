import React, { useState } from "react";
import api from "../services/api";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function Register({ setIsAuthenticated }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const handleGetLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    setLatitude(position.coords.latitude);
                    setLongitude(position.coords.longitude);
                },
                error => {
                    setError(t('geolocation_error', { message: error.message }));
                }
            );
        } else {
            setError(t('geolocation_not_supported'));
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        if (!latitude || !longitude) {
            setError(t('location_required'));
            return;
        }
        try {
            await api.post('/register', { username, password, latitude, longitude }, {
                headers: { 'Accept-Language': i18n.language },
            });
            const loginResponse = await api.post('/login', { username, password }, {
                headers: { 'Accept-Language': i18n.language },
            });
            localStorage.setItem('token', loginResponse.data.token);
            setIsAuthenticated(true);
            navigate('/events');
        } catch (err) {
            setError(err.response?.data?.error || t('registration_failed'));
        }
    };

    return (
        <div className="auth-form">
            <h2>{t('register')}</h2>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>{t('username')}</label>
                    <input
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>{t('password')}</label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>{t('location')}</label>
                    <div className="location-input">
                        <div>
                            <input
                                type="number"
                                placeholder={t('latitude')}
                                value={latitude}
                                onChange={e => setLatitude(e.target.value)}
                                step="any"
                                required
                            />
                            <input
                                type="number"
                                placeholder={t('longitude')}
                                value={longitude}
                                onChange={e => setLongitude(e.target.value)}
                                step="any"
                                required
                            />
                        </div>
                        <button type="button" onClick={handleGetLocation} className="btn btn-secondary">
                            {t('get_current_location')}
                        </button>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">
                    {t('register')}
                </button>
            </form>
            <p>
                {t('have_account')} <a href="/login">{t('login')}</a>
            </p>
        </div>
    );
}

export default Register;