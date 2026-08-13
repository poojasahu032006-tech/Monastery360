import React, { useState } from 'react';
import { Calendar as CalendarIcon, MapPin, Sparkles, Clock, X, Lock, Droplets, Mountain, Landmark, Compass, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import bookingService from '../../services/bookingService';
import toast from 'react-hot-toast';
import '../pages.css';
import '../FeatureCard.css';

const EVENTS_DATA = [
    {
        id: 1,
        title: 'Losar (Tibetan New Year)',
        monastery: 'Rumtek & Phodong Monasteries',
        district: 'East & North Sikkim',
        date: 'Feb 12 - Feb 15, 2026',
        category: 'Sacred Festival',
        icon: Sparkles,
        image: '/images/phodong.jpg',
        imageFocus: 'center 35%',
        desc: 'Celebration of the Tibetan New Year with special prayers, hoisting of prayer flags, traditional food, and sacred rituals.',
    },
    {
        id: 2,
        title: 'Bumchu Holy Water Ceremony',
        monastery: 'Tashiding Monastery',
        district: 'West Sikkim',
        date: 'March 3, 2026',
        category: 'Rituals',
        icon: Droplets,
        image: '/images/ralang.jpg',
        imageFocus: 'center 40%',
        desc: 'The unsealing of the sacred pot of holy water to predict the fortunes and rainfall for the coming year.',
    },
    {
        id: 3,
        title: 'Pang Lhabsol Festival',
        monastery: 'Kabi Longstok & Tsuklakhang Palace',
        district: 'Gangtok, East Sikkim',
        date: 'Sept 15, 2026',
        category: 'Sacred Festival',
        icon: Mountain,
        image: '/images/lachen.jpg',
        imageFocus: 'center 45%',
        desc: 'Unique Sikkimese festival honoring Mount Kanchenjunga as the guardian deity of the kingdom.',
    },
    {
        id: 4,
        title: 'Kagyed Chaam Masked Dance',
        monastery: 'Enchey Monastery',
        district: 'Gangtok, East Sikkim',
        date: 'Dec 18 - Dec 19, 2026',
        category: 'Cham Masked Dances',
        icon: Landmark,
        image: '/images/enchey.jpg',
        imageFocus: 'center 30%',
        desc: 'Monks perform solemn ritual masked dances symbolizing the victory of good over evil forces.',
    },
    {
        id: 5,
        title: 'Lhabab Duchen Ceremony',
        monastery: 'Pemayangtse Monastery',
        district: 'West Sikkim',
        date: 'Nov 1, 2026',
        category: 'Rituals',
        icon: Compass,
        image: '/images/pemayangtse.jpg',
        imageFocus: 'center 50%',
        desc: "Commemorating Lord Buddha's descent from Tushita heaven back to earth following teachings to his mother.",
    },
];

export default function Events() {
    const { user, isAuthenticated } = useAuth();
    const [selectedCategory, setSelectedCategory] = useState('All');
    
    // Modals state
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [detailEvent, setDetailEvent] = useState(null);
    const [showAuthPrompt, setShowAuthPrompt] = useState(false);

    // Form inputs state
    const [attendees, setAttendees] = useState(1);
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(null); // stores bookingId on success

    const categories = ['All', 'Sacred Festival', 'Cham Masked Dances', 'Rituals'];
    const filtered = EVENTS_DATA.filter((e) => selectedCategory === 'All' || e.category === selectedCategory);

    // Handlers
    const handleOpenBookingModal = (eventItem) => {
        if (!isAuthenticated) {
            setShowAuthPrompt(true);
        } else {
            setSelectedEvent(eventItem);
            setAttendees(1);
            setPhone('');
            setMessage('');
            setBookingSuccess(null);
        }
    };

    const handleCloseBookingModal = () => {
        setSelectedEvent(null);
        setBookingSuccess(null);
    };

    const handleConfirmBooking = async (e) => {
        e.preventDefault();
        if (bookingLoading) return;

        setBookingLoading(true);
        try {
            const bookingPayload = {
                event: String(selectedEvent.id),
                eventName: selectedEvent.title,
                eventDate: selectedEvent.date,
                location: selectedEvent.monastery,
                attendees: Number(attendees),
                phone,
                message,
            };

            const response = await bookingService.create(bookingPayload);
            if (response.success) {
                setBookingSuccess(response.data.bookingId);
                toast.success('Event booked successfully!');
            } else {
                toast.error(response.message || 'Booking failed.');
            }
        } catch (err) {
            console.error('Booking submission error:', err);
            const errMsg = err.response?.data?.message || 'Database connection error. Please try again.';
            toast.error(errMsg);
        } finally {
            setBookingLoading(false);
        }
    };

    // Modal Layout Styles
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
        maxWidth: '500px',
        padding: '2rem',
        position: 'relative',
        color: 'var(--text-primary)',
    };

    return (
        <div className="container" style={{ padding: '3rem 1.5rem' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <span className="home-hero-eyebrow" style={{ marginBottom: '1rem' }}>
                    <Sparkles size={14} /> Cultural Celebrations
                </span>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4vw,3rem)', color: 'var(--text-primary)' }}>
                    Monastic Festivals & <span className="gradient-text">Sacred Events</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0.75rem auto 0', fontSize: '1rem', lineHeight: '1.6' }}>
                    Experience ancient ritual Cham dances, holy water ceremonies, and annual festive celebrations across Sikkim.
                </p>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        style={{
                            padding: '8px 20px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            border: selectedCategory === cat ? '1px solid var(--color-primary)' : '1px solid var(--border-medium)',
                            background: selectedCategory === cat ? 'var(--color-primary)' : 'var(--bg-card)',
                            color: selectedCategory === cat ? '#FFFFFF' : 'var(--text-primary)',
                            cursor: 'pointer',
                            transition: 'all var(--transition-fast)',
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Events Grid — image-background cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {filtered.map((item) => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={item.id}
                            className="feat-card"
                            onClick={() => setDetailEvent(item)}
                            style={{
                                backgroundImage: `url('${item.image}')`,
                                backgroundSize: 'cover',
                                backgroundPosition: item.imageFocus,
                                backgroundRepeat: 'no-repeat',
                                minHeight: '360px',
                            }}
                        >
                            <div className="feat-card__overlay" />
                            <div className="feat-card__body">
                                {/* Icon + badge row */}
                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                                    <div className="feat-card__icon">
                                        <Icon size={22} strokeWidth={1.75} />
                                    </div>
                                    <span className="feat-card__badge">{item.category}</span>
                                </div>

                                <h3 className="feat-card__title">{item.title}</h3>

                                <p className="feat-card__meta">
                                    <CalendarIcon size={14} /> {item.date}
                                </p>
                                <p className="feat-card__meta" style={{ marginBottom: '0.75rem', color: '#E2E8F0' }}>
                                    <MapPin size={14} style={{ color: '#F4D06F' }} /> {item.monastery} &middot; {item.district}
                                </p>

                                <p className="feat-card__desc">{item.desc}</p>

                                <div
                                    className="feat-card__footer"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <span style={{ fontSize: '0.78125rem', color: '#FFFFFF', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                                        <Clock size={12} style={{ color: '#F4D06F' }} /> Open to Public
                                    </span>
                                    <button
                                        className="feat-card__cta feat-card__cta--solid"
                                        onClick={() => handleOpenBookingModal(item)}
                                    >
                                        Book Event <ArrowRight size={13} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ─── 1. Auth Required Modal ─── */}
            {showAuthPrompt && (
                <div style={BackdropStyle} onClick={() => setShowAuthPrompt(false)}>
                    <div style={ModalStyle} onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setShowAuthPrompt(false)}
                            style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--text-muted)', cursor: 'pointer', border: 'none', background: 'none' }}
                        >
                            <X size={20} />
                        </button>
                        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                            <Lock size={44} style={{ color: 'var(--color-primary)', marginBottom: '1rem' }} />
                            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                                Authentication Required
                            </h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                                To book events on the Monastery360 platform, please sign in or register a new visitor account.
                            </p>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <Link
                                    to="/login"
                                    style={{
                                        flex: 1,
                                        padding: '10px',
                                        background: 'var(--color-primary)',
                                        color: 'var(--text-inverse)',
                                        textAlign: 'center',
                                        borderRadius: 'var(--radius-md)',
                                        fontWeight: 600,
                                        textDecoration: 'none',
                                    }}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    style={{
                                        flex: 1,
                                        padding: '10px',
                                        background: 'transparent',
                                        border: '1px solid var(--border-subtle)',
                                        color: 'var(--text-primary)',
                                        textAlign: 'center',
                                        borderRadius: 'var(--radius-md)',
                                        fontWeight: 600,
                                        textDecoration: 'none',
                                    }}
                                >
                                    Register
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── 2. Event Details Modal ─── */}
            {detailEvent && (
                <div style={BackdropStyle} onClick={() => setDetailEvent(null)}>
                    <div style={{ ...ModalStyle, maxWidth: '560px' }} onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setDetailEvent(null)}
                            style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--text-muted)', cursor: 'pointer', border: 'none', background: 'none' }}
                        >
                            <X size={20} />
                        </button>
                        
                        <span className="badge badge--gold" style={{ fontSize: '0.75rem', marginBottom: '0.75rem', display: 'inline-block' }}>{detailEvent.category}</span>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--text-primary)', marginBottom: '1rem', lineHeight: '1.2' }}>
                            {detailEvent.title}
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary-light)' }}>
                                <CalendarIcon size={16} /> <strong>{detailEvent.date}</strong>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                                <MapPin size={16} style={{ color: 'var(--color-primary)' }} /> {detailEvent.monastery} ({detailEvent.district})
                            </div>
                        </div>

                        <div style={{ background: 'var(--bg-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '2rem' }}>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: '1.7', margin: 0 }}>
                                {detailEvent.desc}
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={() => {
                                    const eventToBook = detailEvent;
                                    setDetailEvent(null);
                                    handleOpenBookingModal(eventToBook);
                                }}
                                style={{
                                    flex: 1,
                                    padding: '10px',
                                    background: 'var(--color-primary)',
                                    color: 'var(--text-inverse)',
                                    border: 'none',
                                    borderRadius: 'var(--radius-md)',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                }}
                            >
                                Book Event
                            </button>
                            <button
                                onClick={() => setDetailEvent(null)}
                                style={{
                                    padding: '10px 20px',
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

            {/* ─── 3. Event Booking Modal ─── */}
            {selectedEvent && (
                <div style={BackdropStyle}>
                    {bookingSuccess ? (
                        /* Success View Inside Modal */
                        <div style={ModalStyle} onClick={(e) => e.stopPropagation()}>
                            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '50%',
                                    background: 'rgba(94, 128, 109, 0.2)',
                                    color: 'var(--heritage-green)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 1.5rem',
                                }}>
                                    <CheckCircle2 size={32} />
                                </div>
                                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                                    Event Booked Successfully!
                                </h2>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginBottom: '1.5rem' }}>
                                    Your booking for <strong>{selectedEvent.title}</strong> is confirmed.
                                </p>
                                <div style={{
                                    background: 'var(--bg-elevated)',
                                    border: '1px dashed var(--color-primary)',
                                    padding: '12px',
                                    borderRadius: 'var(--radius-md)',
                                    marginBottom: '2rem',
                                }}>
                                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                                        Booking ID
                                    </span>
                                    <strong style={{ fontSize: '1.25rem', color: 'var(--color-primary-light)', letterSpacing: '1px' }}>
                                        {bookingSuccess}
                                    </strong>
                                </div>
                                <button
                                    onClick={handleCloseBookingModal}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        background: 'var(--color-primary)',
                                        color: 'var(--text-inverse)',
                                        border: 'none',
                                        borderRadius: 'var(--radius-md)',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                    }}
                                >
                                    Close Window
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Booking Form View */
                        <div style={ModalStyle} onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={handleCloseBookingModal}
                                style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--text-muted)', cursor: 'pointer', border: 'none', background: 'none' }}
                            >
                                <X size={20} />
                            </button>

                            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                                Event Booking Form
                            </h2>

                            <form onSubmit={handleConfirmBooking} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {/* Event Info Summary */}
                                <div style={{ background: 'var(--bg-elevated)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Selected Event</div>
                                    <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{selectedEvent.title}</strong>
                                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <CalendarIcon size={12} /> {selectedEvent.date}
                                    </div>
                                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <MapPin size={12} /> {selectedEvent.monastery}
                                    </div>
                                </div>

                                {/* User Details */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                    <div>
                                        <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>Name</label>
                                        <input
                                            type="text"
                                            readOnly
                                            value={user?.name || ''}
                                            style={{
                                                width: '100%',
                                                background: 'var(--bg-elevated)',
                                                border: '1px solid var(--border-medium)',
                                                borderRadius: 'var(--radius-md)',
                                                padding: '8px 12px',
                                                color: 'var(--text-primary)',
                                                fontSize: '0.875rem',
                                                outline: 'none',
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>Email</label>
                                        <input
                                            type="text"
                                            readOnly
                                            value={user?.email || ''}
                                            style={{
                                                width: '100%',
                                                background: 'var(--bg-elevated)',
                                                border: '1px solid var(--border-medium)',
                                                borderRadius: 'var(--radius-md)',
                                                padding: '8px 12px',
                                                color: 'var(--text-primary)',
                                                fontSize: '0.875rem',
                                                outline: 'none',
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Booking Inputs */}
                                <div>
                                    <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                                        Number of Attendees <span style={{ color: '#DC2626' }}>*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        required
                                        value={attendees}
                                        onChange={(e) => setAttendees(parseInt(e.target.value) || 1)}
                                        style={{
                                            width: '100%',
                                            background: 'var(--bg-elevated)',
                                            border: '1px solid var(--border-medium)',
                                            borderRadius: 'var(--radius-md)',
                                            padding: '8px 12px',
                                            color: 'var(--text-primary)',
                                            fontSize: '0.875rem',
                                            outline: 'none',
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                                        Phone Number <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>(Optional)</span>
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder="e.g. +91 98765 43210"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        style={{
                                            width: '100%',
                                            background: 'var(--bg-elevated)',
                                            border: '1px solid var(--border-medium)',
                                            borderRadius: 'var(--radius-md)',
                                            padding: '8px 12px',
                                            color: 'var(--text-primary)',
                                            fontSize: '0.875rem',
                                            outline: 'none',
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                                        Special Requirements / Message <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>(Optional)</span>
                                    </label>
                                    <textarea
                                        placeholder="Please note any details, requests, or questions..."
                                        rows="3"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        style={{
                                            width: '100%',
                                            background: 'var(--bg-elevated)',
                                            border: '1px solid var(--border-medium)',
                                            borderRadius: 'var(--radius-md)',
                                            padding: '8px 12px',
                                            color: 'var(--text-primary)',
                                            fontSize: '0.875rem',
                                            outline: 'none',
                                            resize: 'vertical',
                                        }}
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                    <button
                                        type="submit"
                                        disabled={bookingLoading}
                                        style={{
                                            flex: 1,
                                            padding: '10px',
                                            background: 'var(--color-primary)',
                                            color: 'var(--text-inverse)',
                                            border: 'none',
                                            borderRadius: 'var(--radius-md)',
                                            fontWeight: 600,
                                            cursor: bookingLoading ? 'not-allowed' : 'pointer',
                                            opacity: bookingLoading ? 0.7 : 1,
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        {bookingLoading ? 'Confirming...' : 'Confirm Booking'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCloseBookingModal}
                                        style={{
                                            padding: '10px 20px',
                                            background: 'transparent',
                                            border: '1px solid var(--border-subtle)',
                                            color: 'var(--text-secondary)',
                                            borderRadius: 'var(--radius-md)',
                                            fontWeight: 500,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
