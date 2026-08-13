import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Compass, Shield, ChevronRight, Star, Video, Calendar, RefreshCw, Landmark, Mountain, MountainSnow, Snowflake, Trees } from 'lucide-react';
import monasteryService from '../../services/monasteryService';
import Loading from '../../components/UI/Loading';
import '../pages.css';
import '../FeatureCard.css';

const DISTRICTS = [
    { id: 'all', name: 'All Districts', count: '10 Monasteries', desc: 'Across Sikkim', icon: Landmark,
      image: '/images/lingdum.jpg', imageFocus: 'center 50%' },
    { id: 'East Sikkim', name: 'East Sikkim', count: 'Gangtok & Hubs', desc: 'Rumtek, Enchey, Lingdum', icon: Mountain,
      image: '/images/sangaChoeling.jpg', imageFocus: 'center 35%' },
    { id: 'West Sikkim', name: 'West Sikkim', count: 'Historic Heart', desc: 'Pemayangtse, Tashiding, Dubdi', icon: MountainSnow,
      image: '/images/pemayangtse.jpg', imageFocus: 'center 55%' },
    { id: 'North Sikkim', name: 'North Sikkim', count: 'High Altitude', desc: 'Phodong, Lachen', icon: Snowflake,
      image: '/images/lachen.jpg', imageFocus: 'center 40%' },
    { id: 'South Sikkim', name: 'South Sikkim', count: 'Serene Hills', desc: 'Ralang & Ravangla', icon: Trees,
      image: '/images/ralang.jpg', imageFocus: 'center 40%' },
];

const TAG_OPTIONS = [
    { id: 'all', label: 'All Categories' },
    { id: 'Nyingma', label: 'Nyingma' },
    { id: 'Kagyu', label: 'Kagyu' },
    { id: 'Heritage', label: 'Heritage' },
    { id: 'Spiritual', label: 'Spiritual' },
    { id: 'Peaceful', label: 'Peaceful' },
    { id: 'Popular', label: 'Popular' },
];

