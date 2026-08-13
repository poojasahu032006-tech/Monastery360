import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Navigation, Layers, Info, Filter, Search, RefreshCw, Star, ArrowRight, Sun, Compass, Globe } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import monasteryService from '../../services/monasteryService';
import Loading from '../../components/UI/Loading';
import '../pages.css';

// Fix Leaflet's default icon path issues with Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
});

// Map Base Layers Definition
const MAP_LAYERS = [
    {
        id: 'dark',
        name: 'Dark Map',
        icon: '🌙',
        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19,
    },
    {
        id: 'street',
        name: 'Street Map',
        icon: '🗺️',
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
    },
    {
        id: 'satellite',
        name: 'Satellite View',
        icon: '🛰️',
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 18,
    },
    {
        id: 'terrain',
        name: 'Terrain View',
        icon: '⛰️',
        url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, SRTM | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
        maxZoom: 17,
    },
];

// Custom map controller to fit bounds dynamically when visible markers change
function MapController({ monasteries }) {
    const map = useMap();
    useEffect(() => {
        if (monasteries && monasteries.length > 0) {
            const validCoords = monasteries
                .map(m => {
                    const lat = m.latitude !== null && m.latitude !== undefined ? m.latitude : m.coordinates?.latitude;
                    const lng = m.longitude !== null && m.longitude !== undefined ? m.longitude : m.coordinates?.longitude;
                    return [lat, lng];
                })
                .filter(([lat, lng]) => typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng));

            if (validCoords.length > 0) {
                const bounds = L.latLngBounds(validCoords);
                map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
            }
        }
    }, [monasteries, map]);

    return null;
}

// Styled Custom Marker using L.divIcon
const createCustomIcon = (isActive) => {
    return L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
            <div style="
                display: flex;
                align-items: center;
                justify-content: center;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background: ${isActive ? 'var(--color-primary)' : 'var(--bg-elevated)'};
                color: ${isActive ? 'var(--text-inverse)' : 'var(--color-primary)'};
                border: 2px solid var(--color-primary);
                box-shadow: ${isActive ? '0 0 12px var(--color-primary)' : 'var(--shadow-sm)'};
                font-size: 16px;
                transition: all 0.2s ease;
                cursor: pointer;
            ">
                🏯
            </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
    });
};

