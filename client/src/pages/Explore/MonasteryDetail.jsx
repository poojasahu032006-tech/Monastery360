import React, { useState, useEffect } from 'react';
import VirtualTourModal from '../../components/VirtualTour/VirtualTourModal';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    MapPin, Calendar, Clock, Star, ArrowLeft, Video, Ticket,
    CheckCircle2, Info, Shield, Compass, BookOpen, Layers, Sparkles
} from 'lucide-react';
import monasteryService from '../../services/monasteryService';
import Loading from '../../components/UI/Loading';


export default function MonasteryDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [monastery, setMonastery] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tourOpen, setTourOpen] = useState(false);
    const handleLaunchTour = () => setTourOpen(true);

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
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏯</div>
                    <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                        Monastery Not Found
                    </h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                        {error || "The monastery details you are looking for do not exist or may have been moved."}
                    </p>
                    <button onClick={() => navigate('/explore')} className="btn-primary" style={{ padding: '8px 20px' }}>
                        Back to Explore Directory
                    </button>
                </div>
            </div>
        );
    }

    const primaryImage = monastery.images?.[0]?.url || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80';

    return (<>
        <div className="container" style={{ padding: '2.5rem 1.5rem 4rem' }}>
            {/* Navigation back button */}
            <button
                onClick={() => navigate('/explore')}
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-primary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    marginBottom: '1.5rem',
                }}
            >
                <ArrowLeft size={16} /> Back to Directory
            </button>

            {/* Main Hero Header */}
            <div style={{
                position: 'relative',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                marginBottom: '2.5rem',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--border-subtle)',
            }}>
                <img
                    src={primaryImage}
                    alt={monastery.name}
                    style={{
                        width: '100%',
                        height: 'clamp(280px, 45vh, 480px)',
                        objectFit: 'cover',
                        display: 'block',
                    }}
                />
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(26, 31, 44, 0.95) 0%, rgba(26, 31, 44, 0.4) 60%, rgba(0,0,0,0.1) 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '2rem',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                        <span style={{
                            background: 'var(--color-primary)',
                            color: 'var(--text-inverse)',
                            padding: '4px 12px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.78125rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                        }}>
                            <MapPin size={12} /> {monastery.district}
                        </span>
                        <span style={{
                            background: 'rgba(255,255,255,0.15)',
                            backdropFilter: 'blur(4px)',
                            color: '#fff',
                            padding: '4px 12px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.78125rem',
                        }}>
                            Est. {monastery.establishedYear || 'Historic'}
                        </span>
                    </div>

                    <h1 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
                        color: '#fff',
                        marginBottom: '0.5rem',
                        lineHeight: 1.2,
                    }}>
                        {monastery.name}
                    </h1>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={14} style={{ color: 'var(--color-primary-light)' }} />
                            {monastery.address || monastery.district}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Star size={14} fill="var(--color-primary)" color="var(--color-primary)" />
                            <strong style={{ color: '#fff' }}>{monastery.rating || 4.5}</strong> ({monastery.reviewCount || 0} reviews)
                        </span>
                    </div>
                </div>
            </div>

            {/* Layout Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem' }}>
                {/* Left Column: Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* About & Description */}
                    <div className="card">
                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <BookOpen size={18} style={{ color: 'var(--color-primary)' }} /> Overview
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '0.975rem', whitespace: 'pre-line' }}>
                            {monastery.description || monastery.shortDescription}
                        </p>
                    </div>

                    {/* History */}
                    {monastery.history && (
                        <div className="card">
                            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Compass size={18} style={{ color: 'var(--color-primary)' }} /> Historical Background
                            </h2>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '0.95rem' }}>
                                {monastery.history}
                            </p>
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
                                    <h3 style={{ fontSize: '1rem', color: 'var(--color-primary)', marginBottom: '0.4rem', fontWeight: 600 }}>
                                        Spiritual Significance
                                    </h3>
                                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.925rem' }}>
                                        {monastery.significance}
                                    </p>
                                </div>
                            )}

                            {monastery.architecture && (
                                <div>
                                    <h3 style={{ fontSize: '1rem', color: 'var(--color-primary)', marginBottom: '0.4rem', fontWeight: 600 }}>
                                        Architectural Style
                                    </h3>
                                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.925rem' }}>
                                        {monastery.architecture}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Facilities Checklist */}
                    {monastery.facilities && (
                        <div className="card">
                            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <CheckCircle2 size={18} style={{ color: 'var(--color-primary)' }} /> Visitor Facilities
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
                                {Object.entries(monastery.facilities).map(([key, available]) => (
                                    <div key={key} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '8px 12px',
                                        borderRadius: 'var(--radius-md)',
                                        background: available ? 'rgba(201, 135, 58, 0.08)' : 'var(--bg-elevated)',
                                        border: `1px solid ${available ? 'rgba(201, 135, 58, 0.2)' : 'var(--border-subtle)'}`,
                                    }}>
                                        <CheckCircle2 size={14} style={{ color: available ? 'var(--color-primary)' : 'var(--text-muted)' }} />
                                        <span style={{ fontSize: '0.85rem', color: available ? 'var(--text-primary)' : 'var(--text-muted)', textTransform: 'capitalize' }}>
                                            {key.replace(/([A-Z])/g, ' $1')}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Sidebar Specs & Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Visitor Information Card */}
                    <div className="card">
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                            Visitor Information
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <Clock size={18} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
                                <div>
                                    <h4 style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Opening Hours</h4>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500 }}>{monastery.openingHours || '6:00 AM - 6:00 PM'}</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <Calendar size={18} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
                                <div>
                                    <h4 style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Best Time to Visit</h4>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500 }}>{monastery.bestTimeToVisit || 'March to June, Sept to Nov'}</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <Info size={18} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
                                <div>
                                    <h4 style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Etiquette & Guidelines</h4>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                                        {monastery.visitingInformation || 'Remove shoes before entering shrine halls. Maintain silence.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Virtual Tour Card */}
                    <div className="card" style={{ border: '1px solid var(--border-subtle)', background: 'var(--bg-elevated)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(201, 135, 58, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Video size={18} style={{ color: 'var(--color-primary)' }} />
                            </div>
                            <div>
                                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--text-primary)' }}>360° Virtual Tour</h4>
                                <span style={{ fontSize: '0.75rem', color: monastery.virtualTourAvailable ? 'var(--color-primary)' : 'var(--text-muted)' }}>
                                    {monastery.virtualTourAvailable ? 'Available for exploration' : 'Coming in Part 4'}
                                </span>
                            </div>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                            {monastery.virtualTourAvailable
                                ? 'Immerse yourself in high-definition panoramic walkthroughs of the monastery grounds.'
                                : 'Virtual tour capture for this site is scheduled in the upcoming VR digitized phase.'}
                        </p>
                        <button
                            onClick={handleLaunchTour}
                            disabled={!monastery.virtualTourAvailable}
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: 'var(--radius-md)',
                                background: monastery.virtualTourAvailable ? 'var(--color-primary)' : 'rgba(255,255,255,0.08)',
                                color: monastery.virtualTourAvailable ? 'var(--text-inverse)' : 'var(--text-muted)',
                                border: 'none',
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                cursor: monastery.virtualTourAvailable ? 'pointer' : 'not-allowed',
                            }}
                        >
                            {monastery.virtualTourAvailable ? 'Launch 360° Tour' : 'Virtual Tour Unavailable'}
                        </button>
                    </div>

                    {/* Booking / Guided Service Card */}
                    <div className="card" style={{ border: '1px solid var(--border-subtle)', background: 'var(--bg-elevated)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(74, 144, 226, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Ticket size={18} style={{ color: '#4A90E2' }} />
                            </div>
                            <div>
                                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--text-primary)' }}>Guided Tour & Services</h4>
                                <span style={{ fontSize: '0.75rem', color: monastery.bookingAvailable ? '#4A90E2' : 'var(--text-muted)' }}>
                                    {monastery.bookingAvailable ? 'Bookable Experience' : 'Coming in Part 3'}
                                </span>
                            </div>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                            {monastery.bookingAvailable
                                ? 'Book licensed heritage guides and specialized cultural passes.'
                                : 'Official tour reservations for this monastery will be activated in Part 3.'}
                        </p>
                        <button
                            disabled={!monastery.bookingAvailable}
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: 'var(--radius-md)',
                                background: monastery.bookingAvailable ? '#4A90E2' : 'rgba(255,255,255,0.08)',
                                color: monastery.bookingAvailable ? '#fff' : 'var(--text-muted)',
                                border: 'none',
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                cursor: monastery.bookingAvailable ? 'pointer' : 'not-allowed',
                            }}
                        >
                            {monastery.bookingAvailable ? 'Reserve Experience' : 'Booking Closed'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
{tourOpen && (
  <VirtualTourModal
    imageUrl="/360/rumtek-360.png"
    title={`${monastery.name} 360° Tour`}
    onClose={() => setTourOpen(false)}
  />
)}
    
</> );
}
