import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

function EventDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchEvent();
    }, [id]);

    const fetchEvent = async () => {
        try {
            const response = await api.get(`/events/${id}`, {
                headers: { 'Accept-Language': i18n.language },
            });
            setEvent(response.data.event || response.data);
        } catch (err) {
            setError(t('failed_to_fetch_event'));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm(t('confirm_delete'))) {
            try {
                await api.delete(`/events/${id}`, {
                    headers: { 'Accept-Language': i18n.language },
                });
                navigate('/events');
            } catch (err) {
                setError(t('failed_to_delete_event'));
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
        return t('unknown_location');
    };

    if (loading) {
        return <div className="loading">{t('loading_event_details')}</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!event) {
        return <div className="not-found">{t('event_not_found')}</div>;
    }

    return (
        <div className="event-detail">
            <h2>{event.title}</h2>
            <div className="event-meta">
                <div className="meta-item">
                    <span className="meta-label">{t('date_time')}:</span>
                    <span className="meta-value">{new Date(event.date).toLocaleString(i18n.language)}</span>
                </div>
                <div className="meta-item">
                    <span className="meta-label">{t('location')}:</span>
                    <span className="meta-value">{formatLocation(event.location)}</span>
                </div>
            </div>
            <div className="event-description">
                <h3>{t('description')}</h3>
                <p>{event.description}</p>
            </div>
            <div className="event-actions">
                <button onClick={() => navigate('/events')} className="btn btn-secondary">
                    {t('back_to_events')}
                </button>
                <button onClick={() => navigate(`/events/${id}/edit`)} className="btn btn-primary">
                    {t('edit_event')}
                </button>
                <button onClick={handleDelete} className="btn btn-danger">
                    {t('delete_event')}
                </button>
            </div>
        </div>
    );
}

export default EventDetail;