import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate, useParams } from "react-router-dom";

function EventDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchEvent();
    }, [id]);

    const fetchEvent = async () => {
        try {
            const response = await api.get(`/events/${id}`);
            setEvent(response.data);
        } catch (err) {
            setError('Failed to fetch event details');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await api.delete(`/events/${id}`);
                navigate('/events');
            } catch (err) {
                setError('Failed to delete event');
            }
        }
    };

    const formatLocation = (locationText) => {
        if (locationText) {
            const match = locationText.match(/POINT\(([^ ]+) ([^)]+)\)/);
            if (match) {
                return `${match[2]}, ${match[1]}`; // lat, lon format
            }
        }
        return 'Unknown location';
    };

    if (loading) {
        return <div className="loading">Loading event details...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!event) {
        return <div className="not-found">Event not found</div>;
    }

    return (
        <div className="event-detail">
            <h2>{event.title}</h2>

            <div className="event-meta">
                <div className="meta-item">
                    <span className="meta-label">Date & Time:</span>
                    <span className="meta-value">{new Date(event.date).toLocaleString()}</span>
                </div>

                <div className="meta-item">
                    <span className="meta-label">Location:</span>
                    <span className="meta-value">{formatLocation(event.location)}</span>
                </div>
            </div>

            <div className="event-description">
                <h3>Description</h3>
                <p>{event.description}</p>
            </div>

            <div className="event-actions">
                <button onClick={() => navigate('/events')} className="btn btn-secondary">
                    Back to Events
                </button>
                <button onClick={() => navigate(`/events/${id}/edit`)} className="btn btn-primary">
                    Edit Event
                </button>
                <button onClick={handleDelete} className="btn btn-danger">
                    Delete Event
                </button>
            </div>
        </div>
    );
}

export default EventDetail;