export default function Map() {
    const [monasteries, setMonasteries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedLoc, setSelectedLoc] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeLayerId, setActiveLayerId] = useState('dark');

    const currentLayer = MAP_LAYERS.find(l => l.id === activeLayerId) || MAP_LAYERS[0];

    // Fetch all monasteries on load
    const fetchMonasteries = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await monasteryService.getAll();
            setMonasteries(res.data || []);
        } catch (err) {
            console.error('Failed to fetch monasteries for map:', err);
            setError(err.response?.data?.message || 'Unable to connect to monastery database.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMonasteries();
    }, []);

    // Extract dynamic districts from data
    const availableDistricts = Array.from(
        new Set(monasteries.map(m => m.district).filter(Boolean))
    ).sort();

    // In-memory search & district filter logic
    const filtered = monasteries.filter(m => {
        // Coords check: must have valid latitude and longitude
        const lat = m.latitude !== null && m.latitude !== undefined ? m.latitude : m.coordinates?.latitude;
        const lng = m.longitude !== null && m.longitude !== undefined ? m.longitude : m.coordinates?.longitude;
        const hasCoords = typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng);
        if (!hasCoords) return false;

        // District filter
        const matchesDistrict = selectedDistrict === 'all' || m.district.toLowerCase() === selectedDistrict.toLowerCase();

        // Search text check (name or district)
        const text = searchQuery.trim().toLowerCase();
        const matchesSearch = !text || 
            m.name.toLowerCase().includes(text) || 
            m.district.toLowerCase().includes(text);

        return matchesDistrict && matchesSearch;
    });

    // Auto-update selected location if current one is filtered out
    useEffect(() => {
        if (selectedLoc) {
            const stillVisible = filtered.find(m => m._id === selectedLoc._id);
            if (!stillVisible) {
                setSelectedLoc(filtered[0] || null);
            }
        } else if (filtered.length > 0) {
            setSelectedLoc(filtered[0]);
        }
    }, [filtered, selectedLoc]);

    const handleReset = () => {
        setSelectedDistrict('all');
        setSearchQuery('');
        if (filtered.length > 0) {
            setSelectedLoc(filtered[0]);
        }
    };

    return (
        <div className="container" style={{ padding: '3rem 1.5rem' }}>
            {/* Custom Leaflet Styling Overrides for Theme Unity */}
            <style>{`
                .leaflet-popup-content-wrapper {
                    background: var(--bg-card) !important;
                    color: var(--text-primary) !important;
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-md) !important;
                    box-shadow: var(--shadow-lg) !important;
                    padding: 4px;
                }
                .leaflet-popup-tip {
                    background: var(--bg-card) !important;
                    border: 1px solid var(--border-subtle);
                }
                .leaflet-container {
                    font-family: var(--font-body) !important;
                    background: var(--bg-deep) !important;
                }
                .leaflet-bar {
                    border: 1px solid var(--border-subtle) !important;
                    box-shadow: var(--shadow-md) !important;
                }
                .leaflet-bar a {
                    background: var(--bg-card) !important;
                    color: var(--text-primary) !important;
                    border-bottom: 1px solid var(--border-subtle) !important;
                }
                .leaflet-bar a:hover {
                    background: var(--bg-elevated) !important;
                    color: var(--color-primary-light) !important;
                }
            `}</style>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <span className="home-hero-eyebrow" style={{ marginBottom: '1rem' }}>
                    <MapPin size={14} /> Sikkim Interactive GIS Map
                </span>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4vw,3rem)', color: 'var(--text-primary)' }}>
                    Spatial Heritage <span className="gradient-text">Map Explorer</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0.75rem auto 0', fontSize: '1rem', lineHeight: '1.6' }}>
                    Locate centuries-old monasteries across Sikkim's mountainous terrain and switch between satellite, topographic, and street map layers.
                </p>
            </div>

            {/* Controls Bar */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1.25rem',
                marginBottom: '1.5rem',
                background: 'var(--bg-card)',
                padding: '1.25rem 1.5rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
            }}>
                {/* Search field */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-full)',
                    padding: '6px 14px',
                    width: '100%',
                    maxWidth: '280px',
                }}>
                    <Search size={16} style={{ color: 'var(--color-primary)', marginRight: '8px', flexShrink: 0 }} />
                    <input
                        type="text"
                        placeholder="Search by name or district..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            border: 'none',
                            background: 'transparent',
                            outline: 'none',
                            color: 'var(--text-primary)',
                            fontSize: '0.875rem',
                            width: '100%',
                        }}
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')} style={{ color: 'var(--text-muted)', fontSize: '0.8rem', padding: '2px 6px', border: 'none', cursor: 'pointer', background: 'none' }}>✕</button>
                    )}
                </div>

                {/* District Filter Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <Filter size={16} style={{ color: 'var(--color-primary)', marginRight: '2px' }} />
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>District:</span>
                    <button
                        onClick={() => setSelectedDistrict('all')}
                        style={{
                            padding: '4px 10px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.8125rem',
                            border: 'none',
                            background: selectedDistrict === 'all' ? 'var(--color-primary)' : 'var(--bg-elevated)',
                            color: selectedDistrict === 'all' ? 'var(--text-inverse)' : 'var(--text-secondary)',
                            cursor: 'pointer',
                            fontWeight: 500,
                            transition: 'all var(--transition-fast)',
                        }}
                    >
                        All
                    </button>
                    {availableDistricts.map((d) => (
                        <button
                            key={d}
                            onClick={() => setSelectedDistrict(d)}
                            style={{
                                padding: '4px 10px',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '0.8125rem',
                                border: 'none',
                                background: selectedDistrict === d ? 'var(--color-primary)' : 'var(--bg-elevated)',
                                color: selectedDistrict === d ? 'var(--text-inverse)' : 'var(--text-secondary)',
                                cursor: 'pointer',
                                fontWeight: 500,
                                transition: 'all var(--transition-fast)',
                            }}
                        >
                            {d}
                        </button>
                    ))}
                </div>

                {/* Map Layer Switcher */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <Layers size={16} style={{ color: 'var(--color-primary-light)', marginRight: '2px' }} />
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Layers:</span>
                    {MAP_LAYERS.map((layer) => {
                        const isActive = activeLayerId === layer.id;
                        return (
                            <button
                                key={layer.id}
                                onClick={() => setActiveLayerId(layer.id)}
                                title={layer.name}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    padding: '5px 11px',
                                    borderRadius: 'var(--radius-full)',
                                    fontSize: '0.8125rem',
                                    border: isActive ? '1px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                                    background: isActive ? 'rgba(201, 135, 58, 0.18)' : 'var(--bg-elevated)',
                                    color: isActive ? 'var(--color-primary-light)' : 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    fontWeight: isActive ? 600 : 500,
                                    transition: 'all var(--transition-fast)',
                                }}
                            >
                                <span>{layer.icon}</span>
                                <span>{layer.name}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Reset and Count */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: 'auto' }}>
                    {(selectedDistrict !== 'all' || searchQuery !== '') && (
                        <button
                            onClick={handleReset}
                            style={{
                                padding: '4px 12px',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '0.8125rem',
                                background: 'transparent',
                                border: '1px dashed var(--color-primary)',
                                color: 'var(--color-primary)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                            }}
                        >
                            <RefreshCw size={12} /> Reset
                        </button>
                    )}
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={14} style={{ color: 'var(--color-primary)' }} /> {filtered.length} Sites Mapped
                    </div>
                </div>
            </div>

            {/* Error or Loading or Empty Content Area */}
            {loading ? (
                <div style={{ padding: '6rem', textAlign: 'center', background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)' }}>
                    <Loading />
                    <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Loading GIS spatial markers...</p>
                </div>
            ) : error ? (
                <div className="card" style={{ textAlign: 'center', padding: '3.5rem', border: '1px solid rgba(232,69,69,0.3)', background: 'rgba(232,69,69,0.05)' }}>
                    <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Failed to load map data</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{error}</p>
                    <button onClick={fetchMonasteries} className="btn-primary" style={{ padding: '8px 18px' }}>
                        Try Again
                    </button>
                </div>
            ) : monasteries.filter(m => {
                const lat = m.latitude !== null && m.latitude !== undefined ? m.latitude : m.coordinates?.latitude;
                const lng = m.longitude !== null && m.longitude !== undefined ? m.longitude : m.coordinates?.longitude;
                return typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng);
            }).length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3.5rem', background: 'var(--bg-card)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗺️</div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                        No Coordinates Available
                    </h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '420px', margin: '0 auto' }}>
                        None of the monasteries in the catalogue have valid GIS coordinates configured yet.
                    </p>
                </div>
            ) : (
                /* Interactive Map Grid Container */
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                    
                    {/* Map Graphic Canvas Wrapper */}
                    <div style={{
                        position: 'relative',
                        minHeight: '480px',
                        borderRadius: 'var(--radius-xl)',
                        border: '1px solid var(--border-subtle)',
                        overflow: 'hidden',
                        boxShadow: 'var(--shadow-lg)',
                    }}>
                        {/* Top Status Overlay */}
                        <div style={{
                            position: 'absolute',
                            top: '15px',
                            left: '15px',
                            right: '15px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            zIndex: 1000,
                            pointerEvents: 'none',
                        }}>
                            <span className="badge badge--gold" style={{ display: 'flex', alignItems: 'center', gap: '6px', pointerEvents: 'auto' }}>
                                <Navigation size={12} /> {currentLayer.icon} {currentLayer.name}
                            </span>
                            <span style={{
                                fontSize: '0.75rem',
                                color: 'var(--text-muted)',
                                background: 'rgba(13, 15, 20, 0.85)',
                                padding: '4px 10px',
                                borderRadius: '4px',
                                backdropFilter: 'blur(4px)',
                                pointerEvents: 'auto',
                                border: '1px solid var(--border-subtle)',
                            }}>
                                {selectedDistrict !== 'all' ? `${selectedDistrict} View` : 'Sikkim Overview'}
                            </span>
                        </div>

                        {/* Leaflet MapContainer */}
                        {filtered.length === 0 ? (
                            <div style={{
                                height: '100%',
                                minHeight: '480px',
                                background: 'radial-gradient(ellipse at 50% 50%, #171E2D 0%, #0D0F14 100%)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: 'var(--text-secondary)',
                                padding: '2rem',
                                textAlign: 'center',
                            }}>
                                <span style={{ fontSize: '2rem', marginBottom: '8px' }}>🔍</span>
                                <h4 style={{ color: 'var(--text-primary)' }}>No monasteries match current criteria</h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Try resetting the filters or modifying your search query.</p>
                            </div>
                        ) : (
                            <MapContainer
                                center={[27.3, 88.5]}
                                zoom={10}
                                style={{ height: '100%', minHeight: '480px', width: '100%' }}
                            >
                                <TileLayer
                                    key={currentLayer.id}
                                    url={currentLayer.url}
                                    attribution={currentLayer.attribution}
                                    maxZoom={currentLayer.maxZoom}
                                />

                                {filtered.map((m) => {
                                    const lat = m.latitude !== null && m.latitude !== undefined ? m.latitude : m.coordinates?.latitude;
                                    const lng = m.longitude !== null && m.longitude !== undefined ? m.longitude : m.coordinates?.longitude;
                                    const primaryImg = m.images?.[0]?.url || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80';
                                    const isActive = selectedLoc && selectedLoc._id === m._id;

                                    return (
                                        <Marker
                                            key={m._id}
                                            position={[lat, lng]}
                                            icon={createCustomIcon(isActive)}
                                            eventHandlers={{
                                                click: () => {
                                                    setSelectedLoc(m);
                                                },
                                            }}
                                        >
                                            <Popup>
                                                <div style={{ color: 'var(--text-primary)', width: '220px', fontSize: '0.85rem' }}>
                                                    {primaryImg && (
                                                        <img
                                                            src={primaryImg}
                                                            alt={m.name}
                                                            style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginBottom: '8px' }}
                                                        />
                                                    )}
                                                    <h4 style={{ margin: '0 0 4px', fontSize: '0.95rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>{m.name}</h4>
                                                    <p style={{ margin: '0 0 4px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                                                        📍 {m.district}
                                                    </p>
                                                    <p style={{ margin: '0 0 8px', fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-primary-light)' }}>
                                                        ⭐ {m.rating || 4.5} / 5
                                                    </p>
                                                    <p style={{ margin: '0 0 12px', fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                                                        {m.shortDescription || (m.description ? m.description.substring(0, 60) + '...' : '')}
                                                    </p>
                                                    <Link to={`/explore/${m._id}`} style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '4px',
                                                        background: 'var(--color-primary)',
                                                        color: 'var(--text-inverse)',
                                                        padding: '6px 12px',
                                                        borderRadius: 'var(--radius-sm)',
                                                        textDecoration: 'none',
                                                        fontSize: '0.8rem',
                                                        fontWeight: 600,
                                                        textAlign: 'center',
                                                        transition: 'all 0.2s'
                                                    }}>
                                                        View Details <ArrowRight size={12} />
                                                    </Link>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    );
                                })}

                                <MapController monasteries={filtered} />
                            </MapContainer>
                        )}

                        {/* Bottom Legend Overlay */}
                        <div style={{
                            position: 'absolute',
                            bottom: '15px',
                            left: '15px',
                            right: '15px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: 'rgba(13, 15, 20, 0.85)',
                            backdropFilter: 'blur(8px)',
                            padding: '10px 16px',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-subtle)',
                            zIndex: 1000,
                        }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Click marker to inspect site details</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)' }}>Active Layer: {currentLayer.name}</span>
                        </div>
                    </div>

                    {/* Selected Location Sidebar */}
                    <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '480px' }}>
                        {selectedLoc ? (
                            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <span className="badge badge--gold">{selectedLoc.district}</span>
                                        <span style={{ fontSize: '0.8rem', color: '#4ADE80', fontWeight: 600 }}>● Active Heritage Site</span>
                                    </div>

                                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                                        {selectedLoc.name}
                                    </h2>

                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1.25rem' }}>
                                        <MapPin size={14} style={{ color: 'var(--color-primary)' }} /> 
                                        GPS: {selectedLoc.latitude.toFixed(4)}° N, {selectedLoc.longitude.toFixed(4)}° E
                                    </p>

                                    <div style={{
                                        background: 'var(--bg-elevated)',
                                        padding: '1rem',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--border-subtle)',
                                        marginBottom: '1.25rem',
                                    }}>
                                        <h4 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 600 }}>
                                            Location Insights
                                        </h4>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.8125rem' }}>
                                            <div>
                                                <span style={{ color: 'var(--text-muted)', display: 'block' }}>Established</span>
                                                <span style={{ color: 'var(--color-primary-light)', fontWeight: 600 }}>{selectedLoc.establishedYear || 'Historic'}</span>
                                            </div>
                                            <div>
                                                <span style={{ color: 'var(--text-muted)', display: 'block' }}>Rating</span>
                                                <span style={{ color: 'var(--text-primary)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '2px' }}>
                                                    ⭐ {selectedLoc.rating || 4.5}
                                                </span>
                                            </div>
                                            <div style={{ gridColumn: 'span 2' }}>
                                                <span style={{ color: 'var(--text-muted)', display: 'block' }}>Best Time to Visit</span>
                                                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{selectedLoc.bestTimeToVisit || 'All year round'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1rem' }}>
                                        {selectedLoc.shortDescription || selectedLoc.description}
                                    </p>
                                </div>

                                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', marginTop: 'auto' }}>
                                    <Link to={`/explore/${selectedLoc._id}`} style={{ textDecoration: 'none', display: 'block', marginBottom: '0.75rem' }}>
                                        <button className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px' }}>
                                            Explore Heritage & 360° Tours <ArrowRight size={16} />
                                        </button>
                                    </Link>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Info size={12} style={{ color: 'var(--color-primary)' }} /> Live crowd heatmaps and navigation routes will activate in upcoming updates.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '2rem', textAlign: 'center' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗺️</div>
                                <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Select a Monastery</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Click on a map marker or search to explore detailed heritage information.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

