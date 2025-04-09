import React, { useCallback, useEffect, useState } from "react";
import api from "../services/api";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function EventList() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchRadius, setSearchRadius] = useState(5000);
    const [retryCount, setRetryCount] = useState(0);
    const { t, i18n } = useTranslation();

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            const response = await api.get(`/events/nearby?radius=${searchRadius}`, {
                headers: { 'Accept-Language': i18n.language },
            });
            setEvents(response.data.events || response.data);
            setRetryCount(0);
        } catch (err) {
            console.error('Error fetching events:', err.response?.data || err.message);
            if (retryCount < 3) {
                setRetryCount(prev => prev + 1);
            } else {
                setError(err.response?.data?.error || t('server_error'));
            }
        } finally {
            setLoading(false);
        }
    }, [searchRadius, retryCount, i18n.language, t]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const formatLocation = (locationText) => {
        if (locationText) {
            const match = locationText.match(/POINT\(([^ ]+) ([^)]+)\)/);
            if (match) {
                return `${match[2]}, ${match[1]}`;
            }
        }
        return t('unknown_location');
    };

    const handleRadiusChange = (e) => {
        setSearchRadius(e.target.value);
    };

    return (
        <div className="event-list">
            <div className="list-header">
                <h2>{t('nearby_events')}</h2>
                <div className="search-controls">
                    <label>
                        {t('search_radius')}:
                        <input
                            type="number"
                            value={searchRadius}
                            onChange={handleRadiusChange}
                            min="100"
                            step="100"
                        />
                    </label>
                    <button onClick={() => fetchEvents()} className="btn btn-secondary">
                        {t('refresh')}
                    </button>
                </div>
                <Link to="/events/new" className="btn btn-primary">
                    {t('create_new_event')}
                </Link>
            </div>
            {error && (
                <div className="error">
                    {error}
                    <button
                        onClick={() => {
                            setRetryCount(0);
                            fetchEvents();
                        }}
                        className="btn btn-secondary retry-btn"
                    >
                        {t('retry')}
                    </button>
                </div>
            )}
            {loading ? (
                <div className="loading">{t('loading_events')}</div>
            ) : events.length > 0 ? (
                <div className="events-grid">
                    {events.map(event => (
                        <div key={event.id} className="event-card">
                            <h3>{event.title}</h3>
                            <p className="event-date">{new Date(event.date).toLocaleString(i18n.language)}</p>
                            <p className="event-location">{formatLocation(event.location)}</p>
                            <p className="event-description">
                                {event.description && event.description.length > 100
                                    ? `${event.description.substring(0, 100)}...`
                                    : event.description || t('no_description')}
                            </p>
                            <Link to={`/events/${event.id}`} className="btn btn-secondary">
                                {t('view_details')}
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-events">{t('no_events_in_area')}</div>
            )}
        </div>
    );
}

export default EventList;