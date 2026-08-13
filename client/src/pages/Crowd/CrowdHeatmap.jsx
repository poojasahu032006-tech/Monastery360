import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
    MapPin, Flame, Clock, Users, AlertTriangle, CheckCircle2,
    Sparkles, ArrowRight, Compass, Filter, RefreshCw, ExternalLink,
    ChevronRight, Layers, Star, Info, Shield, Moon, Globe, Mountain,
    Map as MapIcon, Ticket
} from 'lucide-react';
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
    MONASTERIES_DATA,
    TIME_SLOTS,
    CURRENT_DEFAULT_SLOT,
    getCrowdStatus,
    getMonasteryCrowdAtSlot,
    getBestTimeSlot,
    getAlternativeMonastery,
    calculateDistance,
} from '../../data/sikkimTouristData';
import {
    getMonasteryLiveTimetable,
    normalizeMonasteryId,
} from '../../data/monasteryBookingData';
import './CrowdHeatmap.css';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;

// Map controller to adjust bounds and focus
function MapCenterController({ selectedMonastery, monasteries }) {
    const map = useMap();

    useEffect(() => {
        if (selectedMonastery) {
            map.flyTo([selectedMonastery.lat, selectedMonastery.lng], 13, { duration: 1.2 });
        } else if (monasteries && monasteries.length > 0) {
            const bounds = L.latLngBounds(monasteries.map(m => [m.lat, m.lng]));
            map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
        }
    }, [selectedMonastery, monasteries, map]);

    return null;
}

