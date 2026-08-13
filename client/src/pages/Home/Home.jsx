import React from 'react';
import { Link } from 'react-router-dom';
import '../pages.css';

const FEATURES = [
    { icon: '🗺️', title: 'Interactive Map', desc: 'Explore monastery locations across Sikkim with live crowd data', to: '/map' },
    { icon: '🔥', title: 'Crowd Heatmap', desc: 'Plan your visit with real-time visitor density information', to: '/crowd' },
    { icon: '🎭', title: 'Virtual Tours', desc: 'Immersive 360° experiences of sacred spaces from anywhere', to: '/virtual-tour' },
    { icon: '🔍', title: 'Smart Search', desc: 'AI-powered search matching your interests to ideal monasteries', to: '/search' },
    { icon: '📅', title: 'Cultural Calendar', desc: 'Never miss a festival or sacred event at any monastery', to: '/calendar' },
    { icon: '🎧', title: 'Audio Guide', desc: 'Multi-language narrations by expert cultural historians', to: '/audio' },
];

export default function Home() {
    return (
        <div>
            {/* Hero */}
            <section className="home-hero">
                <span className="home-hero-eyebrow">🏛️ Digital Heritage Initiative</span>
                <h1 className="home-hero-title">
                    Discover Sikkim's<br />
                    <span className="gradient-text">Monastery Heritage</span>
                </h1>
                <p className="home-hero-subtitle">
                    MONASTERY360 digitizes and preserves the sacred monastery heritage of Sikkim,
                    making it accessible to visitors and researchers worldwide through smart tourism technology.
                </p>
                <div className="home-hero-actions">
                    <Link to="/explore" id="hero-explore-btn">
                        <button className="btn btn--primary btn--lg">Explore Monasteries</button>
                    </Link>
                    <Link to="/map" id="hero-map-btn">
                        <button className="btn btn--outline btn--lg">View Map</button>
                    </Link>
                </div>

                <div className="home-stats">
                    <div className="stat-item">
                        <span className="stat-value">200+</span>
                        <span className="stat-label">Monasteries</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value">4</span>
                        <span className="stat-label">Districts</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value">500+</span>
                        <span className="stat-label">Years of Heritage</span>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section style={{ padding: '5rem 0', background: 'var(--bg-deep)' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,3vw,2.25rem)', color: 'var(--text-primary)' }}>
                            Smart Features for <span className="gradient-text">Smart Tourism</span>
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '0.75rem', fontSize: '1rem' }}>
                            Coming across parts 2–5 of the MONASTERY360 platform
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1.5rem' }}>
                        {FEATURES.map((f) => (
                            <Link to={f.to} key={f.title} style={{ textDecoration: 'none' }}>
                                <div className="card card--hover" style={{ height: '100%' }}>
                                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{f.icon}</div>
                                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                                        {f.title}
                                    </h3>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>{f.desc}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
