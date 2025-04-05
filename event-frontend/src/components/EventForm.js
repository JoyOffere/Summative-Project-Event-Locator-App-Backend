import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate, useParams } from "react-router-dom";

function EventForm() {
    const { id } = useParams();
    const isEditing = Boolean(id);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        latitude: '',
        longitude: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(isEditing);

    useEffect(() => {
        if (isEditing) {
            fetchEvent();
        } else {
            // For new events, get user's current location as default
            handleGetLocation();
        }
    }, [id]);

    const fetchEvent = async () => {
        try {
            const response = await api.get(`/events/${id}`);
            const event = response.data;

            // Parse location from POINT(lon lat) format
            let latitude = '';
            let longitude = '';
            if (event.location) {
                const match = event.location.match(/POINT\(([^ ]+) ([^)]+)\)/);
                if (match) {
                    longitude = match[1];
                    latitude = match[2];
                }
            }

            // Format date for datetime-local input (YYYY-MM-DDThh:mm)
            const date = new Date(event.date);
            const formattedDate = date.toISOString().slice(0, 16);

            setFormData({
                title: event.title,
                description: event.description,
                date: formattedDate,
                latitude,
                longitude
            });
        } catch (err) {
            setError('Failed to fetch event details');
        } finally {
            setLoading(false);
        }
    };

    const handleGetLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData(prev => ({
                        ...prev,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }));
                },
                (error) => {
                    setError(`Geolocation error: ${error.message}`);
                }
            );
        } else {
            setError('Geolocation is not supported by this browser');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const eventData = {
                title: formData.title,
                description: formData.description,
                date: new Date(formData.date).toISOString(),
                latitude: parseFloat(formData.latitude),
                longitude: parseFloat(formData.longitude)
            };

            if (isEditing) {
                await api.put(`/events/${id}`, eventData);
            } else {
                await api.post('/events', eventData);
            }

            navigate('/events');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save event');
        }
    };

    if (loading) {
        return <div className="loading">Loading event details...</div>;
    }

    return (
        <div className="event-form">
            <h2>{isEditing ? 'Edit Event' : 'Create New Event'}</h2>
            {error && <div className="error">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Date & Time</label>
                    <input
                        type="datetime-local"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Location</label>
                    <div className="location-input">
                        <div>
                            <input
                                type="number"
                                name="latitude"
                                placeholder="Latitude"
                                value={formData.latitude}
                                onChange={handleChange}
                                step="any"
                                required
                            />
                            <input
                                type="number"
                                name="longitude"
                                placeholder="Longitude"
                                value={formData.longitude}
                                onChange={handleChange}
                                step="any"
                                required
                            />
                        </div>
                        <button type="button" onClick={handleGetLocation} className="btn btn-secondary">
                            Get Current Location
                        </button>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/events')} className="btn btn-secondary">
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                        {isEditing ? 'Update Event' : 'Create Event'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EventForm;