import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, CheckCheck, PartyPopper, XCircle, Clock, Megaphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import notificationService from '../../services/notificationService';

const POLL_INTERVAL_MS = 30000; // 30 seconds

const NOTIF_ICONS = {
    booking_success: <PartyPopper size={18} style={{ color: '#4ADE80' }} />,
    booking_cancelled: <XCircle size={18} style={{ color: '#EF4444' }} />,
    event_reminder: <Clock size={18} style={{ color: 'var(--color-secondary)' }} />,
    event_update: <Megaphone size={18} style={{ color: 'var(--color-primary)' }} />,
};

export default function NotificationBell() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [panelOpen, setPanelOpen] = useState(false);
    const panelRef = useRef(null);

    const fetchNotifications = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            const res = await notificationService.getAll();
            if (res.success) {
                const list = res.data || [];
                setNotifications(list);
                setUnreadCount(list.filter((n) => !n.read).length);
            }
        } catch (err) {
            // Silently handle polling errors
        }
    }, [isAuthenticated]);

    // Initial fetch + polling
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, POLL_INTERVAL_MS);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    // Close panel when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                setPanelOpen(false);
            }
        };
        if (panelOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [panelOpen]);

    const handleMarkRead = async (id) => {
        try {
            await notificationService.markRead(id);
            setNotifications((prev) =>
                prev.map((n) => (n._id === id ? { ...n, read: true } : n))
            );
            setUnreadCount((c) => Math.max(0, c - 1));
        } catch (err) {
            // Silently handle
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await notificationService.markAllRead();
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (err) {
            // Silently handle
        }
    };

    const timeAgo = (dateStr) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'Just now';
        if (mins < 60) return `${mins}m ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    if (!isAuthenticated) return null;

    return (
        <div ref={panelRef} style={{ position: 'relative' }}>
            {/* Bell Icon Button */}
            <button
                onClick={() => setPanelOpen(!panelOpen)}
                aria-label="Notifications"
                style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    background: panelOpen ? 'var(--bg-glass)' : 'var(--bg-elevated)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    color: unreadCount > 0 ? 'var(--color-primary-light)' : 'var(--text-secondary)',
                }}
            >
                <Bell size={18} />
                {unreadCount > 0 && (
                    <span
                        style={{
                            position: 'absolute',
                            top: '-4px',
                            right: '-4px',
                            minWidth: '18px',
                            height: '18px',
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-primary))',
                            color: 'var(--text-inverse)',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '0 4px',
                            lineHeight: 1,
                            boxShadow: '0 0 8px rgba(201, 135, 58, 0.5)',
                        }}
                    >
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            {panelOpen && (
                <div
                    style={{
                        position: 'absolute',
                        top: 'calc(100% + 10px)',
                        right: 0,
                        width: '340px',
                        maxWidth: '90vw',
                        maxHeight: '440px',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: 'var(--shadow-lg)',
                        zIndex: 3000,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        animation: 'fadeIn 0.15s ease',
                    }}
                >
                    {/* Header */}
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '12px 16px',
                            background: 'var(--bg-elevated)',
                            borderBottom: '1px solid var(--border-subtle)',
                        }}
                    >
                        <span
                            style={{
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                color: 'var(--text-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                            }}
                        >
                            Notifications
                            {unreadCount > 0 && (
                                <span
                                    style={{
                                        fontSize: '0.75rem',
                                        color: 'var(--color-primary-light)',
                                        background: 'rgba(var(--primary-rgb), 0.15)',
                                        padding: '2px 8px',
                                        borderRadius: 'var(--radius-full)',
                                        fontWeight: 700,
                                    }}
                                >
                                    {unreadCount} new
                                </span>
                            )}
                        </span>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontSize: '0.75rem',
                                    color: 'var(--color-primary-light)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: 500,
                                }}
                            >
                                <CheckCheck size={14} /> Mark all read
                            </button>
                        )}
                    </div>

                    {/* Notification List */}
                    <div
                        style={{
                            overflowY: 'auto',
                            flex: 1,
                        }}
                    >
                        {notifications.length === 0 ? (
                            <div
                                style={{
                                    textAlign: 'center',
                                    padding: '2.5rem 1rem',
                                    color: 'var(--text-muted)',
                                    fontSize: '0.8125rem',
                                }}
                            >
                                <Bell size={28} style={{ opacity: 0.3, marginBottom: '8px' }} />
                                <p>No notifications yet</p>
                            </div>
                        ) : (
                            notifications.slice(0, 20).map((notif) => (
                                <div
                                    key={notif._id}
                                    onClick={() => {
                                        if (!notif.read) handleMarkRead(notif._id);
                                        if (notif.type && notif.type.startsWith('booking_')) {
                                            setPanelOpen(false);
                                            navigate('/my-bookings');
                                        }
                                    }}
                                    style={{
                                        display: 'flex',
                                        gap: '12px',
                                        padding: '12px 16px',
                                        borderBottom: '1px solid var(--border-subtle)',
                                        cursor: 'pointer',
                                        background: notif.read
                                            ? 'transparent'
                                            : 'rgba(var(--primary-rgb), 0.06)',
                                        transition: 'background 0.15s ease',
                                    }}
                                >
                                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                                        {NOTIF_ICONS[notif.type] || <Bell size={18} style={{ color: 'var(--color-primary)' }} />}
                                    </span>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'flex-start',
                                                gap: '8px',
                                            }}
                                        >
                                            <strong
                                                style={{
                                                    fontSize: '0.8125rem',
                                                    color: 'var(--text-primary)',
                                                    fontWeight: notif.read ? 500 : 600,
                                                }}
                                            >
                                                {notif.title}
                                            </strong>
                                            {!notif.read && (
                                                <span
                                                    style={{
                                                        width: '8px',
                                                        height: '8px',
                                                        borderRadius: '50%',
                                                        background: 'var(--color-primary)',
                                                        flexShrink: 0,
                                                        marginTop: '4px',
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <p
                                            style={{
                                                fontSize: '0.75rem',
                                                color: 'var(--text-secondary)',
                                                lineHeight: 1.4,
                                                margin: '2px 0 4px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                            }}
                                        >
                                            {notif.message}
                                        </p>
                                        <span
                                            style={{
                                                fontSize: '0.6875rem',
                                                color: 'var(--text-muted)',
                                            }}
                                        >
                                            {timeAgo(notif.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
