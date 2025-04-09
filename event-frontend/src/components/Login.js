import React, { useState } from "react";
import api from "../services/api";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function Login({ setIsAuthenticated }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.post('/login', { username, password }, {
                headers: { 'Accept-Language': i18n.language },
            });
            localStorage.setItem('token', response.data.token);
            setIsAuthenticated(true);
            navigate('/events');
        } catch (err) {
            setError(err.response?.data?.error || t('login_failed'));
        }
    };

    return (
        <div className="auth-form">
            <h2>{t('login')}</h2>
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
                <button type="submit" className="btn btn-primary">
                    {t('login')}
                </button>
            </form>
            <p>
                {t('no_account')} <a href="/register">{t('register')}</a>
            </p>
        </div>
    );
}

export default Login;