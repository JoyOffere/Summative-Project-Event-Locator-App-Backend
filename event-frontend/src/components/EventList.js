import React, { useCallback, useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

function EventList() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchRadius, setSearchRadius] = useState(5000); // 5km default
    const [retryCount, setRetryCount] = useState(0);

    // Define fetchEvents using useCallback to prevent infinite loop
    const fetchEvents = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            // Add a small delay to avoid rapid refetching
            await new Promise(resolve => setTimeout(resolve, 500));

            const response = await api.get(`/events/nearby?radius=${searchRadius}`);
            setEvents(response.data);
            setRetryCount(0); // Reset retry count on success
        } catch (err) {
            console.error('Error fetching events:', err.response?.data || err.message);

            if (retryCount < 3) {
                // Auto-retry a few times for network errors
                setRetryCount(prev => prev + 1);
            } else {
                // After max retries, show error to user
                setError(
                    err.response?.data?.error ||
                    'Could not connect to server. Please try again later.'
                );
            }
        } finally {
            setLoading(false);
        }
    }, [searchRadius, retryCount]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const formatLocation = (locationText) => {
        // Parse POINT(lon lat) format
        if (locationText) {
            const match = locationText.match(/POINT\(([^ ]+) ([^)]+)\)/);
            if (match) {
                return `${match[2]}, ${match[1]}`; // lat, lon format
            }
        }
        return 'Unknown location';
    };

    // Handle radius change with a separate function to prevent immediate trigger
    const handleRadiusChange = (e) => {
        setSearchRadius(e.target.value);
    };

    return (
        <div className="event-list">
            <div className="list-header">
                <h2>Nearby Events</h2>
                <div className="search-controls">
                    <label>
                        Search Radius (meters):
                        <input
                            type="number"
                            value={searchRadius}
                            onChange={handleRadiusChange}
                            min="100"
                            step="100"
                        />
                    </label>
                    <button onClick={() => fetchEvents()} className="btn btn-secondary">Refresh</button>
                </div>
                <Link to="/events/new" className="btn btn-primary">Create New Event</Link>
            </div>

            {error && (
                <div className="error">
                    {error}
                    <button
                        onClick={() => { setRetryCount(0); fetchEvents(); }}
                        className="btn btn-secondary retry-btn"
                    >
                        Retry
                    </button>
                </div>
            )}

            {loading ? (
                <div className="loading">Loading events...</div>
            ) : events.length > 0 ? (
                <div className="events-grid">
                    {events.map((event) => (
                        <div key={event.id} className="event-card">
                            <h3>{event.title}</h3>
                            <p className="event-date">{new Date(event.date).toLocaleString()}</p>
                            <p className="event-location">{formatLocation(event.location)}</p>
                            <p className="event-description">
                                {event.description && event.description.length > 100
                                    ? `${event.description.substring(0, 100)}...`
                                    : event.description || 'No description available'}
                            </p>
                            <Link to={`/events/${event.id}`} className="btn btn-secondary">View Details</Link>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-events">No events found in your area. Try increasing the search radius.</div>
            )}
        </div>
    );
}

export default EventList;