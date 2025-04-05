import "./Notification.css";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

function Notification() {
    const [notifications, setNotifications] = useState([]);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Create socket connection
        const newSocket = io('http://localhost:3000');
        setSocket(newSocket);

        // Clean up on unmount
        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!socket) return;

        // Listen for notifications
        socket.on('notification', (message) => {
            // Add new notification with a unique ID
            const newNotification = {
                id: Date.now(),
                message,
                isNew: true
            };

            setNotifications(prev => [newNotification, ...prev]);

            // After 5 seconds, mark as not new (for animation)
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

    const dismissNotification = (id) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    };

    return (
        <div className="notification-container">
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className={`notification-item ${notification.isNew ? 'new' : ''}`}
                >
                    <div className="notification-content">
                        {notification.message}
                    </div>
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