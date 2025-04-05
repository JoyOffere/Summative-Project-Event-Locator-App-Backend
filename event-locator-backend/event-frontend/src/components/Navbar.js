import React from "react";
import { Link } from "react-router-dom";

function Navbar({ isAuthenticated, logout }) {
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">Event Finder</Link>
            </div>

            <div className="navbar-menu">
                {isAuthenticated ? (
                    <>
                        <Link to="/events" className="nav-link">Events</Link>
                        <Link to="/events/new" className="nav-link">Create Event</Link>
                        <button onClick={logout} className="nav-link logout-btn">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="nav-link">Login</Link>
                        <Link to="/register" className="nav-link">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;