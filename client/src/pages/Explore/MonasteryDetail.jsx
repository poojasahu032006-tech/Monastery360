import React, { useState, useEffect } from 'react';
import VirtualTourModal from '../../components/VirtualTour/VirtualTourModal';
import ExperienceBookingModal from '../../components/BookingModal/ExperienceBookingModal';
import MonasteryTimetable from '../../components/BookingModal/MonasteryTimetable';
import { useParams, useNavigate } from 'react-router-dom';
import {
    MapPin, Calendar, Clock, Star, ArrowLeft, Video, Ticket,
    CheckCircle2, Info, Shield, Compass, BookOpen, Layers, Sparkles, Landmark,
    Users, CalendarDays, Flame, ArrowRight, Eye
} from 'lucide-react';
import monasteryService from '../../services/monasteryService';
import Loading from '../../components/UI/Loading';
import {
    getMonasteryLiveTimetable,
    normalizeMonasteryId,
    MONASTERY_EXPERIENCES,
    MONASTERY_EVENTS,
    getAvailableDates,
} from '../../data/monasteryBookingData';

export default function MonasteryDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [monastery, setMonastery] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tourOpen, setTourOpen] = useState(false);
    const [bookingOpen, setBookingOpen] = useState(false);

    // Derived monastery ID for timetable/booking
    const normalizedId = normalizeMonasteryId(id) || 'rumtek';
    const today = new Date().toISOString().split('T')[0];
    const [liveTimetable, setLiveTimetable] = useState([]);
    const [nearestDates] = useState(() => getAvailableDates().slice(0, 3));

    // Refresh timetable from localStorage whenever modal closes or page focuses
    const refreshTimetable = () => {
        setLiveTimetable(getMonasteryLiveTimetable(normalizedId, today));
    };

    useEffect(() => {
        const fetchDetail = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await monasteryService.getById(id);
                setMonastery(res.data);
            } catch (err) {
                console.error('Error fetching monastery detail:', err);
                setError(err.response?.data?.message || 'Monastery not found.');
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    useEffect(() => {
        refreshTimetable();
    }, [normalizedId, today]);

    // Refresh on window focus (after returning from bookings page, etc.)
    useEffect(() => {
        const onFocus = () => refreshTimetable();
        window.addEventListener('focus', onFocus);
        return () => window.removeEventListener('focus', onFocus);
    }, [normalizedId, today]);

    const handleOpenBooking = () => setBookingOpen(true);
    const handleCloseBooking = () => { setBookingOpen(false); refreshTimetable(); };

    if (loading) {
        return (
            <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
                <Loading fullScreen={false} />
                <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Fetching monastery heritage details...</p>
            </div>
        );
    }

    if (error || !monastery) {
        return (
            <div className="container" style={{ padding: '5rem 1.5rem', maxWidth: '600px', textAlign: 'center' }}>
                <div className="card" style={{ padding: '3rem', border: '1px solid rgba(232,69,69,0.3)' }}>
                    <Landmark size={48} style={{ color: 'var(--color-primary)', marginBottom: '1rem' }} />
                    <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Monastery Not Found</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{error || 'The monastery details you are looking for do not exist or may have been moved.'}</p>
                    <button onClick={() => navigate('/explore')} className="btn-primary" style={{ padding: '8px 20px' }}>Back to Explore Directory</button>
                </div>
            </div>
        );
    }

    const primaryImage = monastery.images?.[0]?.url || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80';

    // Plan Your Visit: quick timetable strip (first 5 bookable-relevant entries)
    const quickSlots = liveTimetable.filter(t => t.bookable).slice(0, 5);

    // Upcoming events for this monastery
    const monEvents = MONASTERY_EVENTS.filter(e => e.monasteryId === normalizedId);

    return (<>
        <div className="container" style={{ padding: '2.5rem 1.5rem 4rem' }}>
            {/* Back button */}
            <button
                onClick={() => navigate('/explore')}
                style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 600, marginBottom: '1.5rem' }}
            >
                <ArrowLeft size={16} /> Back to Directory
            </button>

            {/* ── Hero Header ── */}
            <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '2.5rem', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-subtle)' }}>
                <img
                    src={primaryImage}
                    alt={monastery.name}
                    style={{ width: '100%', height: 'clamp(280px, 45vh, 480px)', objectFit: 'cover', display: 'block' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(15,23,42,0.15) 0%, rgba(15,23,42,0.45) 40%, rgba(15,23,42,0.92) 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '2.5rem 2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '0.625rem' }}>
                        <span style={{ background: '#8B2E2E', color: '#FFFFFF', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.78125rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid rgba(244,208,111,0.4)' }}>
                            <MapPin size={12} style={{ color: '#F4D06F' }} /> {monastery.district}
                        </span>
                        <span style={{ background: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(6px)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.3)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.78125rem', fontWeight: 600 }}>
                            Est. {monastery.establishedYear || 'Historic'}
                        </span>
                    </div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', color: '#FFFFFF', marginBottom: '0.5rem', lineHeight: 1.2, fontWeight: 800, textShadow: '0 2px 12px rgba(0,0,0,0.85)' }}>
                        {monastery.name}
                    </h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', color: '#F1F5F9', fontSize: '0.925rem', flexWrap: 'wrap', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} style={{ color: '#F4D06F' }} />{monastery.address || monastery.district}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Star size={14} fill="#F4D06F" color="#F4D06F" />
                            <strong style={{ color: '#FFFFFF' }}>{monastery.rating || 4.5}</strong> ({monastery.reviewCount || 0} reviews)
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Two-column layout ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem' }}>

                {/* Left Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* About */}
                    <div className="card">
                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <BookOpen size={18} style={{ color: 'var(--color-primary)' }} /> Overview
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '0.975rem' }}>
                            {monastery.description || monastery.shortDescription}
                        </p>
                    </div>

                    {/* History */}
                    {monastery.history && (
                        <div className="card">
                            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Compass size={18} style={{ color: 'var(--color-primary)' }} /> Historical Background
                            </h2>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '0.95rem' }}>{monastery.history}</p>
                        </div>
                    )}

                    {/* Architecture & Significance */}
                    {(monastery.architecture || monastery.significance) && (
                        <div className="card">
                            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Layers size={18} style={{ color: 'var(--color-primary)' }} /> Heritage & Architecture
                            </h2>
                            {monastery.significance && (
                                <div style={{ marginBottom: '1.25rem' }}>
                                    <h3 style={{ fontSize: '1rem', color: 'var(--color-primary)', marginBottom: '0.4rem', fontWeight: 600 }}>Spiritual Significance</h3>
                                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.925rem' }}>{monastery.significance}</p>
                                </div>
                            )}
                            {monastery.architecture && (
                                <div>
                                    <h3 style={{ fontSize: '1rem', color: 'var(--color-primary)', marginBottom: '0.4rem', fontWeight: 600 }}>Architectural Style</h3>
                                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.925rem' }}>{monastery.architecture}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Facilities */}
                    {monastery.facilities && (
                        <div className="card">
                            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <CheckCircle2 size={18} style={{ color: 'var(--color-primary)' }} /> Visitor Facilities
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
                                {Object.entries(monastery.facilities).map(([key, available]) => (
                                    <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: 'var(--radius-md)', background: available ? 'rgba(var(--primary-rgb), 0.08)' : 'var(--bg-elevated)', border: `1px solid ${available ? 'rgba(var(--primary-rgb), 0.2)' : 'var(--border-subtle)'}` }}>
                                        <CheckCircle2 size={14} style={{ color: available ? 'var(--color-primary)' : 'var(--text-muted)' }} />
                                        <span style={{ fontSize: '0.85rem', color: available ? 'var(--text-primary)' : 'var(--text-muted)', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Visitor Info */}
                    <div className="card">
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>Visitor Information</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <Clock size={18} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
                                <div>
                                    <h4 style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Opening Hours</h4>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{monastery.openingHours || '6:00 AM - 6:00 PM'}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <Calendar size={18} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
                                <div>
                                    <h4 style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Best Time to Visit</h4>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{monastery.bestTimeToVisit || 'March to June, Sept to Nov'}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <Info size={18} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
                                <div>
                                    <h4 style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Etiquette & Guidelines</h4>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{monastery.visitingInformation || 'Remove shoes before entering shrine halls. Maintain silence.'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Virtual Tour Card */}
                    <div className="card" style={{ border: '1px solid var(--border-subtle)', background: 'var(--bg-elevated)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(var(--primary-rgb), 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Video size={18} style={{ color: 'var(--color-primary)' }} />
                            </div>
                            <div>
                                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>360° Virtual Tour</h4>
                                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: monastery.virtualTourAvailable ? 'var(--color-primary)' : 'var(--text-secondary)' }}>
                                    {monastery.virtualTourAvailable ? 'Available for exploration' : 'Coming in Part 4'}
                                </span>
                            </div>
                        </div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: '1.5' }}>
                            {monastery.virtualTourAvailable ? 'Immerse yourself in high-definition panoramic walkthroughs of the monastery grounds.' : 'Virtual tour capture for this site is scheduled in the upcoming VR digitized phase.'}
                        </p>
                        <button
                            onClick={() => setTourOpen(true)}
                            disabled={!monastery.virtualTourAvailable}
                            style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', background: monastery.virtualTourAvailable ? 'var(--color-primary)' : 'var(--border-subtle)', color: monastery.virtualTourAvailable ? 'var(--text-inverse)' : 'var(--text-muted)', border: 'none', fontWeight: 600, fontSize: '0.875rem', cursor: monastery.virtualTourAvailable ? 'pointer' : 'not-allowed' }}
                        >
                            {monastery.virtualTourAvailable ? 'Launch 360° Tour' : 'Virtual Tour Unavailable'}
                        </button>
                    </div>

                    {/* Reserve Experience Card — always enabled */}
                    <div className="card" style={{ border: '1.5px solid rgba(139,46,46,0.3)', background: 'rgba(139,46,46,0.04)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(139,46,46,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Ticket size={18} style={{ color: '#8B2E2E' }} />
                            </div>
                            <div>
                                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 700 }}>Guided Tour & Services</h4>
                                <span style={{ fontSize: '0.75rem', color: '#8B2E2E', fontWeight: 700 }}>
                                    {quickSlots.length > 0 ? `${quickSlots.length} slots available today` : 'Book experiences & guided tours'}
                                </span>
                            </div>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
                            Book licensed heritage guides, cultural walks, sacred art experiences, and immersive monastery tours.
                        </p>
                        {/* Quick available slots preview */}
                        {quickSlots.length > 0 && (
                            <div style={{ marginBottom: '0.875rem' }}>
                                {quickSlots.slice(0, 3).map((slot, i) => {
                                    const isF = slot.remaining === 0;
                                    const isFst = slot.remaining > 0 && slot.remaining <= 5;
                                    return (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 8px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', marginBottom: 4 }}>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                                                <Clock size={10} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} />
                                                {slot.time}
                                            </span>
                                            <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: isF ? '#DC2626' : isFst ? '#B45309' : '#15803D' }}>
                                                {isF ? 'FULL' : `${slot.remaining} seats`}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        <button
                            onClick={handleOpenBooking}
                            style={{ width: '100%', padding: '11px', borderRadius: 'var(--radius-md)', background: '#8B2E2E', color: '#FFFFFF', border: 'none', fontWeight: 700, fontSize: '0.9375rem', cursor: 'pointer', transition: 'background 180ms ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                            onMouseEnter={e => e.currentTarget.style.background = '#A53A3A'}
                            onMouseLeave={e => e.currentTarget.style.background = '#8B2E2E'}
                        >
                            <Ticket size={15} /> Reserve Experience
                        </button>
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════
                PLAN YOUR VISIT SECTION
            ══════════════════════════════════════════════════════════════ */}
            <div style={{ marginTop: '3rem' }}>
                {/* Section Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5 }}>
                            <Sparkles size={12} /> Plan Your Visit
                        </div>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.35rem, 2.5vw, 1.75rem)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                            Today&apos;s Schedule & Booking
                        </h2>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: 5 }}>
                            Live slot availability · Book guided experiences · View full schedule
                        </p>
                    </div>
                    <button
                        onClick={handleOpenBooking}
                        style={{ padding: '10px 22px', borderRadius: 'var(--radius-md)', background: '#8B2E2E', color: '#FFF', border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, transition: 'background 180ms ease', flexShrink: 0 }}
                        onMouseEnter={e => e.currentTarget.style.background = '#A53A3A'}
                        onMouseLeave={e => e.currentTarget.style.background = '#8B2E2E'}
                    >
                        <Ticket size={15} /> Reserve Experience
                    </button>
                </div>

                {/* ── Quick Availability Strip ── */}
                {quickSlots.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
                        {quickSlots.map((slot, i) => {
                            const isF = slot.remaining === 0;
                            const isFst = slot.remaining > 0 && slot.remaining <= 5;
                            return (
                                <div
                                    key={i}
                                    onClick={!isF ? handleOpenBooking : undefined}
                                    style={{
                                        padding: '0.875rem 1rem',
                                        borderRadius: 'var(--radius-md)',
                                        background: isF ? 'rgba(220,38,38,0.04)' : 'var(--bg-card)',
                                        border: `1.5px solid ${isF ? 'rgba(220,38,38,0.2)' : isFst ? 'rgba(217,119,6,0.25)' : 'rgba(22,163,74,0.25)'}`,
                                        cursor: isF ? 'default' : 'pointer',
                                        transition: 'box-shadow 160ms ease',
                                    }}
                                    onMouseEnter={e => !isF && (e.currentTarget.style.boxShadow = '0 2px 10px rgba(139,46,46,0.15)')}
                                    onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
                                >
                                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <Clock size={10} /> {slot.time}
                                    </div>
                                    <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6, lineHeight: 1.3 }}>{slot.event}</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: isF ? '#DC2626' : isFst ? '#D97706' : '#16A34A', flexShrink: 0 }} />
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isF ? '#DC2626' : isFst ? '#B45309' : '#15803D' }}>
                                            {isF ? 'FULL' : `${slot.remaining} seats`}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ── Two-column: Timetable + Upcoming Events ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 1fr)', gap: '1.5rem', alignItems: 'start' }}>
                    {/* Full Timetable */}
                    <MonasteryTimetable
                        monasteryId={normalizedId}
                        monasteryName={monastery.name}
                        onOpenBooking={handleOpenBooking}
                    />

                    {/* Upcoming Events + Available Experiences sidebar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {/* Available Experiences */}
                        <div style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border-medium)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
                            <div style={{ padding: '0.875rem 1.125rem', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-elevated)' }}>
                                <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-primary)', marginBottom: 2 }}>Available Experiences</div>
                                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>Book a Guided Tour</div>
                            </div>
                            <div style={{ padding: '0.875rem' }}>
                                {MONASTERY_EXPERIENCES.slice(0, 3).map(exp => (
                                    <div
                                        key={exp.id}
                                        onClick={handleOpenBooking}
                                        style={{ padding: '8px 10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-elevated)', marginBottom: 6, cursor: 'pointer', transition: 'border-color 160ms ease' }}
                                        onMouseEnter={e => e.currentTarget.style.borderColor = '#8B2E2E'}
                                        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, marginBottom: 2 }}>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>{exp.title}</span>
                                            <span style={{ fontSize: '0.6rem', fontWeight: 800, padding: '2px 6px', borderRadius: 999, background: 'rgba(139,46,46,0.1)', color: 'var(--color-primary)', whiteSpace: 'nowrap', flexShrink: 0 }}>{exp.badge}</span>
                                        </div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                            <Clock size={9} style={{ display: 'inline', verticalAlign: 'middle' }} /> {exp.duration}
                                        </div>
                                    </div>
                                ))}
                                <button
                                    onClick={handleOpenBooking}
                                    style={{ width: '100%', marginTop: 4, padding: '8px', borderRadius: 'var(--radius-md)', background: '#8B2E2E', color: '#FFF', border: 'none', fontWeight: 700, fontSize: '0.8125rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                                >
                                    <Ticket size={13} /> Reserve Now
                                </button>
                            </div>
                        </div>

                        {/* Upcoming Events */}
                        {monEvents.length > 0 && (
                            <div style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border-medium)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
                                <div style={{ padding: '0.875rem 1.125rem', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-elevated)' }}>
                                    <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-secondary)', marginBottom: 2 }}>Upcoming Events</div>
                                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>Festivals & Ceremonies</div>
                                </div>
                                <div style={{ padding: '0.875rem' }}>
                                    {monEvents.map(evt => (
                                        <div key={evt.id} style={{ padding: '8px 10px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(154,110,30,0.2)', background: 'rgba(154,110,30,0.04)', marginBottom: 8 }}>
                                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{evt.title}</div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--color-secondary)', fontWeight: 600, marginBottom: 4 }}>
                                                <CalendarDays size={9} style={{ display: 'inline', verticalAlign: 'middle' }} /> {evt.formattedDate}
                                            </div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{evt.description}</div>
                                            <button
                                                onClick={handleOpenBooking}
                                                style={{ marginTop: 8, width: '100%', padding: '5px', borderRadius: 'var(--radius-sm)', background: 'rgba(154,110,30,0.15)', color: '#9A6E1E', border: '1px solid rgba(154,110,30,0.3)', fontWeight: 700, fontSize: '0.7rem', cursor: 'pointer' }}
                                            >
                                                View Event
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Crowd Info */}
                        <div style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border-medium)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
                            <div style={{ padding: '0.875rem 1.125rem', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-elevated)' }}>
                                <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-primary)', marginBottom: 2 }}>Live Crowd</div>
                                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>Visitor Density</div>
                            </div>
                            <div style={{ padding: '0.875rem' }}>
                                <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 8 }}>
                                    See real-time visitor density and avoid overcrowding at this monastery.
                                </p>
                                <a
                                    href={`/crowd?select=${normalizedId}`}
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px', borderRadius: 'var(--radius-md)', background: 'var(--bg-elevated)', border: '1px solid var(--border-medium)', color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.775rem', textDecoration: 'none', cursor: 'pointer' }}
                                >
                                    <Flame size={12} style={{ color: 'var(--color-primary)' }} /> View Crowd Heatmap
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* ── Modals ── */}
        {tourOpen && (
            <VirtualTourModal
                imageUrl="/360/rumtek-360.png"
                title={`${monastery.name} 360° Tour`}
                onClose={() => setTourOpen(false)}
            />
        )}

        <ExperienceBookingModal
            isOpen={bookingOpen}
            onClose={handleCloseBooking}
            monasteryName={monastery.name}
            monasteryId={normalizedId}
        />
    </>);
}
