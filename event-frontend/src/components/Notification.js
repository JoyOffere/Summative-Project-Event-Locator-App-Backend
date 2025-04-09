import "./Notification.css";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { io } from "socket.io-client";

function Notification() {
    const [notifications, setNotifications] = useState([]);
    const [socket, setSocket] = useState(null);
    const { t } = useTranslation();

    useEffect(() => {
        const newSocket = io('http://localhost:3000');
        setSocket(newSocket);
        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!socket) return;
        socket.on('notification', message => {
            const newNotification = {
                id: Date.now(),
                message,
                isNew: true,
            };
            setNotifications(prev => [newNotification, ...prev]);
            setTimeout(() => {
                setNotifications(prev =>
                    prev.map(notif =>
                        notif.id === newNotification.id ? { ...notif, isNew: false } : notif
                    )
                );
            }, 5000);
        });
        return () => {
            socket.off('notification');
        };
    }, [socket]);

    const dismissNotification = id => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    };

    return (
        <div className="notification-container">
            <h3>{t('notifications')}</h3>
            {notifications.map(notification => (
                <div
                    key={notification.id}
                    className={`notification-item ${notification.isNew ? 'new' : ''}`}
                >
                    <div className="notification-content">{notification.message}</div>
                    <button
                        className="notification-dismiss"
                        onClick={() => dismissNotification(notification.id)}
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    );
}

export default Notification;