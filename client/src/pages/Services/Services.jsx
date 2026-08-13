import React from 'react';
import { ShieldCheck, Compass, Headphones, Home, Car, PhoneCall, ChevronRight } from 'lucide-react';
import '../pages.css';

const SERVICES_LIST = [
    {
        id: 'permits',
        icon: <ShieldCheck size={28} style={{ color: 'var(--color-primary)' }} />,
        title: 'Protected Area Permits (PAP & RAP)',
        badge: 'Essential for Foreign & Domestic Pilgrims',
        desc: 'Guidance and assistance for obtaining Inner Line Permits (ILP), Protected Area Permits (PAP) for North Sikkim & border areas.',
        actionText: 'View Permit Guidelines',
    },
    {
        id: 'guides',
        icon: <Compass size={28} style={{ color: 'var(--color-primary)' }} />,
        title: 'Certified Heritage Guides',
        badge: 'Licensed Cultural Experts',
        desc: 'Book experienced local Sikkimese guides certified in Buddhist iconography, monastery architecture, and Tibetan history.',
        actionText: 'Request a Guide',
    },
    {
        id: 'audio',
        icon: <Headphones size={28} style={{ color: 'var(--color-primary)' }} />,
        title: 'Multi-lingual Audio Guides',
        badge: 'English, Hindi, Nepali, Tibetan',
        desc: 'Download high-quality narrated audio walkthroughs for Rumtek, Pemayangtse, Enchey, and Tashiding monasteries.',
        actionText: 'Explore Audio Guide',
    },
    {
        id: 'accommodations',
        icon: <Home size={28} style={{ color: 'var(--color-primary)' }} />,
        title: 'Monastery Guest House Stays',
        badge: 'Spiritual Retreats',
        desc: 'Find quiet homestays and monastery visitor lodges near sacred grounds for meditation and quiet retreats.',
        actionText: 'Browse Accommodations',
    },
    {
        id: 'transport',
        icon: <Car size={28} style={{ color: 'var(--color-primary)' }} />,
        title: 'Eco-Transport & Shared Cabs',
        badge: 'Green Travel',
        desc: 'Pre-book electric shared vehicles and eco-taxis connecting Gangtok, Pelling, Mangan, and Namchi.',
        actionText: 'View Travel Routes',
    },
];

export default function Services() {
    return (
        <div className="container" style={{ padding: '3rem 1.5rem' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <span className="home-hero-eyebrow" style={{ marginBottom: '1rem' }}>
                    <PhoneCall size={14} /> Visitor & Pilgrim Support
                </span>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4vw,3rem)', color: 'var(--text-primary)' }}>
                    Monastery Visitor <span className="gradient-text">Services</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0.75rem auto 0', fontSize: '1rem', lineHeight: '1.6' }}>
                    Comprehensive tourism support to ensure a respectful, seamless, and memorable pilgrimage across Sikkim.
                </p>
            </div>

            {/* Services Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {SERVICES_LIST.map((srv) => (
                    <div key={srv.id} className="card card--hover" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                            <div style={{
                                width: '52px',
                                height: '52px',
                                borderRadius: 'var(--radius-md)',
                                background: 'rgba(201, 135, 58, 0.12)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid var(--border-subtle)'
                            }}>
                                {srv.icon}
                            </div>
                            <span className="badge badge--gold" style={{ fontSize: '0.75rem' }}>{srv.badge}</span>
                        </div>

                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                            {srv.title}
                        </h3>

                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.6', flex: 1, marginBottom: '1.5rem' }}>
                            {srv.desc}
                        </p>

                        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                            <button className="btn-ghost-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', color: 'var(--color-primary)' }}>
                                {srv.actionText} <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Part 3 Booking Notice */}
            <div className="card" style={{
                background: 'radial-gradient(ellipse at 50% 0%, rgba(201,135,58,0.1) 0%, var(--bg-card) 70%)',
                border: '1px solid var(--border-subtle)',
                textAlign: 'center',
                padding: '2.5rem 1.5rem',
            }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    Integrated Service Booking Engine Coming in Part 3
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '560px', margin: '0 auto 1.5rem' }}>
                    You will be able to book certified tour guides, request monastery stay passes, and check real-time cab availability directly from your Monastery360 account.
                </p>
            </div>
        </div>
    );
}
