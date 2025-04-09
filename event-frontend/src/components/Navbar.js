import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// src/components/Navbar.js

function Navbar({ isAuthenticated, logout }) {
    const { t } = useTranslation();

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">{t('app_title')}</Link>
            </div>
            <div className="navbar-menu">
                {isAuthenticated ? (
                    <>
                        <Link to="/events" className="nav-link">{t('events')}</Link>
                        <Link to="/events/new" className="nav-link">{t('create_event')}</Link>
                        <button onClick={logout} className="nav-link logout-btn">{t('logout')}</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="nav-link">{t('login')}</Link>
                        <Link to="/register" className="nav-link">{t('register')}</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;