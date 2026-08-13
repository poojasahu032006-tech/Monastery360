import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
    Search, MapPin, Navigation, Compass, AlertCircle, Phone,
    Clock, Shield, Star, Sparkles, Building2, Bus, Car,
    Hospital, HelpCircle, Hotel, Layers, ArrowRight, ExternalLink,
    RefreshCw, CheckCircle2, ChevronRight, AlertTriangle, Flame,
    Info, Landmark
} from 'lucide-react';
import {
    MONASTERIES_DATA,
    SIKKIM_POIS,
    POPULAR_SIKKIM_HUBS,
    TIME_SLOTS,
    CURRENT_DEFAULT_SLOT,
    calculateDistance,
    getApproxTravelTime,
    getCrowdStatus,
    getMonasteryCrowdAtSlot,
    getBestTimeSlot,
    getAlternativeMonastery,
    calculateRecommendationScore,
    parseSmartSearchQuery,
} from '../../data/sikkimTouristData';
import './SmartSearch.css';

export default function SmartSearch() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Query & Filters
    const [query, setQuery] = useState(searchParams.get('q') || '');
    const [categoryFilter, setCategoryFilter] = useState(searchParams.get('cat') || 'all');
    const [selectedSlot, setSelectedSlot] = useState(CURRENT_DEFAULT_SLOT);
    const [activeLostFilter, setActiveLostFilter] = useState(null);

    // Location State
    const [userCoords, setUserCoords] = useState({
        lat: 27.3288,
        lng: 88.6133,
        name: 'Gangtok (MG Marg Central)',
        source: 'default',
    });
    const [locationLoading, setLocationLoading] = useState(false);
    const [locationError, setLocationError] = useState(null);

    // ── Geolocation API Handler ──────────────────────────────────────────────
    const handleGetLocation = () => {
        setLocationLoading(true);
        setLocationError(null);

        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by your browser. Please select an area manually.');
            setLocationLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                // Identify closest recognized Sikkim hub name for clean display
                let closestHub = POPULAR_SIKKIM_HUBS[0];
                let minHubDist = 9999;
                POPULAR_SIKKIM_HUBS.forEach((hub) => {
                    const dist = calculateDistance(latitude, longitude, hub.lat, hub.lng);
                    if (dist < minHubDist) {
                        minHubDist = dist;
                        closestHub = hub;
                    }
                });

                setUserCoords({
                    lat: latitude,
                    lng: longitude,
                    name: minHubDist < 25 ? `${closestHub.name} Area` : `GPS Coordinates (${latitude.toFixed(3)}, ${longitude.toFixed(3)})`,
                    source: 'gps',
                });
                setLocationLoading(false);
            },
            (error) => {
                console.warn('Geolocation access denied/failed:', error);
                setLocationError('Location access is unavailable. Search your current area manually or select below:');
                setLocationLoading(false);
            },
            { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
        );
    };

    // ── Manual Location Hub Selector ─────────────────────────────────────────
    const handleSelectHub = (hub) => {
        setUserCoords({
            lat: hub.lat,
            lng: hub.lng,
            name: hub.name,
            source: 'manual',
        });
        setLocationError(null);
    };

    // ── Lost Tourist Quick Actions ───────────────────────────────────────────
    const handleLostAction = (actionType) => {
        setActiveLostFilter(actionType);
        switch (actionType) {
            case 'location':
                handleGetLocation();
                setQuery('');
                setCategoryFilter('all');
                break;
            case 'monasteries':
                setCategoryFilter('monasteries');
                setQuery('monastery near me');
                break;
            case 'transport':
                setCategoryFilter('transport');
                setQuery('bus station near me');
                break;
            case 'taxi':
                setCategoryFilter('transport');
                setQuery('taxi stand near me');
                break;
            case 'hospital':
                setCategoryFilter('hospitals');
                setQuery('hospital near me');
                break;
            case 'hotel':
                setCategoryFilter('hotels');
                setQuery('hotel near me');
                break;
            case 'help':
                setCategoryFilter('tourist_help');
                setQuery('tourist help near me');
                break;
            default:
                break;
        }
    };

    // ── Query computation ───────────────────────────────────────────────────
    const searchData = parseSmartSearchQuery(query, userCoords, categoryFilter, selectedSlot);
    const results = searchData.results;

    const CATEGORIES = [
        { id: 'all', label: 'All Places' },
        { id: 'monasteries', label: 'Monasteries' },
        { id: 'transport', label: 'Transport' },
        { id: 'tourist_help', label: 'Tourist Help' },
        { id: 'hospitals', label: 'Hospitals' },
        { id: 'hotels', label: 'Hotels' },
        { id: 'other', label: 'Other Places' },
    ];

    const QUICK_CHIPS = [
        'monastery near me',
        'bus station near me',
        'taxi stand near me',
        'hospital near me',
        'tourist help near me',
        'less crowded monastery near me',
        'how to reach Rumtek',
        'monastery with virtual tour',
    ];

    return (
        <div className="smart-search-page container">
            {/* ── Page Header ────────────────────────────────────────────── */}
            <div className="smart-search-header">
                <span className="smart-search-eyebrow">
                    <Compass size={15} /> Smart Tourist Assistance
                </span>
                <h1 className="smart-search-title">
                    Sikkim <span className="gradient-text">Discovery & Assistance</span>
                </h1>
                <p className="smart-search-subtitle">
                    Find where you are. Find where to go. Find the best time to visit. Smart routing, nearby emergency hubs, and live crowd optimization.
                </p>
            </div>

            {/* ── Lost or Need Help? Banner (Prominent Mode) ─────────────── */}
            <div className="lost-tourist-banner" role="region" aria-label="Tourist Emergency & Rapid Assistance">
                <div className="lost-tourist-header">
                    <div className="lost-tourist-title">
                        <AlertCircle size={22} style={{ color: '#8B2E2E' }} />
                        Lost or Need Immediate Help?
                    </div>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                        Tap any button below to instantly locate nearest tourist assistance:
                    </span>
                </div>

                <div className="lost-quick-actions-grid">
                    <button
                        className={`lost-action-btn ${activeLostFilter === 'location' ? 'is-active' : ''}`}
                        onClick={() => handleLostAction('location')}
                        title="Locate my position via GPS"
                    >
                        <MapPin size={20} />
                        <span>📍 Find My Location</span>
                    </button>
                    <button
                        className={`lost-action-btn ${activeLostFilter === 'monasteries' ? 'is-active' : ''}`}
                        onClick={() => handleLostAction('monasteries')}
                    >
                        <Landmark size={20} />
                        <span>🏯 Nearby Monasteries</span>
                    </button>
                    <button
                        className={`lost-action-btn ${activeLostFilter === 'transport' ? 'is-active' : ''}`}
                        onClick={() => handleLostAction('transport')}
                    >
                        <Bus size={20} />
                        <span>🚌 Bus / Transport</span>
                    </button>
                    <button
                        className={`lost-action-btn ${activeLostFilter === 'taxi' ? 'is-active' : ''}`}
                        onClick={() => handleLostAction('taxi')}
                    >
                        <Car size={20} />
                        <span>🚕 Taxi Stand</span>
                    </button>
                    <button
                        className={`lost-action-btn ${activeLostFilter === 'hospital' ? 'is-active' : ''}`}
                        onClick={() => handleLostAction('hospital')}
                    >
                        <Hospital size={20} />
                        <span>🏥 Nearby Hospital</span>
                    </button>
                    <button
                        className={`lost-action-btn ${activeLostFilter === 'hotel' ? 'is-active' : ''}`}
                        onClick={() => handleLostAction('hotel')}
                    >
                        <Hotel size={20} />
                        <span>🏨 Nearby Hotels</span>
                    </button>
                    <button
                        className={`lost-action-btn ${activeLostFilter === 'help' ? 'is-active' : ''}`}
                        onClick={() => handleLostAction('help')}
                    >
                        <HelpCircle size={20} />
                        <span>ℹ️ Tourist Help Desk</span>
                    </button>
                </div>
            </div>

            {/* ── Location Hub Card ───────────────────────────────────────── */}
            <div className="location-hub-card">
                <div className="location-top-bar">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            Your Current Location:
                        </span>
                        <span className="location-status-badge">
                            <span className="location-pulse-dot" />
                            {userCoords.name}
                        </span>
                    </div>

                    <button
                        className="btn-gps-action"
                        onClick={handleGetLocation}
                        disabled={locationLoading}
                        aria-label="Use My Current Location via GPS"
                    >
                        <Navigation size={16} />
                        {locationLoading ? 'Locating...' : '📍 Use My Current Location'}
                    </button>
                </div>

                {locationError && (
                    <div style={{
                        marginTop: '1rem',
                        padding: '10px 14px',
                        background: 'rgba(217, 119, 6, 0.12)',
                        border: '1px solid rgba(217, 119, 6, 0.35)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.875rem',
                        color: 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                    }}>
                        <AlertTriangle size={18} style={{ color: '#D97706', flexShrink: 0 }} />
                        <span>{locationError}</span>
                    </div>
                )}

                {/* Quick Area Switchers */}
                <div className="location-quick-hubs">
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        Select Area Manually:
                    </span>
                    {POPULAR_SIKKIM_HUBS.map((hub) => (
                        <button
                            key={hub.id}
                            className={`quick-hub-btn ${userCoords.name.includes(hub.name.split(' ')[0]) ? 'is-active' : ''}`}
                            onClick={() => handleSelectHub(hub)}
                        >
                            📍 {hub.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Search Input Card ───────────────────────────────────────── */}
            <div className="smart-search-box-card">
                <div className="search-input-wrapper">
                    <Search size={20} style={{ color: 'var(--color-primary)', marginRight: '6px', flexShrink: 0 }} />
                    <input
                        type="text"
                        className="search-input-main"
                        placeholder="Search 'monastery near me', 'taxi stand near me', 'hospital near me', 'how to reach Rumtek'..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        aria-label="Smart search query"
                    />
                    {query && (
                        <button
                            onClick={() => setQuery('')}
                            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
                            title="Clear query"
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* Quick Query Example Chips */}
                <div className="search-chips-row">
                    <span style={{ fontSize: '0.78125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        Popular queries:
                    </span>
                    {QUICK_CHIPS.map((chip) => (
                        <button
                            key={chip}
                            className="search-chip"
                            onClick={() => {
                                setQuery(chip);
                                setActiveLostFilter(null);
                            }}
                        >
                            {chip}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Category & Time Slot Filter Controls ─────────────────────── */}
            <div className="smart-filters-bar">
                <div className="category-tabs-group">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            className={`cat-tab-btn ${categoryFilter === cat.id ? 'is-active' : ''}`}
                            onClick={() => setCategoryFilter(cat.id)}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                <div className="time-slot-selector">
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={14} style={{ color: 'var(--color-primary)' }} />
                        Target Time Slot:
                    </span>
                    <select
                        className="time-slot-select"
                        value={selectedSlot}
                        onChange={(e) => setSelectedSlot(e.target.value)}
                    >
                        {TIME_SLOTS.map((slot) => (
                            <option key={slot.id} value={slot.id}>
                                {slot.label} ({slot.period})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* ── Results Summary ──────────────────────────────────────────── */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Found {results.length} results near {userCoords.name}
                </span>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                    *Travel times are mountain driving estimates
                </span>
            </div>

            {/* ── Results Grid ─────────────────────────────────────────────── */}
            {results.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem', background: 'var(--bg-card)' }}>
                    <Search size={44} style={{ color: 'var(--color-primary)', marginBottom: '1rem' }} />
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                        No Matching Places Found
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
                        We couldn't locate places matching "{query}". Try clearing the search or switching category filters.
                    </p>
                    <button
                        className="btn btn--primary btn--md"
                        onClick={() => {
                            setQuery('');
                            setCategoryFilter('all');
                            setActiveLostFilter(null);
                        }}
                    >
                        Reset Search Filters
                    </button>
                </div>
            ) : (
                <div className="search-results-grid">
                    {results.map((item) => {
                        if (item.itemType === 'monastery') {
                            const crowd = item.crowdInfo;
                            const isCrowded = crowd.occupancyPercent >= 70;
                            return (
                                <div key={item.id} className="monastery-smart-card">
                                    {/* Image Header */}
                                    <div className="card-img-header">
                                        <img src={item.image} alt={item.name} loading="lazy" />
                                        <div className="card-top-badges">
                                            <span className="card-dist-badge">
                                                <MapPin size={12} style={{ color: '#F4D06F' }} />
                                                {item.distanceKm !== null ? `${item.distanceKm} km away` : item.district}
                                            </span>
                                            <span className="card-score-badge">
                                                ⭐ {item.recommendationScore}% Recommended
                                            </span>
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="monastery-card-body">
                                        <h3 className="monastery-card-title">{item.name}</h3>

                                        <div className="monastery-meta-row">
                                            <span>{item.district}</span>
                                            <span>•</span>
                                            <span>⭐ {item.rating} ({item.reviewCount} reviews)</span>
                                            {item.travelTime && (
                                                <>
                                                    <span>•</span>
                                                    <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{item.travelTime}</span>
                                                </>
                                            )}
                                        </div>

                                        {/* Crowd Box */}
                                        <div
                                            className="card-crowd-box"
                                            style={{ background: crowd.bg, border: `1px solid ${crowd.border}` }}
                                        >
                                            <span className="card-crowd-badge" style={{ color: crowd.color }}>
                                                {crowd.badge}
                                            </span>
                                            <span className="card-crowd-metrics" style={{ color: crowd.color }}>
                                                {crowd.currentVisitors} / {crowd.capacity} visitors ({crowd.occupancyPercent}%)
                                            </span>
                                        </div>

                                        {/* Recommendation Reason */}
                                        <div className="card-recommend-reason">
                                            💡 {item.recommendationReason}
                                        </div>

                                        {/* Better Alternative Box (Shown when crowded) */}
                                        {isCrowded && item.alternative && (
                                            <div className="better-alt-box">
                                                <div className="better-alt-title">
                                                    <Sparkles size={13} /> Better Nearby Alternative
                                                </div>
                                                <div className="better-alt-name">
                                                    {item.alternative.monastery.name} ({item.alternative.distanceKm} km away)
                                                </div>
                                                <div className="better-alt-desc">
                                                    🟢 <strong>{item.alternative.crowd.badge}</strong> ({item.alternative.crowd.occupancyPercent}% occupied) · {item.alternative.reason}
                                                </div>
                                            </div>
                                        )}

                                        {/* Best Time Tip */}
                                        {item.bestSlot && (
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Clock size={12} style={{ color: '#16A34A' }} />
                                                <strong>Best Time to Visit:</strong> 🟢 {item.bestSlot.label} ({item.bestSlot.occupancyPercent}% crowd)
                                            </div>
                                        )}

                                        {/* Actions Footer */}
                                        <div className="card-actions-footer">
                                            <Link
                                                to={`/explore/${item.id}`}
                                                className="btn-card-action btn-card-action--outline"
                                            >
                                                View Details
                                            </Link>
                                            <Link
                                                to={`/crowd?select=${item.id}`}
                                                className="btn-card-action btn-card-action--primary"
                                            >
                                                View on Map <ChevronRight size={14} />
                                            </Link>
                                            <a
                                                href={`https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn-card-action btn-card-action--outline"
                                                title="Get Turn-by-Turn Directions"
                                            >
                                                Directions <ExternalLink size={12} />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        // POI Card (Transport, Hospital, Tourist Help, Hotel)
                        const getCategoryVisuals = (cat) => {
                            switch (cat) {
                                case 'hospital':
                                    return { icon: Hospital, bg: 'rgba(220,38,38,0.12)', color: '#DC2626', tag: 'Emergency Medical' };
                                case 'transport':
                                    return { icon: Bus, bg: 'rgba(37,99,235,0.12)', color: '#2563EB', tag: 'Transport Hub' };
                                case 'tourist_help':
                                    return { icon: HelpCircle, bg: 'rgba(139,46,46,0.12)', color: '#8B2E2E', tag: 'Tourist Assistance' };
                                case 'hotel':
                                    return { icon: Hotel, bg: 'rgba(217,119,6,0.12)', color: '#D97706', tag: 'Hotel & Stay' };
                                default:
                                    return { icon: Landmark, bg: 'rgba(100,116,139,0.12)', color: '#475569', tag: 'Sikkim POI' };
                            }
                        };

                        const vis = getCategoryVisuals(item.category);
                        const Icon = vis.icon;

                        return (
                            <div key={item.id} className="poi-smart-card">
                                <div className="poi-top-row">
                                    <div className="poi-icon-wrap" style={{ background: vis.bg, color: vis.color }}>
                                        <Icon size={22} />
                                    </div>
                                    <span
                                        className="poi-type-tag"
                                        style={{ background: vis.bg, color: vis.color, border: `1px solid ${vis.color}40` }}
                                    >
                                        {item.type || vis.tag}
                                    </span>
                                </div>

                                <h3 className="poi-title">{item.name}</h3>

                                <div className="monastery-meta-row">
                                    <span>{item.district}</span>
                                    {item.distanceKm !== null && (
                                        <>
                                            <span>•</span>
                                            <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                                                📍 {item.distanceKm} km away
                                            </span>
                                        </>
                                    )}
                                    {item.travelTime && (
                                        <>
                                            <span>•</span>
                                            <span>🚗 {item.travelTime}</span>
                                        </>
                                    )}
                                </div>

                                <div className="poi-status-row">
                                    <Clock size={13} style={{ color: 'var(--color-primary)' }} />
                                    <span>{item.status}</span>
                                </div>

                                <p className="poi-desc">{item.description}</p>

                                {item.phone && item.phone !== 'N/A' && (
                                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.875rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Phone size={13} style={{ color: '#16A34A' }} />
                                        <a href={`tel:${item.phone.split('/')[0].trim()}`} style={{ color: 'var(--text-primary)', textDecoration: 'underline' }}>
                                            {item.phone}
                                        </a>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="card-actions-footer">
                                    <a
                                        href={`https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-card-action btn-card-action--primary"
                                    >
                                        Get Directions <ExternalLink size={13} />
                                    </a>
                                    <Link
                                        to={`/map?lat=${item.lat}&lng=${item.lng}&name=${encodeURIComponent(item.name)}`}
                                        className="btn-card-action btn-card-action--outline"
                                    >
                                        View on Map
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
