import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

function EventForm() {
    const { id } = useParams();
    const isEditing = Boolean(id);
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        latitude: '',
        longitude: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(isEditing);

    useEffect(() => {
        if (isEditing) {
            fetchEvent();
        } else {
            handleGetLocation();
        }
    }, [id]);

    const fetchEvent = async () => {
        try {
            const response = await api.get(`/events/${id}`, {
                headers: { 'Accept-Language': i18n.language },
            });
            const event = response.data.event || response.data;
            let latitude = '';
            let longitude = '';
            if (event.location) {
                const match = event.location.match(/POINT\(([^ ]+) ([^)]+)\)/);
                if (match) {
                    longitude = match[1];
                    latitude = match[2];
                }
            }
            const date = new Date(event.date).toISOString().slice(0, 16);
            setFormData({
                title: event.title,
                description: event.description,
                date,
                latitude,
                longitude,
            });
        } catch (err) {
            setError(t('failed_to_fetch_event'));
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
                        longitude: position.coords.longitude,
                    }));
                },
                (error) => {
                    setError(t('geolocation_error', { message: error.message }));
                }
            );
        } else {
            setError(t('geolocation_not_supported'));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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
                longitude: parseFloat(formData.longitude),
            };
            if (isEditing) {
                await api.put(`/events/${id}`, eventData, {
                    headers: { 'Accept-Language': i18n.language },
                });
            } else {
                await api.post('/events', eventData, {
                    headers: { 'Accept-Language': i18n.language },
                });
            }
            navigate('/events');
        } catch (err) {
            setError(err.response?.data?.error || t('failed_to_save_event'));
        }
    };

    if (loading) {
        return <div className="loading">{t('loading_event_details')}</div>;
    }

    return (
        <div className="event-form">
            <h2>{isEditing ? t('edit_event') : t('create_event')}</h2>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>{t('title')}</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>{t('description')}</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>{t('date_time')}</label>
                    <input
                        type="datetime-local"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>{t('location')}</label>
                    <div className="location-input">
                        <div>
                            <input
                                type="number"
                                name="latitude"
                                placeholder={t('latitude')}
                                value={formData.latitude}
                                onChange={handleChange}
                                step="any"
                                required
                            />
                            <input
                                type="number"
                                name="longitude"
                                placeholder={t('longitude')}
                                value={formData.longitude}
                                onChange={handleChange}
                                step="any"
                                required
                            />
                        </div>
                        <button type="button" onClick={handleGetLocation} className="btn btn-secondary">
                            {t('get_current_location')}
                        </button>
                    </div>
                </div>
                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/events')} className="btn btn-secondary">
                        {t('cancel')}
                    </button>
                    <button type="submit" className="btn btn-primary">
                        {isEditing ? t('update_event') : t('create_event')}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EventForm;