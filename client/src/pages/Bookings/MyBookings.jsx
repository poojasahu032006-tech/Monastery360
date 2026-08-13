import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar as CalendarIcon, MapPin, Sparkles, Clock, X, Info, Phone, Mail, User, ShieldAlert, ExternalLink, Users, AlertTriangle, Ticket } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import bookingService from '../../services/bookingService';
import { getSavedExperienceBookings } from '../../data/monasteryBookingData';
import Loading from '../../components/UI/Loading';
import toast from 'react-hot-toast';
import '../pages.css';

/**
 * Generates a Google Calendar "Add Event" URL from booking data.
 * Uses the standard https://calendar.google.com/calendar/render template.
 */
function buildGoogleCalendarUrl(booking) {
    // Parse known event date strings into start/end Date objects
    const dateStr = (booking.eventDate || '').toLowerCase();
    let startDate, endDate;

    if (dateStr.includes('feb 12')) {
        startDate = new Date('2026-02-12T09:00:00');
        endDate   = new Date('2026-02-15T18:00:00');
    } else if (dateStr.includes('march 3')) {
        startDate = new Date('2026-03-03T06:00:00');
        endDate   = new Date('2026-03-03T18:00:00');
    } else if (dateStr.includes('sept 15')) {
        startDate = new Date('2026-09-15T09:00:00');
        endDate   = new Date('2026-09-15T18:00:00');
    } else if (dateStr.includes('dec 18')) {
        startDate = new Date('2026-12-18T09:00:00');
        endDate   = new Date('2026-12-19T18:00:00');
    } else if (dateStr.includes('nov 1')) {
        startDate = new Date('2026-11-01T09:00:00');
        endDate   = new Date('2026-11-01T18:00:00');
    } else if (booking.dateIso) {
        startDate = new Date(booking.dateIso + 'T09:00:00');
        endDate   = new Date(booking.dateIso + 'T11:00:00');
    } else {
        startDate = new Date();
        endDate   = new Date(Date.now() + 3600000);
    }

    const fmt = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: booking.eventName || booking.experienceTitle,
        dates: `${fmt(startDate)}/${fmt(endDate)}`,
        location: booking.location || booking.monasteryName,
        details: `Monastery360 Booking ID: ${booking.bookingId}\nAttendees: ${booking.attendees}\nTime Slot: ${booking.timeSlot || 'Standard'}\n\n${booking.message || ''}`.trim(),
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export default function MyBookings() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal state
    const [activeDetail, setActiveDetail] = useState(null);
    const [activeCancel, setActiveCancel] = useState(null);
    const [cancelLoading, setCancelLoading] = useState(false);

    const fetchBookings = async () => {
        setLoading(true);
        setError(null);
        const localExpBookings = getSavedExperienceBookings();
        try {
            const res = await bookingService.getAll();
            const backendBookings = res.data || [];
            // Merge local experience bookings and backend event bookings
            setBookings([...localExpBookings, ...backendBookings]);
        } catch (err) {
            console.warn('Backend bookings unavailable, using local bookings:', err);
            if (localExpBookings.length > 0) {
                setBookings(localExpBookings);
            } else {
                setBookings([]);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleCancelConfirm = async () => {
        if (!activeCancel) return;
        setCancelLoading(true);
        try {
            // Check if it's a local experience booking
            if (activeCancel._id && String(activeCancel._id).startsWith('exp_')) {
                // Update in localStorage
                try {
                    const stored = getSavedExperienceBookings();
                    const updated = stored.map(b => b._id === activeCancel._id ? { ...b, status: 'cancelled' } : b);
                    localStorage.setItem('monastery360_experience_bookings', JSON.stringify(updated));
                } catch (e) {
                    console.error('Error updating local storage:', e);
                }
                setBookings(prev =>
                    prev.map(b => (b._id === activeCancel._id ? { ...b, status: 'cancelled' } : b))
                );
                if (activeDetail && activeDetail._id === activeCancel._id) {
                    setActiveDetail(prev => ({ ...prev, status: 'cancelled' }));
                }
                toast.success('Experience booking cancelled successfully.');
            } else {
                // Backend booking cancellation
                const response = await bookingService.cancel(activeCancel._id);
                if (response.success) {
                    setBookings(prev =>
                        prev.map(b => (b._id === activeCancel._id ? { ...b, status: 'cancelled' } : b))
                    );
                    if (activeDetail && activeDetail._id === activeCancel._id) {
                        setActiveDetail(prev => ({ ...prev, status: 'cancelled' }));
                    }
                    toast.success('Booking cancelled successfully.');
                } else {
                    toast.error(response.message || 'Failed to cancel booking.');
                }
            }
        } catch (err) {
            console.error('Cancellation error:', err);
            toast.error(err.response?.data?.message || 'Error occurred while processing cancellation.');
        } finally {
            setCancelLoading(false);
            setActiveCancel(null);
        }
    };

    // Modal Styles
    const BackdropStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '1.5rem',
    };

    const ModalStyle = {
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-lg)',
        width: '100%',
        maxWidth: '520px',
        padding: '2rem',
        position: 'relative',
        color: 'var(--text-primary)',
    };

    return (
        <div className="container" style={{ padding: '3rem 1.5rem', minHeight: '80vh' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <span className="home-hero-eyebrow" style={{ marginBottom: '1rem' }}>
                    <CalendarIcon size={14} /> Reservation Hub
                </span>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4vw,3rem)', color: 'var(--text-primary)' }}>
                    My Event <span className="gradient-text">Bookings</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0.75rem auto 0', fontSize: '1rem', lineHeight: '1.6' }}>
                    View, manage, and inspect the details of your upcoming temple celebrations and sacred ritual tickets.
                </p>
            </div>

            {/* Main Content */}
            {loading ? (
                <div style={{ padding: '6rem', textAlign: 'center' }}>
                    <Loading />
                    <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Retrieving your bookings...</p>
                </div>
            ) : error ? (
                <div className="card" style={{ textAlign: 'center', padding: '3.5rem', border: '1px solid rgba(232,69,69,0.3)', background: 'rgba(232,69,69,0.05)', maxWidth: '600px', margin: '0 auto' }}>
                    <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Failed to retrieve bookings</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{error}</p>
                    <button onClick={fetchBookings} className="btn-primary" style={{ padding: '8px 18px' }}>
                        Try Again
                    </button>
                </div>
            ) : bookings.length === 0 ? (
                /* Styled Empty State */
                <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', maxWidth: '600px', margin: '0 auto', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                    <CalendarIcon size={48} style={{ color: 'var(--color-primary)', marginBottom: '1rem' }} />
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                        No Bookings Yet
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem', fontSize: '0.9375rem', lineHeight: '1.6' }}>
                        Your booked monastery events will appear here. Plan your spiritual journey by reserving tickets.
                    </p>
                    <Link to="/events" style={{ textDecoration: 'none' }}>
                        <button style={{
                            padding: '10px 24px',
                            background: 'var(--color-primary)',
                            color: 'var(--text-inverse)',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                        }}>
                            Explore Events
                        </button>
                    </Link>
                </div>
            ) : (
                /* Bookings Grid */
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                    {bookings.map((booking) => {
                        const isConfirmed = booking.status === 'confirmed';
                        return (
                            <div
                                key={booking._id}
                                className="card card--hover"
                                style={{ display: 'flex', flexDirection: 'column', height: '100%', border: '1px solid var(--border-subtle)', opacity: isConfirmed ? 1 : 0.75 }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
                                        ID: {booking.bookingId}
                                    </span>
                                    <span style={{
                                        fontSize: '0.7rem',
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        padding: '4px 10px',
                                        borderRadius: 'var(--radius-full)',
                                        background: isConfirmed ? 'rgba(94, 128, 109, 0.18)' : 'rgba(180, 74, 74, 0.18)',
                                        color: isConfirmed ? 'var(--dark-green)' : 'var(--color-primary)',
                                    }}>
                                        {booking.status}
                                    </span>
                                </div>

                                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                                    {booking.eventName || booking.experienceTitle}
                                </h3>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '1.25rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <CalendarIcon size={14} style={{ color: 'var(--color-primary-light)' }} />
                                        <span>{booking.eventDate}</span>
                                    </div>
                                    {booking.timeSlot && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Clock size={14} style={{ color: 'var(--color-primary)' }} />
                                            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{booking.timeSlot}</span>
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <MapPin size={14} style={{ color: 'var(--color-primary)' }} />
                                        <span style={{
                                            whiteSpace: 'nowrap',
                                            textOverflow: 'ellipsis',
                                            overflow: 'hidden',
                                            maxWidth: '240px'
                                        }}>{booking.location || booking.monasteryName}</span>
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                        Booked on: {new Date(booking.createdAt).toLocaleDateString()}
                                    </div>
                                </div>

                                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Users size={14} /> {booking.attendees} {booking.attendees === 1 ? 'Attendee' : 'Attendees'}
                                    </span>

                                    {isConfirmed ? (
                                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                            <button
                                                onClick={() => setActiveDetail(booking)}
                                                style={{
                                                    background: 'transparent',
                                                    color: 'var(--color-primary-light)',
                                                    border: '1px solid var(--border-subtle)',
                                                    borderRadius: 'var(--radius-md)',
                                                    padding: '5px 10px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                Details
                                            </button>
                                            <a
                                                href={buildGoogleCalendarUrl(booking)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    background: 'rgba(94, 128, 109, 0.15)',
                                                    color: 'var(--dark-green)',
                                                    border: '1px solid var(--border-subtle)',
                                                    borderRadius: 'var(--radius-md)',
                                                    padding: '5px 10px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                    textDecoration: 'none',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                }}
                                            >
                                                <CalendarIcon size={12} /> Calendar
                                            </a>
                                            <button
                                                onClick={() => setActiveCancel(booking)}
                                                style={{
                                                    background: 'rgba(180, 74, 74, 0.15)',
                                                    color: 'var(--color-primary)',
                                                    border: '1px solid var(--border-subtle)',
                                                    borderRadius: 'var(--radius-md)',
                                                    padding: '5px 10px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <span style={{ fontSize: '0.78125rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                            Cancelled
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ─── 1. View Details Modal ─── */}
            {activeDetail && (
                <div style={BackdropStyle} onClick={() => setActiveDetail(null)}>
                    <div style={ModalStyle} onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setActiveDetail(null)}
                            style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--text-muted)', cursor: 'pointer', border: 'none', background: 'none' }}
                        >
                            <X size={20} />
                        </button>

                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                            Booking Details
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
                            <div style={{ background: 'var(--bg-elevated)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Booking Code</div>
                                <strong style={{ fontSize: '1.1rem', color: 'var(--color-primary-light)' }}>{activeDetail.bookingId}</strong>
                            </div>

                            <div>
                                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Experience / Event Name</span>
                                <strong style={{ color: 'var(--text-primary)' }}>{activeDetail.eventName || activeDetail.experienceTitle}</strong>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <div>
                                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Date</span>
                                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{activeDetail.eventDate}</span>
                                </div>
                                <div>
                                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>{activeDetail.timeSlot ? 'Time Slot' : 'Location'}</span>
                                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{activeDetail.timeSlot || activeDetail.location}</span>
                                </div>
                            </div>

                            {activeDetail.timeSlot && (
                                <div>
                                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Monastery Location</span>
                                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{activeDetail.location || activeDetail.monasteryName}</span>
                                </div>
                            )}

                            <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '4px 0' }} />

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <div>
                                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Visitor Name</span>
                                    <span style={{ color: 'var(--text-primary)' }}>{user?.name}</span>
                                </div>
                                <div>
                                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Visitor Email</span>
                                    <span style={{ color: 'var(--text-primary)' }}>{user?.email}</span>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <div>
                                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Attendees</span>
                                    <span style={{ color: 'var(--text-primary)' }}>{activeDetail.attendees} pax</span>
                                </div>
                                <div>
                                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Phone Number</span>
                                    <span style={{ color: 'var(--text-primary)' }}>{activeDetail.phone || '—'}</span>
                                </div>
                            </div>

                            {activeDetail.message && (
                                <div>
                                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Special Message</span>
                                    <p style={{ background: 'var(--bg-elevated)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', margin: '4px 0 0', fontSize: '0.8125rem' }}>
                                        {activeDetail.message}
                                    </p>
                                </div>
                            )}

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '4px' }}>
                                <div>
                                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Reserved On</span>
                                    <span>{new Date(activeDetail.createdAt).toLocaleString()}</span>
                                </div>
                                <div>
                                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Booking Status</span>
                                    <strong style={{ color: activeDetail.status === 'confirmed' ? '#4ADE80' : '#F87171' }}>
                                        {activeDetail.status.toUpperCase()}
                                    </strong>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '2rem', flexWrap: 'wrap' }}>
                            {activeDetail.status === 'confirmed' && (
                                <a
                                    href={buildGoogleCalendarUrl(activeDetail)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        flex: 1,
                                        padding: '10px',
                                        background: 'rgba(74,222,128,0.1)',
                                        color: '#4ADE80',
                                        border: '1px solid rgba(74,222,128,0.2)',
                                        borderRadius: 'var(--radius-md)',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        textDecoration: 'none',
                                        textAlign: 'center',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '6px',
                                    }}
                                >
                                    <ExternalLink size={14} /> Add to Google Calendar
                                </a>
                            )}
                            {activeDetail.status === 'confirmed' && (
                                <button
                                    onClick={() => {
                                        const bToCancel = activeDetail;
                                        setActiveDetail(null);
                                        setActiveCancel(bToCancel);
                                    }}
                                    style={{
                                        flex: 1,
                                        padding: '10px',
                                        background: 'rgba(239,68,68,0.1)',
                                        color: '#F87171',
                                        border: '1px solid rgba(239,68,68,0.2)',
                                        borderRadius: 'var(--radius-md)',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                    }}
                                >
                                    Cancel Booking
                                </button>
                            )}
                            <button
                                onClick={() => setActiveDetail(null)}
                                style={{
                                    flex: 1,
                                    padding: '10px',
                                    background: 'transparent',
                                    border: '1px solid var(--border-subtle)',
                                    color: 'var(--text-secondary)',
                                    borderRadius: 'var(--radius-md)',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── 2. Cancellation Confirmation Modal ─── */}
            {activeCancel && (
                <div style={BackdropStyle} onClick={() => setActiveCancel(null)}>
                    <div style={ModalStyle} onClick={(e) => e.stopPropagation()}>
                        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                            <div style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '50%',
                                background: 'rgba(239,68,68,0.1)',
                                color: '#EF4444',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.75rem',
                                margin: '0 auto 1.25rem',
                            }}>
                                <AlertTriangle size={28} />
                            </div>
                            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                                Cancel Reservation?
                            </h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                                Are you sure you want to cancel your booking for <strong>{activeCancel.eventName}</strong> (ID: {activeCancel.bookingId})? This action cannot be undone.
                            </p>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    onClick={handleCancelConfirm}
                                    disabled={cancelLoading}
                                    style={{
                                        flex: 1,
                                        padding: '10px',
                                        background: '#EF4444',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: 'var(--radius-md)',
                                        fontWeight: 600,
                                        cursor: cancelLoading ? 'not-allowed' : 'pointer',
                                        opacity: cancelLoading ? 0.7 : 1,
                                    }}
                                >
                                    {cancelLoading ? 'Cancelling...' : 'Yes, Cancel Booking'}
                                </button>
                                <button
                                    onClick={() => setActiveCancel(null)}
                                    disabled={cancelLoading}
                                    style={{
                                        flex: 1,
                                        padding: '10px',
                                        background: 'transparent',
                                        border: '1px solid var(--border-subtle)',
                                        color: 'var(--text-secondary)',
                                        borderRadius: 'var(--radius-md)',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                    }}
                                >
                                    No, Keep Booking
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
