import "./App.css";
import EventDetail from "./components/EventDetail";
import EventForm from "./components/EventForm";
import EventList from "./components/EventList";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Notification from "./components/Notification";
import React, { useEffect, useState } from "react";
import Register from "./components/Register";
import { useTranslation } from "react-i18next";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";

// src/App.js

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <Router>
            <div className="app">
                <Navbar isAuthenticated={isAuthenticated} logout={logout} />
                <div className="language-switcher">
                    <select onChange={(e) => changeLanguage(e.target.value)} defaultValue={i18n.language}>
                        <option value="en">English</option>
                        <option value="fr">French</option>
                    </select>
                </div>
                {isAuthenticated && <Notification />}
                <div className="container">
                    <h1>{t('welcome')}</h1>
                    <Routes>
                        <Route
                            path="/login"
                            element={isAuthenticated ? <Navigate to="/events" /> : <Login setIsAuthenticated={setIsAuthenticated} />}
                        />
                        <Route
                            path="/register"
                            element={isAuthenticated ? <Navigate to="/events" /> : <Register setIsAuthenticated={setIsAuthenticated} />}
                        />
                        <Route
                            path="/events"
                            element={isAuthenticated ? <EventList /> : <Navigate to="/login" />}
                        />
                        <Route
                            path="/events/new"
                            element={isAuthenticated ? <EventForm /> : <Navigate to="/login" />}
                        />
                        <Route
                            path="/events/:id"
                            element={isAuthenticated ? <EventDetail /> : <Navigate to="/login" />}
                        />
                        <Route
                            path="/"
                            element={<Navigate to={isAuthenticated ? "/events" : "/login"} />}
                        />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;