import React from 'react';
import { ShieldCheck, Compass, Headphones, Home, Car, PhoneCall, ArrowRight } from 'lucide-react';
import '../pages.css';
import './Services.css';

const SERVICES_LIST = [
    {
        id: 'permits',
        icon: ShieldCheck,
        title: 'Protected Area Permits',
        badge: 'PAP & RAP',
        desc: 'Guidance and assistance for Inner Line Permits (ILP) and Protected Area Permits for North Sikkim and border areas.',
        actionText: 'View Permit Guidelines',
        image: '/images/lachen.jpg',
        // Gurudongmar Lake area — the actual PAP-required North Sikkim border zone
        imageFocus: 'center 40%',
    },
    {
        id: 'guides',
        icon: Compass,
        title: 'Certified Heritage Guides',
        badge: 'Licensed Cultural Experts',
        desc: 'Book experienced Sikkimese guides certified in Buddhist iconography, monastery architecture, and Tibetan history.',
        actionText: 'Request a Guide',
        image: '/images/pemayangtse.jpg',
        // Monks in the courtyard of Pemayangtse — cultural expertise scene
        imageFocus: 'center 55%',
    },
    {
        id: 'audio',
        icon: Headphones,
        title: 'Multi-lingual Audio Guides',
        badge: 'EN · HI · NE · BO',
        desc: 'Download narrated audio walkthroughs for Rumtek, Pemayangtse, Enchey, and Tashiding in four languages.',
        actionText: 'Explore Audio Guide',
        image: '/images/sangaChoeling.jpg',
        // Sanga Choeling — vibrant monastery atmosphere with birds in flight
        imageFocus: 'center 35%',
    },
    {
        id: 'accommodations',
        icon: Home,
        title: 'Monastery Guest House Stays',
        badge: 'Spiritual Retreats',
        desc: 'Find quiet homestays and monastery visitor lodges near sacred grounds for meditation and quiet retreats.',
        actionText: 'Browse Accommodations',
        image: '/images/enchey.jpg',
        // Enchey Monastery perched on a Himalayan ridge — perfect pilgrim retreat imagery
        imageFocus: 'center 30%',
    },
    {
        id: 'transport',
        icon: Car,
        title: 'Eco-Transport & Shared Cabs',
        badge: 'Green Travel',
        desc: 'Pre-book electric shared vehicles and eco-taxis connecting Gangtok, Pelling, Mangan, and Namchi.',
        actionText: 'View Travel Routes',
        image: '/images/rumtek.jpg',
        // Buddha Park with Himalayan valley roads — travel & journey visual
        imageFocus: 'center 50%',
    },
];

export default function Services() {
    return (
        <div style={{ padding: '3rem 0', background: 'var(--bg-primary)' }}>
            <div className="container">

                {/* ── Page Header ────────────────────────────────────────── */}
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <span className="home-hero-eyebrow" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
                        <PhoneCall size={14} /> Visitor &amp; Pilgrim Support
                    </span>
                    <h1 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(2rem, 4vw, 3rem)',
                        color: 'var(--text-primary)',
                        marginTop: '1rem',
                    }}>
                        Monastery Visitor <span className="gradient-text">Services</span>
                    </h1>
                    <p style={{
                        color: 'var(--text-secondary)',
                        maxWidth: '600px',
                        margin: '0.75rem auto 0',
                        fontSize: '1rem',
                        lineHeight: '1.6',
                    }}>
                        Comprehensive tourism support to ensure a respectful, seamless, and
                        memorable pilgrimage across Sikkim.
                    </p>
                </div>

                {/* ── Services Grid ───────────────────────────────────────── */}
                <div className="services-grid">
                    {SERVICES_LIST.map((srv) => {
                        const Icon = srv.icon;
                        return (
                            <article
                                key={srv.id}
                                className="svc-card"
                                style={{
                                    backgroundImage: `url('${srv.image}')`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: srv.imageFocus,
                                    backgroundRepeat: 'no-repeat',
                                }}
                                role="region"
                                aria-label={srv.title}
                            >
                                {/* Dark gradient overlay */}
                                <div className="svc-card__overlay" />

                                {/* Content layer */}
                                <div className="svc-card__content">
                                    {/* Icon + badge row */}
                                    <div className="svc-card__top">
                                        <div className="svc-card__icon-wrap">
                                            <Icon size={24} strokeWidth={1.75} />
                                        </div>
                                        <span className="svc-card__badge">{srv.badge}</span>
                                    </div>

                                    {/* Title */}
                                    <h3 className="svc-card__title">{srv.title}</h3>

                                    {/* Description */}
                                    <p className="svc-card__desc">{srv.desc}</p>

                                    {/* CTA */}
                                    <button
                                        className="svc-card__cta"
                                        aria-label={`${srv.actionText} — ${srv.title}`}
                                    >
                                        {srv.actionText}
                                        <ArrowRight size={15} strokeWidth={2} />
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </div>

                {/* ── Booking Notice ──────────────────────────────────────── */}
                <div className="card services-notice">
                    <h3 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.3rem',
                        color: 'var(--text-primary)',
                        marginBottom: '0.5rem',
                    }}>
                        Integrated Service Booking Engine Coming in Part 3
                    </h3>
                    <p style={{
                        fontSize: '0.9rem',
                        color: 'var(--text-muted)',
                        maxWidth: '560px',
                        margin: '0 auto',
                    }}>
                        You will be able to book certified tour guides, request monastery stay
                        passes, and check real-time cab availability directly from your
                        Monastery360 account.
                    </p>
                </div>

            </div>
        </div>
    );
}
