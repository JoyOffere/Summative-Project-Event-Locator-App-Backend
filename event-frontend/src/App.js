import "./App.css";
import EventDetail from "./components/EventDetail";
import EventForm from "./components/EventForm";
import EventList from "./components/EventList";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Notification from "./components/Notification";
import React, { useEffect, useState } from "react";
import Register from "./components/Register";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";

// App.js

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

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

    return (
        <Router>
            <div className="app">
                <Navbar isAuthenticated={isAuthenticated} logout={logout} />
                {isAuthenticated && <Notification />} {/* Only show notifications when authenticated */}
                <div className="container">
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