export default function Explore() {
    const [monasteries, setMonasteries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [search, setSearch] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('all');
    const [selectedTag, setSelectedTag] = useState('all');

    const fetchMonasteries = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = {};
            if (search.trim()) params.search = search.trim();
            if (selectedDistrict !== 'all') params.district = selectedDistrict;
            if (selectedTag !== 'all') params.tag = selectedTag;

            const res = await monasteryService.getAll(params);
            setMonasteries(res.data || []);
        } catch (err) {
            console.error('Failed to load monasteries:', err);
            setError(err.response?.data?.message || 'Unable to connect to monastery database.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMonasteries();
    }, [selectedDistrict, selectedTag]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchMonasteries();
    };

    const handleReset = () => {
        setSearch('');
        setSelectedDistrict('all');
        setSelectedTag('all');
    };

    return (
        <div className="container" style={{ padding: '3rem 1.5rem' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <span className="home-hero-eyebrow" style={{ marginBottom: '1rem' }}>
                    <Compass size={14} /> Sikkim Monastery Directory
                </span>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4vw,3rem)', color: 'var(--text-primary)' }}>
                    Explore Sacred <span className="gradient-text">Heritage Sites</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0.75rem auto 2rem', fontSize: '1rem', lineHeight: '1.6' }}>
                    Discover sacred centuries-old Buddhist monasteries across the four districts of Sikkim.
                </p>

                {/* Search Bar */}
                <form onSubmit={handleSearchSubmit} style={{
                    maxWidth: '560px',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-full)',
                    padding: '6px 16px',
                    boxShadow: 'var(--shadow-md)',
                }}>
                    <Search size={18} style={{ color: 'var(--color-primary)', marginRight: '10px', flexShrink: 0 }} />
                    <input
                        type="text"
                        placeholder="Search by monastery name, town, or tag..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            border: 'none',
                            background: 'transparent',
                            outline: 'none',
                            color: 'var(--text-primary)',
                            width: '100%',
                            fontSize: '0.9375rem',
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            background: 'var(--color-primary)',
                            color: 'var(--text-inverse)',
                            border: 'none',
                            borderRadius: 'var(--radius-full)',
                            padding: '6px 14px',
                            fontSize: '0.8125rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            marginLeft: '8px',
                            flexShrink: 0,
                        }}
                    >
                        Search
                    </button>
                </form>
            </div>

            {/* Districts Grid Filter */}
            <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>
                    Filter by District
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(185px, 1fr))', gap: '0.875rem' }}>
                    {DISTRICTS.map((d) => {
                        const Icon = d.icon;
                        const isActive = selectedDistrict === d.id;
                        return (
                            <div
                                key={d.id}
                                onClick={() => setSelectedDistrict(selectedDistrict === d.id ? 'all' : d.id)}
                                className={`feat-card feat-card--district${isActive ? ' is-active' : ''}`}
                                style={{
                                    backgroundImage: `url('${d.image}')`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: d.imageFocus,
                                    backgroundRepeat: 'no-repeat',
                                    cursor: 'pointer',
                                }}
                                role="button"
                                aria-pressed={isActive}
                            >
                                <div className="feat-card__overlay" />
                                <div className="feat-card__body">
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                                        <div className="feat-card__icon">
                                            <Icon size={18} strokeWidth={1.75} />
                                        </div>
                                        <span className="feat-card__badge">{d.count}</span>
                                    </div>
                                    <h3 className="feat-card__title">{d.name}</h3>
                                    <p className="feat-card__desc">{d.desc}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Tag / Category Filter Tabs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '2rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginRight: '4px' }}>Category:</span>
                {TAG_OPTIONS.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setSelectedTag(t.id)}
                        style={{
                            padding: '6px 14px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.8125rem',
                            fontWeight: 600,
                            border: selectedTag === t.id ? '1px solid var(--color-primary)' : '1px solid var(--border-medium)',
                            background: selectedTag === t.id ? 'var(--color-primary)' : 'var(--bg-card)',
                            color: selectedTag === t.id ? '#FFFFFF' : 'var(--text-primary)',
                            cursor: 'pointer',
                            transition: 'all var(--transition-fast)',
                        }}
                    >
                        {t.label}
                    </button>
                ))}

                {(selectedDistrict !== 'all' || selectedTag !== 'all' || search !== '') && (
                    <button
                        onClick={handleReset}
                        style={{
                            padding: '6px 12px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.8125rem',
                            fontWeight: 600,
                            background: 'transparent',
                            border: '1.5px dashed var(--color-primary)',
                            color: 'var(--color-primary)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            marginLeft: 'auto',
                        }}
                    >
                        <RefreshCw size={12} /> Reset Filters
                    </button>
                )}
            </div>

            {/* Content Area */}
            {loading ? (
                <div style={{ padding: '4rem', textAlign: 'center' }}>
                    <Loading />
                    <p style={{ color: 'var(--text-secondary)', marginTop: '1rem', fontWeight: 500 }}>Loading monastery catalogue from database...</p>
                </div>
            ) : error ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem', border: '1px solid rgba(232,69,69,0.3)', background: 'rgba(232,69,69,0.05)' }}>
                    <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontWeight: 700 }}>Failed to load catalogue</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{error}</p>
                    <button onClick={fetchMonasteries} className="btn btn--primary btn--md" style={{ padding: '8px 18px' }}>
                        Try Again
                    </button>
                </div>
            ) : monasteries.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3.5rem', background: 'var(--bg-card)' }}>
                    <Search size={44} style={{ color: 'var(--color-primary)', marginBottom: '1rem' }} />
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                        No Monasteries Found
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
                        We couldn't find any monasteries matching your search parameters. Try adjusting your district or search filter.
                    </p>
                    <button onClick={handleReset} className="btn btn--primary btn--md">
                        Reset All Filters
                    </button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                    {monasteries.map((m) => {
                        const primaryImg = m.images?.[0]?.url || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80';
                        return (
                            <div key={m._id} className="card card--hover" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', padding: 0 }}>
                                {/* Image Header */}
                                <div style={{ height: '180px', position: 'relative', overflow: 'hidden', background: 'var(--bg-elevated)' }}>
                                    <img
                                        src={primaryImg}
                                        alt={m.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    {/* District Tag Overlay */}
                                    <span style={{
                                        position: 'absolute',
                                        top: '12px',
                                        left: '12px',
                                        background: 'rgba(15, 23, 42, 0.85)',
                                        backdropFilter: 'blur(6px)',
                                        color: '#FFFFFF',
                                        padding: '4px 10px',
                                        borderRadius: 'var(--radius-full)',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        border: '1px solid rgba(244, 208, 111, 0.4)',
                                    }}>
                                        <MapPin size={12} style={{ color: '#F4D06F' }} /> {m.district}
                                    </span>

                                    {/* Badges */}
                                    <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '6px' }}>
                                        {m.virtualTourAvailable && (
                                            <span style={{
                                                background: '#8B2E2E',
                                                color: '#FFFFFF',
                                                padding: '4px 8px',
                                                borderRadius: 'var(--radius-full)',
                                                fontSize: '0.7rem',
                                                fontWeight: 700,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                border: '1px solid rgba(244, 208, 111, 0.4)',
                                            }}>
                                                <Video size={10} /> 360° VR
                                            </span>
                                        )}
                                        {m.bookingAvailable && (
                                            <span style={{
                                                background: 'var(--heritage-green)',
                                                color: '#FFFFFF',
                                                padding: '4px 8px',
                                                borderRadius: 'var(--radius-full)',
                                                fontSize: '0.7rem',
                                                fontWeight: 700,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                            }}>
                                                <Calendar size={10} /> Services
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Body */}
                                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                                        <span style={{ fontSize: '0.78125rem', color: 'var(--color-primary)', fontWeight: 700 }}>
                                            Est. {m.establishedYear || 'Historic'}
                                        </span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                            <Star size={14} fill="#B58B3A" color="#B58B3A" />
                                            <span>{m.rating || 4.5}</span>
                                            <span style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.75rem' }}>({m.reviewCount || 0})</span>
                                        </div>
                                    </div>

                                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                                        {m.name}
                                    </h3>

                                    <p style={{
                                        fontSize: '0.875rem',
                                        color: 'var(--text-secondary)',
                                        lineHeight: '1.55',
                                        marginBottom: '1rem',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                    }}>
                                        {m.shortDescription || m.description}
                                    </p>

                                    {/* Tags */}
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1.25rem', marginTop: 'auto' }}>
                                        {(m.tags || []).slice(0, 3).map((tag) => (
                                            <span key={tag} style={{
                                                fontSize: '0.725rem',
                                                fontWeight: 600,
                                                padding: '3px 8px',
                                                borderRadius: 'var(--radius-sm)',
                                                background: 'var(--bg-elevated)',
                                                border: '1px solid var(--border-medium)',
                                                color: 'var(--text-primary)',
                                            }}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Footer / Detail Action */}
                                    <div style={{
                                        paddingTop: '0.875rem',
                                        borderTop: '1px solid var(--border-subtle)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}>
                                        <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                                            {m.address?.split(',')[0] || m.district}
                                        </span>
                                        <Link to={`/explore/${m._id}`} style={{ textDecoration: 'none' }}>
                                            <button className="btn btn--outline btn--sm" style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                fontSize: '0.8125rem',
                                                fontWeight: 700,
                                                padding: '5px 12px',
                                                cursor: 'pointer',
                                            }}>
                                                View Details <ChevronRight size={14} />
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Heritage Notice Banner */}
            <div className="card" style={{
                border: '1px dashed var(--border-subtle)',
                background: 'rgba(var(--primary-rgb), 0.04)',
                textAlign: 'center',
                padding: '1.75rem',
            }}>
                <Shield size={22} style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }} />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                    Authentic Sikkimese Cultural Heritage Database
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '580px', margin: '0 auto' }}>
                    Monastery360 connects visitors directly with verified historical data, visitor guides, and spiritual heritage details across all districts of Sikkim.
                </p>
            </div>
        </div>
    );
}
