import React from 'react';
import { Link } from 'react-router-dom';
import { Landmark, Map, Flame, Compass, Search, CalendarDays, Headphones, ArrowRight } from 'lucide-react';
import '../pages.css';
import '../FeatureCard.css';

// Each feature card gets a real Sikkim monastery/landscape photograph
const FEATURES = [
    {
        icon: Map,
        title: 'Interactive Map',
        badge: 'Live Crowd Data',
        desc: 'Explore monastery locations across all four districts of Sikkim with real-time visitor density overlays.',
        to: '/map',
        image: '/images/lingdum.jpg',
        imageFocus: 'center 50%',
    },
    {
        icon: Flame,
        title: 'Crowd Heatmap',
        badge: 'Smart Planning',
        desc: 'Plan your visit with real-time visitor density heatmaps to avoid crowds at sacred sites.',
        to: '/crowd',
        image: '/images/phodong.jpg',
        imageFocus: 'center 40%',
    },
    {
        icon: Compass,
        title: 'Virtual Tours',
        badge: '360° Immersive',
        desc: 'Immersive 360° virtual walkthroughs of sacred monastery interiors from anywhere in the world.',
        to: '/virtual-tour',
        image: '/images/ralang.jpg',
        imageFocus: 'center 35%',
    },
    {
        icon: Search,
        title: 'Smart Search',
        badge: 'AI Powered',
        desc: 'AI-powered search matching your spiritual interests, travel dates, and preferences to ideal monasteries.',
        to: '/search',
        image: '/images/sangaChoeling.jpg',
        imageFocus: 'center 30%',
    },
    {
        icon: CalendarDays,
        title: 'Cultural Calendar',
        badge: 'Festival Dates',
        desc: 'Never miss a sacred Cham dance, Losar festival, or monastic ceremony across all monasteries.',
        to: '/calendar',
        image: '/images/pemayangtse.jpg',
        imageFocus: 'center 45%',
    },
    {
        icon: Headphones,
        title: 'Audio Guide',
        badge: 'EN · HI · NE · BO',
        desc: 'Multi-language narrations by expert cultural historians for each monastery and sacred space.',
        to: '/audio',
        image: '/images/enchey.jpg',
        imageFocus: 'center 25%',
    },
];

export default function Home() {
    return (
        <div>
            {/* ── Hero ─────────────────────────────────────────────────── */}
            <section className="home-hero">
                <span className="home-hero-eyebrow"><Landmark size={14} /> Digital Heritage Initiative</span>
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

            {/* ── Features ─────────────────────────────────────────────── */}
            <section style={{ padding: '5rem 0', background: 'var(--bg-deep)' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h2 style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 'clamp(1.5rem,3vw,2.25rem)',
                            color: 'var(--text-primary)',
                        }}>
                            Smart Features for <span className="gradient-text">Smart Tourism</span>
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '0.75rem', fontSize: '1rem' }}>
                            Explore the full Monastery360 platform — digital tools for heritage visitors
                        </p>
                    </div>

                    <div className="home-features-grid">
                        {FEATURES.map((f) => {
                            const Icon = f.icon;
                            return (
                                <Link
                                    to={f.to}
                                    key={f.title}
                                    className="feat-card"
                                    style={{
                                        backgroundImage: `url('${f.image}')`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: f.imageFocus,
                                        backgroundRepeat: 'no-repeat',
                                    }}
                                    aria-label={f.title}
                                >
                                    <div className="feat-card__overlay" />
                                    <div className="feat-card__body">
                                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                                            <div className="feat-card__icon">
                                                <Icon size={22} strokeWidth={1.75} />
                                            </div>
                                            <span className="feat-card__badge">{f.badge}</span>
                                        </div>
                                        <h3 className="feat-card__title">{f.title}</h3>
                                        <p className="feat-card__desc">{f.desc}</p>
                                        <div className="feat-card__footer">
                                            <span className="feat-card__cta">
                                                Explore <ArrowRight size={13} />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
}