// Custom Leaflet DivIcon generator for crowd levels
const createCrowdIcon = (occupancyPercent, isSelected) => {
    let color = '#16A34A'; // Green
    let pulseBg = 'rgba(22, 163, 74, 0.4)';
    if (occupancyPercent > 90) {
        color = '#991B1B'; // Dark Red
        pulseBg = 'rgba(153, 27, 27, 0.5)';
    } else if (occupancyPercent > 70) {
        color = '#DC2626'; // Red
        pulseBg = 'rgba(220, 38, 38, 0.5)';
    } else if (occupancyPercent > 30) {
        color = '#D97706'; // Amber / Yellow
        pulseBg = 'rgba(217, 119, 6, 0.4)';
    }

    return L.divIcon({
        className: 'crowd-custom-marker',
        html: `
            <div style="position: relative; display: flex; align-items: center; justify-content: center;">
                <div class="crowd-marker-pulse" style="background: ${pulseBg};"></div>
                <div class="crowd-marker-circle" style="
                    background: ${color};
                    border: ${isSelected ? '3px solid #F4D06F' : '2px solid #FFFFFF'};
                    transform: ${isSelected ? 'scale(1.25)' : 'scale(1)'};
                ">
                    ${occupancyPercent}%
                </div>
            </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20],
    });
};

const MAP_LAYERS = [
    {
        id: 'dark',
        name: 'Dark Map',
        icon: Moon,
        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    },
    {
        id: 'street',
        name: 'Street Map',
        icon: MapIcon,
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; OpenStreetMap contributors',
    },
    {
        id: 'satellite',
        name: 'Satellite',
        icon: Globe,
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: 'Tiles &copy; Esri',
    },
    {
        id: 'terrain',
        name: 'Terrain',
        icon: Mountain,
        url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        attribution: '&copy; OpenStreetMap contributors',
    },
];

export default function CrowdHeatmap() {
    const [searchParams] = useSearchParams();
    const initialSelectedId = searchParams.get('select') || 'rumtek';

    // State
    const [selectedSlot, setSelectedSlot] = useState(CURRENT_DEFAULT_SLOT);
    const [selectedCrowdFilter, setSelectedCrowdFilter] = useState('all');
    const [showOnlyAlternatives, setShowOnlyAlternatives] = useState(false);
    const [selectedMonasteryId, setSelectedMonasteryId] = useState(initialSelectedId);
    const [activeLayerId, setActiveLayerId] = useState('dark');

    // Selected monastery
    const selectedMonastery = MONASTERIES_DATA.find(m => m.id === selectedMonasteryId) || MONASTERIES_DATA[0];

    // Compute crowd states for all monasteries at current time-slot
    const monasteriesWithCrowd = MONASTERIES_DATA.map(mon => {
        const crowd = getMonasteryCrowdAtSlot(mon, selectedSlot);
        const bestSlot = getBestTimeSlot(mon);
        const alternative = crowd.occupancyPercent >= 70 ? getAlternativeMonastery(mon, MONASTERIES_DATA, selectedSlot) : null;
        return {
            ...mon,
            crowd,
            bestSlot,
            alternative,
        };
    });

    // Counts for legend summary
    const lowCount = monasteriesWithCrowd.filter(m => m.crowd.level === 'low').length;
    const modCount = monasteriesWithCrowd.filter(m => m.crowd.level === 'moderate').length;
    const highCount = monasteriesWithCrowd.filter(m => m.crowd.level === 'high' || m.crowd.level === 'full').length;

    // Filter monasteries
    const filteredMonasteries = monasteriesWithCrowd.filter(m => {
        if (showOnlyAlternatives) {
            return m.crowd.occupancyPercent <= 60;
        }
        if (selectedCrowdFilter === 'low') return m.crowd.level === 'low';
        if (selectedCrowdFilter === 'moderate') return m.crowd.level === 'moderate';
        if (selectedCrowdFilter === 'high') return m.crowd.level === 'high';
        if (selectedCrowdFilter === 'full') return m.crowd.level === 'full';
        return true;
    });

    const activeMapLayer = MAP_LAYERS.find(l => l.id === activeLayerId) || MAP_LAYERS[0];
    const currentSlotObj = TIME_SLOTS.find(s => s.id === selectedSlot) || TIME_SLOTS[2];
    const selectedMonasteryWithCrowd = monasteriesWithCrowd.find(m => m.id === selectedMonastery.id);

    return (
        <div className="crowd-heatmap-page container">
            {/* ── Page Header ────────────────────────────────────────────── */}
            <div className="crowd-header">
                <span className="crowd-eyebrow">
                    <Flame size={15} /> Live Visitor Density & Capacity Optimization
                </span>
                <h1 className="crowd-title">
                    Sacred Sites <span className="gradient-text">Crowd Management Heatmap</span>
                </h1>
                <p className="crowd-subtitle">
                    Avoid overcrowding. Discover better times and nearby alternatives. Real-time visitor density simulation to protect sacred ambiance and optimize travel itineraries.
                </p>
            </div>

            {/* ── Top Control Panel: Time Slot Selector & Heatmap Legend ─── */}
            <div className="crowd-control-panel">
                <div className="slot-selection-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Clock size={16} style={{ color: 'var(--color-primary)' }} />
                            Select Time Slot:
                        </span>
                        <div className="slot-buttons-group">
                            {TIME_SLOTS.map((slot) => (
                                <button
                                    key={slot.id}
                                    className={`slot-btn ${selectedSlot === slot.id ? 'is-active' : ''}`}
                                    onClick={() => setSelectedSlot(slot.id)}
                                >
                                    {slot.shortLabel}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Active slot indicator */}
                    <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-primary)', background: 'rgba(139,46,46,0.1)', padding: '4px 12px', borderRadius: 'var(--radius-full)' }}>
                        Current Window: {currentSlotObj.label} ({currentSlotObj.period})
                    </div>
                </div>

                {/* Heatmap Legend Bar with Live Counters */}
                <div className="crowd-legend-bar">
                    <div className="legend-items-list">
                        <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                            Crowd Legend:
                        </span>
                        <div className="legend-item">
                            <span className="legend-color-dot" style={{ background: '#16A34A' }} />
                            <span>LOW (0–30%) — {lowCount} Sites</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-color-dot" style={{ background: '#D97706' }} />
                            <span>MODERATE (31–70%) — {modCount} Sites</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-color-dot" style={{ background: '#DC2626' }} />
                            <span>HIGH (71–90%)</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-color-dot" style={{ background: '#991B1B' }} />
                            <span>FULL (91–100%+) — {highCount} Peak Sites</span>
                        </div>
                    </div>

                    {/* Map Layer Switcher */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {MAP_LAYERS.map((layer) => {
                            const Icon = layer.icon;
                            return (
                                <button
                                    key={layer.id}
                                    className={`quick-hub-btn ${activeLayerId === layer.id ? 'is-active' : ''}`}
                                    onClick={() => setActiveLayerId(layer.id)}
                                    title={layer.name}
                                >
                                    <Icon size={12} /> {layer.name}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── Filters Row ─────────────────────────────────────────────── */}
            <div className="crowd-filter-tabs">
                {['all', 'low', 'moderate', 'high', 'full'].map((lvl) => (
                    <button
                        key={lvl}
                        className={`crowd-tab-btn ${selectedCrowdFilter === lvl && !showOnlyAlternatives ? 'is-active' : ''}`}
                        onClick={() => {
                            setSelectedCrowdFilter(lvl);
                            setShowOnlyAlternatives(false);
                        }}
                    >
                        {lvl === 'all' ? 'All Monasteries' : `${lvl.toUpperCase()} CROWD`}
                    </button>
                ))}

                <button
                    className={`alternatives-toggle-btn ${showOnlyAlternatives ? 'is-active' : ''}`}
                    onClick={() => setShowOnlyAlternatives(!showOnlyAlternatives)}
                >
                    <Sparkles size={14} />
                    {showOnlyAlternatives ? 'Showing Recommended Alternatives' : 'Show Recommended Alternatives'}
                </button>
            </div>

            {/* ── Main Map & Status Card Layout ───────────────────────────── */}
            <div className="crowd-map-layout">
                {/* Interactive Leaflet Map */}
                <div className="crowd-map-container">
                    <MapContainer
                        center={[27.35, 88.45]}
                        zoom={10}
                        scrollWheelZoom={true}
                        className="crowd-map-leaflet"
                    >
                        <TileLayer
                            attribution={activeMapLayer.attribution}
                            url={activeMapLayer.url}
                            maxZoom={18}
                        />

                        <MapCenterController
                            selectedMonastery={selectedMonastery}
                            monasteries={filteredMonasteries}
                        />

                        {filteredMonasteries.map((m) => {
                            const isSelected = selectedMonasteryId === m.id;
                            const customIcon = createCrowdIcon(m.crowd.occupancyPercent, isSelected);

                            return (
                                <Marker
                                    key={m.id}
                                    position={[m.lat, m.lng]}
                                    icon={customIcon}
                                    eventHandlers={{
                                        click: () => setSelectedMonasteryId(m.id),
                                    }}
                                >
                                    <Popup>
                                        <div style={{ minWidth: '180px', padding: '4px' }}>
                                            <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                                                {m.name}
                                            </strong>
                                            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                                {m.district}
                                            </div>
                                            <div style={{
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                background: m.crowd.bg,
                                                color: m.crowd.color,
                                                fontWeight: 800,
                                                fontSize: '0.75rem',
                                                marginBottom: '8px',
                                            }}>
                                                {m.crowd.badge} ({m.crowd.occupancyPercent}%)
                                            </div>
                                            <button
                                                onClick={() => setSelectedMonasteryId(m.id)}
                                                style={{
                                                    width: '100%',
                                                    padding: '5px',
                                                    background: '#8B2E2E',
                                                    color: '#FFFFFF',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 700,
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                View Live Analytics
                                            </button>
                                        </div>
                                    </Popup>
                                </Marker>
                            );
                        })}
                    </MapContainer>
                </div>

                {/* Sidebar: Detail Status Card & Monastery Quick Select */}
                <div className="crowd-sidebar">
                    {selectedMonasteryWithCrowd && (
                        <div className="selected-monastery-card">
                            <div className="selected-card-header">
                                <div>
                                    <h3 className="selected-monastery-title">{selectedMonasteryWithCrowd.name}</h3>
                                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                                        {selectedMonasteryWithCrowd.district} · Est. {selectedMonasteryWithCrowd.establishedYear} · ⭐ {selectedMonasteryWithCrowd.rating}
                                    </span>
                                </div>
                                <span
                                    style={{
                                        padding: '4px 12px',
                                        borderRadius: 'var(--radius-full)',
                                        background: selectedMonasteryWithCrowd.crowd.bg,
                                        color: selectedMonasteryWithCrowd.crowd.color,
                                        border: `1px solid ${selectedMonasteryWithCrowd.crowd.border}`,
                                        fontSize: '0.78125rem',
                                        fontWeight: 800,
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {selectedMonasteryWithCrowd.crowd.badge}
                                </span>
                            </div>

                            {/* Visitor Numbers & Progress Bar */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                <span>Current Visitors: {selectedMonasteryWithCrowd.crowd.currentVisitors} / {selectedMonasteryWithCrowd.capacity}</span>
                                <span style={{ color: selectedMonasteryWithCrowd.crowd.color }}>{selectedMonasteryWithCrowd.crowd.occupancyPercent}% Occupied</span>
                            </div>

                            <div className="selected-occupancy-bar-wrap">
                                <div className="selected-occupancy-bar-bg">
                                    <div
                                        className="selected-occupancy-bar-fill"
                                        style={{
                                            width: `${Math.min(100, selectedMonasteryWithCrowd.crowd.occupancyPercent)}%`,
                                            background: selectedMonasteryWithCrowd.crowd.color,
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Current Recommendation Advisory */}
                            <div style={{
                                padding: '10px 12px',
                                background: selectedMonasteryWithCrowd.crowd.bg,
                                border: `1px solid ${selectedMonasteryWithCrowd.crowd.border}`,
                                borderRadius: 'var(--radius-md)',
                                fontSize: '0.8125rem',
                                color: 'var(--text-primary)',
                                lineHeight: '1.5',
                            }}>
                                <strong>Advisory:</strong> {selectedMonasteryWithCrowd.crowd.recommendation}
                            </div>

                            {/* Automatic Best Time Recommendation */}
                            {selectedMonasteryWithCrowd.bestSlot && (
                                <div style={{
                                    marginTop: '0.875rem',
                                    padding: '10px 12px',
                                    background: 'rgba(22, 163, 74, 0.1)',
                                    border: '1px solid rgba(22, 163, 74, 0.35)',
                                    borderRadius: 'var(--radius-md)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '0.8125rem',
                                }}>
                                    <Clock size={16} style={{ color: '#16A34A', flexShrink: 0 }} />
                                    <div>
                                        <strong style={{ color: '#16A34A' }}>Recommended Best Time:</strong>{' '}
                                        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                                            {selectedMonasteryWithCrowd.bestSlot.label} ({selectedMonasteryWithCrowd.bestSlot.occupancyPercent}% crowd)
                                        </span>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                            {selectedMonasteryWithCrowd.bestSlot.reason}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── Next Available Tour Slot (Booking Integration) ── */}
                            {(() => {
                                const monNormId = normalizeMonasteryId(selectedMonasteryWithCrowd.id);
                                const liveTT = getMonasteryLiveTimetable(monNormId || 'rumtek');
                                const nextSlot = liveTT.find(t => t.bookable && t.isBookable);
                                const fullSlots = liveTT.filter(t => t.bookable && !t.isBookable).length;
                                const totalBookable = liveTT.filter(t => t.bookable).length;
                                return (
                                    <div style={{
                                        marginTop: '0.875rem',
                                        padding: '10px 12px',
                                        background: nextSlot ? 'rgba(139,46,46,0.05)' : 'rgba(220,38,38,0.05)',
                                        border: `1px solid ${nextSlot ? 'rgba(139,46,46,0.2)' : 'rgba(220,38,38,0.25)'}`,
                                        borderRadius: 'var(--radius-md)',
                                        fontSize: '0.8125rem',
                                    }}>
                                        <div style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 5 }}>
                                            <Ticket size={13} style={{ color: 'var(--color-primary)' }} />
                                            Next Available Tour Slot
                                        </div>
                                        {nextSlot ? (
                                            <>
                                                <div style={{ fontWeight: 700, color: '#15803D', marginBottom: 2 }}>{nextSlot.time}</div>
                                                <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', marginBottom: 1 }}>{nextSlot.event}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#15803D', fontWeight: 700 }}>
                                                    {nextSlot.remaining} / {nextSlot.capacity} seats available
                                                </div>
                                                {fullSlots > 0 && (
                                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 3 }}>
                                                        {fullSlots} of {totalBookable} slots fully booked
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div style={{ color: '#DC2626', fontWeight: 700 }}>All tour slots fully booked for today</div>
                                        )}
                                    </div>
                                );
                            })()}

                            {/* Time Slots Breakdown Table */}
                            <div className="slots-breakdown-list">
                                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '2px' }}>
                                    Full Day Visitor Density Curve:
                                </span>
                                {TIME_SLOTS.map((slot) => {
                                    const slotCrowd = getMonasteryCrowdAtSlot(selectedMonasteryWithCrowd, slot.id);
                                    const isCurrent = slot.id === selectedSlot;

                                    return (
                                        <div
                                            key={slot.id}
                                            className={`slot-row-item ${isCurrent ? 'is-current' : ''}`}
                                            onClick={() => setSelectedSlot(slot.id)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <span style={{ color: 'var(--text-primary)' }}>
                                                {slot.label} {isCurrent && '📍 (Selected)'}
                                            </span>
                                            <span style={{ fontWeight: 800, color: slotCrowd.color }}>
                                                {slotCrowd.occupancyPercent}% ({slotCrowd.badge.split(' ')[0]})
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Full Monastery Alternative Recommendation Box */}
                            {selectedMonasteryWithCrowd.crowd.occupancyPercent >= 70 && selectedMonasteryWithCrowd.alternative && (
                                <div className="alternative-rec-box">
                                    <div className="alt-rec-header">
                                        <span className="alt-rec-title">
                                            <Sparkles size={14} /> High Crowd Advisory · Recommended Alternative
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
                                        {selectedMonasteryWithCrowd.alternative.monastery.name}
                                    </div>
                                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: '1.45', marginBottom: '10px' }}>
                                        🟢 <strong>{selectedMonasteryWithCrowd.alternative.crowd.badge}</strong> ({selectedMonasteryWithCrowd.alternative.crowd.occupancyPercent}% occupied) · {selectedMonasteryWithCrowd.alternative.reason}
                                    </div>

                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                            className="btn btn--secondary btn--sm"
                                            onClick={() => setSelectedMonasteryId(selectedMonasteryWithCrowd.alternative.monastery.id)}
                                        >
                                            View Alternative on Map
                                        </button>
                                        <Link
                                            to={`/explore/${selectedMonasteryWithCrowd.alternative.monastery.id}`}
                                            className="btn btn--outline btn--sm"
                                        >
                                            Explore Site Details
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: '8px', marginTop: '1.25rem', flexWrap: 'wrap' }}>
                                <Link
                                    to={`/explore/${selectedMonasteryWithCrowd.id}`}
                                    className="btn btn--primary btn--sm"
                                    style={{ flex: 1, minWidth: 120 }}
                                >
                                    Full Monastery Profile
                                </Link>
                                <a
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedMonasteryWithCrowd.lat},${selectedMonasteryWithCrowd.lng}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn--outline btn--sm"
                                    style={{ flexShrink: 0 }}
                                >
                                    Get Directions <ExternalLink size={12} />
                                </a>
                            </div>

                            <Link
                                to={`/explore/${selectedMonasteryWithCrowd.id}`}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                    marginTop: 8, padding: '8px 12px',
                                    borderRadius: 'var(--radius-md)',
                                    background: '#8B2E2E', color: '#FFFFFF',
                                    fontWeight: 700, fontSize: '0.8125rem',
                                    textDecoration: 'none',
                                    transition: 'background 160ms ease',
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = '#A53A3A'}
                                onMouseLeave={e => e.currentTarget.style.background = '#8B2E2E'}
                            >
                                <Ticket size={13} /> Reserve Experience at This Monastery
                            </Link>
                        </div>
                    )}

                    {/* Quick Monastery List */}
                    <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.5rem' }}>
                        All Monasteries in Sikkim ({filteredMonasteries.length}):
                    </div>

                    {filteredMonasteries.map((m) => (
                        <div
                            key={m.id}
                            className={`compact-monastery-item ${selectedMonasteryId === m.id ? 'is-selected' : ''}`}
                            onClick={() => setSelectedMonasteryId(m.id)}
                        >
                            <div>
                                <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                    {m.name}
                                </div>
                                <div style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)' }}>
                                    {m.district} · {m.openingHours}
                                </div>
                            </div>
                            <span
                                style={{
                                    padding: '3px 8px',
                                    borderRadius: 'var(--radius-full)',
                                    background: m.crowd.bg,
                                    color: m.crowd.color,
                                    fontSize: '0.725rem',
                                    fontWeight: 800,
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {m.crowd.occupancyPercent}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
