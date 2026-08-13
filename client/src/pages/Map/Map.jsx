import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import {
    MapPin,
    Navigation,
    Layers,
    Info,
    Filter,
    Search,
    RefreshCw,
    Star,
    ArrowRight,
    Globe,
    Moon,
    Map as MapIcon,
    Mountain,
    X
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

import monasteryService from '../../services/monasteryService';
import Loading from '../../components/UI/Loading';
import '../pages.css';

// Leaflet marker images
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet default marker
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow
});


// =====================================================
// MAP LAYERS
// =====================================================

const MAP_LAYERS = [
    {
        id: 'dark',
        name: 'Dark Map',
        icon: <Moon size={14} />,
        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        attribution:
            '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 19
    },

    {
        id: 'street',
        name: 'Street Map',
        icon: <MapIcon size={14} />,
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution:
            '&copy; OpenStreetMap contributors',
        maxZoom: 19
    },

    {
        id: 'satellite',
        name: 'Satellite',
        icon: <Globe size={14} />,
        url:
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution:
            'Tiles &copy; Esri',
        maxZoom: 18
    },

    {
        id: 'terrain',
        name: 'Terrain',
        icon: <Mountain size={14} />,
        url:
            'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        attribution:
            '&copy; OpenStreetMap contributors',
        maxZoom: 17
    }
];


// =====================================================
// MAP CONTROLLER
// =====================================================

function MapController({ monasteries }) {

    const map = useMap();

    useEffect(() => {

        if (!monasteries || monasteries.length === 0) {
            return;
        }

        const coordinates = monasteries
            .map((m) => {

                const lat =
                    m.latitude ??
                    m.coordinates?.latitude;

                const lng =
                    m.longitude ??
                    m.coordinates?.longitude;

                return [lat, lng];
            })
            .filter(([lat, lng]) => {

                return (
                    typeof lat === 'number' &&
                    typeof lng === 'number' &&
                    !Number.isNaN(lat) &&
                    !Number.isNaN(lng)
                );
            });

        if (coordinates.length > 0) {

            const bounds =
                L.latLngBounds(coordinates);

            map.fitBounds(bounds, {
                padding: [40, 40],
                maxZoom: 13
            });
        }

    }, [monasteries, map]);

    return null;
}


// =====================================================
// CUSTOM MARKER
// =====================================================

const createCustomIcon = (active) => {

    return L.divIcon({

        className: 'custom-leaflet-marker',

        html: `
            <div style="
                width:32px;
                height:32px;
                border-radius:50%;
                display:flex;
                align-items:center;
                justify-content:center;
                background:${active
                    ? 'var(--color-primary)'
                    : 'var(--bg-elevated)'};
                color:${active
                    ? 'var(--text-inverse)'
                    : 'var(--color-primary)'};
                border:2px solid var(--color-primary);
                box-shadow:${active
                    ? '0 0 14px var(--color-primary)'
                    : 'var(--shadow-sm)'};
            ">
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <line x1="3" y1="22" x2="21" y2="22"/>
                    <line x1="6" y1="18" x2="6" y2="11"/>
                    <line x1="10" y1="18" x2="10" y2="11"/>
                    <line x1="14" y1="18" x2="14" y2="11"/>
                    <line x1="18" y1="18" x2="18" y2="11"/>
                    <polygon points="12 2 20 7 4 7 12 2"/>
                </svg>
            </div>
        `,

        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
    });
};


// =====================================================
// MAIN MAP PAGE
// =====================================================

export default function Map() {

    const [searchParams] = useSearchParams();
    const [monasteries, setMonasteries] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);

    const [selectedLoc, setSelectedLoc] =
        useState(null);

    const [selectedDistrict, setSelectedDistrict] =
        useState('all');

    const [searchQuery, setSearchQuery] =
        useState(searchParams.get('q') || searchParams.get('name') || '');

    const [activeLayerId, setActiveLayerId] =
        useState('dark');


    const currentLayer =
        MAP_LAYERS.find(
            layer => layer.id === activeLayerId
        ) || MAP_LAYERS[0];


    // =================================================
    // FETCH MONASTERIES
    // =================================================

    const fetchMonasteries = async () => {

        setLoading(true);
        setError(null);

        try {

            const response =
                await monasteryService.getAll();

            const data = response?.data || [];
            setMonasteries(data);

            const selectId = searchParams.get('select');
            if (selectId && data.length > 0) {
                const found = data.find(m => m._id === selectId || m.name.toLowerCase().includes(selectId.toLowerCase()));
                if (found) setSelectedLoc(found);
            }

        } catch (err) {

            console.error(
                'Map monastery fetch error:',
                err
            );

            setError(
                err?.response?.data?.message ||
                'Unable to connect to monastery database.'
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {

        fetchMonasteries();

    }, []);


    // =================================================
    // DISTRICTS
    // =================================================

    const availableDistricts =
        Array.from(
            new Set(
                monasteries
                    .map(m => m.district)
                    .filter(Boolean)
            )
        ).sort();


    // =================================================
    // FILTER MONASTERIES
    // =================================================

    const filtered = monasteries.filter(m => {

        const lat =
            m.latitude ??
            m.coordinates?.latitude;

        const lng =
            m.longitude ??
            m.coordinates?.longitude;

        const validCoordinates =
            typeof lat === 'number' &&
            typeof lng === 'number' &&
            !Number.isNaN(lat) &&
            !Number.isNaN(lng);

        if (!validCoordinates) {
            return false;
        }


        const district =
            m.district || '';

        const name =
            m.name || '';


        const matchesDistrict =
            selectedDistrict === 'all' ||
            district.toLowerCase() ===
            selectedDistrict.toLowerCase();


        const search =
            searchQuery.trim().toLowerCase();


        const matchesSearch =
            !search ||
            name.toLowerCase().includes(search) ||
            district.toLowerCase().includes(search);


        return (
            matchesDistrict &&
            matchesSearch
        );
    });


    // =================================================
    // SELECT FIRST RESULT
    // =================================================

    useEffect(() => {

        if (filtered.length === 0) {

            setSelectedLoc(null);
            return;
        }


        if (!selectedLoc) {

            setSelectedLoc(filtered[0]);
            return;
        }


        const exists =
            filtered.some(
                m => m._id === selectedLoc._id
            );


        if (!exists) {

            setSelectedLoc(filtered[0]);
        }

    }, [
        filtered,
        selectedLoc
    ]);


    // =================================================
    // RESET
    // =================================================

    const handleReset = () => {

        setSelectedDistrict('all');
        setSearchQuery('');

        if (filtered.length > 0) {
            setSelectedLoc(filtered[0]);
        }
    };


    // =================================================
    // RENDER
    // =================================================

    return (

        <div
            className="container"
            style={{
                padding: '3rem 1.5rem'
            }}
        >

            {/* HEADER */}

            <div
                style={{
                    textAlign: 'center',
                    marginBottom: '2.5rem'
                }}
            >

                <span
                    className="home-hero-eyebrow"
                    style={{
                        marginBottom: '1rem'
                    }}
                >
                    <MapPin size={14} />

                    Sikkim Interactive GIS Map
                </span>


                <h1
                    style={{
                        fontFamily:
                            'var(--font-display)',

                        fontSize:
                            'clamp(2rem,4vw,3rem)',

                        color:
                            'var(--text-primary)'
                    }}
                >
                    Spatial Heritage{' '}

                    <span className="gradient-text">
                        Map Explorer
                    </span>
                </h1>


                <p
                    style={{
                        color:
                            'var(--text-secondary)',

                        maxWidth: '600px',

                        margin:
                            '0.75rem auto 0',

                        lineHeight: '1.6'
                    }}
                >
                    Locate centuries-old monasteries
                    across Sikkim and explore their
                    heritage locations using an
                    interactive map.
                </p>

            </div>


            {/* CONTROLS */}

            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    marginBottom: '1.5rem',
                    background: 'var(--bg-card)',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-lg)',
                    border:
                        '1px solid var(--border-subtle)'
                }}
            >

                {/* SEARCH */}

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        background:
                            'var(--bg-elevated)',
                        border:
                            '1px solid var(--border-subtle)',
                        borderRadius:
                            'var(--radius-full)',
                        padding: '6px 14px',
                        width: '100%',
                        maxWidth: '280px'
                    }}
                >

                    <Search
                        size={16}
                        style={{
                            color:
                                'var(--color-primary)',
                            marginRight: '8px'
                        }}
                    />


                    <input
                        type="text"
                        placeholder="Search monastery or district..."
                        value={searchQuery}
                        onChange={(e) =>
                            setSearchQuery(
                                e.target.value
                            )
                        }
                        style={{
                            border: 'none',
                            background: 'transparent',
                            outline: 'none',
                            color:
                                'var(--text-primary)',
                            width: '100%'
                        }}
                    />


                    {searchQuery && (

                        <button
                            onClick={() =>
                                setSearchQuery('')
                            }
                            style={{
                                border: 'none',
                                background: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            <X size={14} />
                        </button>

                    )}

                </div>


                {/* DISTRICTS */}

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        flexWrap: 'wrap'
                    }}
                >

                    <Filter
                        size={16}
                        style={{
                            color:
                                'var(--color-primary)'
                        }}
                    />

                    <span
                        style={{
                            fontSize: '0.8rem',
                            color:
                                'var(--text-muted)'
                        }}
                    >
                        District:
                    </span>


                    <button
                        onClick={() =>
                            setSelectedDistrict('all')
                        }
                        style={{
                            padding: '5px 11px',
                            borderRadius:
                                'var(--radius-full)',
                            border: 'none',
                            background:
                                selectedDistrict === 'all'
                                    ? 'var(--color-primary)'
                                    : 'var(--bg-elevated)',
                            color:
                                selectedDistrict === 'all'
                                    ? 'var(--text-inverse)'
                                    : 'var(--text-secondary)',
                            cursor: 'pointer'
                        }}
                    >
                        All
                    </button>


                    {availableDistricts.map(
                        district => (

                            <button
                                key={district}
                                onClick={() =>
                                    setSelectedDistrict(
                                        district
                                    )
                                }
                                style={{
                                    padding:
                                        '5px 11px',
                                    borderRadius:
                                        'var(--radius-full)',
                                    border: 'none',
                                    background:
                                        selectedDistrict === district
                                            ? 'var(--color-primary)'
                                            : 'var(--bg-elevated)',
                                    color:
                                        selectedDistrict === district
                                            ? 'var(--text-inverse)'
                                            : 'var(--text-secondary)',
                                    cursor: 'pointer'
                                }}
                            >
                                {district}
                            </button>

                        )
                    )}

                </div>


                {/* LAYERS */}

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        flexWrap: 'wrap'
                    }}
                >

                    <Layers
                        size={16}
                        style={{
                            color:
                                'var(--color-primary)'
                        }}
                    />


                    {MAP_LAYERS.map(layer => (

                        <button
                            key={layer.id}
                            onClick={() =>
                                setActiveLayerId(
                                    layer.id
                                )
                            }
                            title={layer.name}
                            style={{
                                display:
                                    'inline-flex',
                                alignItems:
                                    'center',
                                gap: '5px',
                                padding:
                                    '5px 10px',
                                borderRadius:
                                    'var(--radius-full)',
                                border:
                                    activeLayerId === layer.id
                                        ? '1px solid var(--color-primary)'
                                        : '1px solid var(--border-subtle)',
                                background:
                                    activeLayerId === layer.id
                                        ? 'rgba(var(--primary-rgb),0.18)'
                                        : 'var(--bg-elevated)',
                                color:
                                    activeLayerId === layer.id
                                        ? 'var(--color-primary-light)'
                                        : 'var(--text-secondary)',
                                cursor: 'pointer'
                            }}
                        >

                            {layer.icon}

                            {layer.name}

                        </button>

                    ))}

                </div>


                {/* RESET + COUNT */}

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}
                >

                    {(selectedDistrict !== 'all' ||
                        searchQuery) && (

                        <button
                            onClick={handleReset}
                            style={{
                                display:
                                    'flex',
                                alignItems:
                                    'center',
                                gap: '5px',
                                padding:
                                    '5px 12px',
                                borderRadius:
                                    'var(--radius-full)',
                                border:
                                    '1px dashed var(--color-primary)',
                                color:
                                    'var(--color-primary)',
                                background:
                                    'transparent',
                                cursor: 'pointer'
                            }}
                        >

                            <RefreshCw size={12} />

                            Reset

                        </button>

                    )}


                    <span
                        style={{
                            fontSize:
                                '0.8rem',
                            color:
                                'var(--text-muted)'
                        }}
                    >
                        <MapPin size={13} />

                        {' '}

                        {filtered.length}
                        {' '}
                        Sites Mapped
                    </span>

                </div>

            </div>


            {/* LOADING */}

            {loading && (

                <div
                    style={{
                        padding: '6rem',
                        textAlign: 'center',
                        background:
                            'var(--bg-card)',
                        borderRadius:
                            'var(--radius-xl)'
                    }}
                >

                    <Loading />

                    <p
                        style={{
                            color:
                                'var(--text-muted)',
                            marginTop: '1rem'
                        }}
                    >
                        Loading monastery map...
                    </p>

                </div>

            )}


            {/* ERROR */}

            {!loading && error && (

                <div
                    className="card"
                    style={{
                        textAlign: 'center',
                        padding: '3rem'
                    }}
                >

                    <MapPin
                        size={40}
                        style={{
                            color:
                                'var(--color-primary)',
                            marginBottom: '1rem'
                        }}
                    />

                    <h3>
                        Failed to load map data
                    </h3>

                    <p
                        style={{
                            color:
                                'var(--text-muted)',
                            marginBottom: '1rem'
                        }}
                    >
                        {error}
                    </p>

                    <button
                        onClick={fetchMonasteries}
                        className="btn-primary"
                    >
                        Try Again
                    </button>

                </div>

            )}


            {/* MAP */}

            {!loading &&
                !error &&
                filtered.length === 0 && (

                    <div
                        className="card"
                        style={{
                            textAlign: 'center',
                            padding: '4rem'
                        }}
                    >

                        <Search
                            size={42}
                            style={{
                                color:
                                    'var(--color-primary)',
                                marginBottom:
                                    '1rem'
                            }}
                        />

                        <h3>
                            No monasteries found
                        </h3>

                        <p
                            style={{
                                color:
                                    'var(--text-muted)'
                            }}
                        >
                            Try changing your
                            search or district filter.
                        </p>

                        <button
                            onClick={handleReset}
                            className="btn-primary"
                            style={{
                                marginTop: '1rem'
                            }}
                        >
                            Reset Filters
                        </button>

                    </div>

                )}


            {!loading &&
                !error &&
                filtered.length > 0 && (

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns:
                                'minmax(0, 2fr) minmax(300px, 1fr)',
                            gap: '1.5rem'
                        }}
                    >

                        {/* MAP */}

                        <div
                            style={{
                                position: 'relative',
                                minHeight: '500px',
                                borderRadius:
                                    'var(--radius-xl)',
                                overflow: 'hidden',
                                border:
                                    '1px solid var(--border-subtle)'
                            }}
                        >

                            <div
                                style={{
                                    position: 'absolute',
                                    top: '15px',
                                    left: '15px',
                                    zIndex: 1000,
                                    background:
                                        'var(--navbar-bg)',
                                    padding:
                                        '8px 12px',
                                    borderRadius:
                                        'var(--radius-full)',
                                    display: 'flex',
                                    alignItems:
                                        'center',
                                    gap: '6px'
                                }}
                            >

                                <Navigation size={14} />

                                {currentLayer.name}

                            </div>


                            <MapContainer
                                center={[
                                    27.3,
                                    88.5
                                ]}
                                zoom={10}
                                style={{
                                    height: '500px',
                                    width: '100%'
                                }}
                            >

                                <TileLayer
                                    key={
                                        currentLayer.id
                                    }
                                    url={
                                        currentLayer.url
                                    }
                                    attribution={
                                        currentLayer.attribution
                                    }
                                    maxZoom={
                                        currentLayer.maxZoom
                                    }
                                />


                                {filtered.map(m => {

                                    const lat =
                                        m.latitude ??
                                        m.coordinates?.latitude;

                                    const lng =
                                        m.longitude ??
                                        m.coordinates?.longitude;

                                    const image =
                                        m.images?.[0]?.url ||
                                        'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80';

                                    const active =
                                        selectedLoc?._id ===
                                        m._id;


                                    return (

                                        <Marker
                                            key={m._id}
                                            position={[
                                                lat,
                                                lng
                                            ]}
                                            icon={
                                                createCustomIcon(
                                                    active
                                                )
                                            }
                                            eventHandlers={{
                                                click: () =>
                                                    setSelectedLoc(
                                                        m
                                                    )
                                            }}
                                        >

                                            <Popup>

                                                <div
                                                    style={{
                                                        width:
                                                            '220px'
                                                    }}
                                                >

                                                    <img
                                                        src={image}
                                                        alt={
                                                            m.name
                                                        }
                                                        style={{
                                                            width:
                                                                '100%',
                                                            height:
                                                                '100px',
                                                            objectFit:
                                                                'cover',
                                                            borderRadius:
                                                                '8px'
                                                        }}
                                                    />


                                                    <h4>
                                                        {
                                                            m.name
                                                        }
                                                    </h4>


                                                    <p>
                                                        <MapPin
                                                            size={12}
                                                        />

                                                        {' '}

                                                        {
                                                            m.district ||
                                                            'Sikkim'
                                                        }
                                                    </p>


                                                    <p>
                                                        <Star
                                                            size={12}
                                                            fill="currentColor"
                                                        />

                                                        {' '}

                                                        {
                                                            m.rating ||
                                                            4.5
                                                        }

                                                        / 5
                                                    </p>


                                                    <Link
                                                        to={`/explore/${m._id}`}
                                                        style={{
                                                            display:
                                                                'flex',
                                                            alignItems:
                                                                'center',
                                                            justifyContent:
                                                                'center',
                                                            gap:
                                                                '5px',
                                                            background:
                                                                'var(--color-primary)',
                                                            color:
                                                                'var(--text-inverse)',
                                                            padding:
                                                                '7px',
                                                            borderRadius:
                                                                '6px',
                                                            textDecoration:
                                                                'none'
                                                        }}
                                                    >

                                                        View Details

                                                        <ArrowRight
                                                            size={13}
                                                        />

                                                    </Link>

                                                </div>

                                            </Popup>

                                        </Marker>

                                    );

                                })}


                                <MapController
                                    monasteries={
                                        filtered
                                    }
                                />

                            </MapContainer>


                            <div
                                style={{
                                    position:
                                        'absolute',
                                    bottom:
                                        '15px',
                                    left:
                                        '15px',
                                    right:
                                        '15px',
                                    zIndex:
                                        1000,
                                    background:
                                        'var(--navbar-bg)',
                                    padding:
                                        '10px 14px',
                                    borderRadius:
                                        'var(--radius-md)',
                                    display:
                                        'flex',
                                    justifyContent:
                                        'space-between',
                                    fontSize:
                                        '0.8rem'
                                }}
                            >

                                <span>
                                    Click a marker
                                    to view details
                                </span>

                                <span>
                                    {currentLayer.name}
                                </span>

                            </div>

                        </div>


                        {/* SIDEBAR */}

                        <div
                            className="card"
                            style={{
                                minHeight:
                                    '500px',
                                padding:
                                    '1.5rem'
                            }}
                        >

                            {selectedLoc ? (

                                <div
                                    style={{
                                        height:
                                            '100%',
                                        display:
                                            'flex',
                                        flexDirection:
                                            'column'
                                    }}
                                >

                                    <span
                                        className="badge badge--gold"
                                    >
                                        {
                                            selectedLoc.district ||
                                            'Sikkim'
                                        }
                                    </span>


                                    <h2
                                        style={{
                                            fontFamily:
                                                'var(--font-display)',
                                            marginTop:
                                                '1rem'
                                        }}
                                    >
                                        {
                                            selectedLoc.name
                                        }
                                    </h2>


                                    <p
                                        style={{
                                            color:
                                                'var(--text-muted)',
                                            fontSize:
                                                '0.85rem'
                                        }}
                                    >
                                        <MapPin
                                            size={14}
                                        />

                                        {' '}

                                        {selectedLoc.latitude ??
                                            selectedLoc.coordinates?.latitude}

                                        ,{' '}

                                        {selectedLoc.longitude ??
                                            selectedLoc.coordinates?.longitude}
                                    </p>


                                    <div
                                        style={{
                                            background:
                                                'var(--bg-elevated)',
                                            padding:
                                                '1rem',
                                            borderRadius:
                                                'var(--radius-md)',
                                            marginTop:
                                                '1rem'
                                        }}
                                    >

                                        <h4>
                                            Location Insights
                                        </h4>


                                        <p>
                                            <strong>
                                                Established:
                                            </strong>

                                            {' '}

                                            {
                                                selectedLoc.establishedYear ||
                                                'Historic'
                                            }
                                        </p>


                                        <p>
                                            <strong>
                                                Rating:
                                            </strong>

                                            {' '}

                                            ⭐

                                            {' '}

                                            {
                                                selectedLoc.rating ||
                                                4.5
                                            }
                                        </p>


                                        <p>
                                            <strong>
                                                Best Time:
                                            </strong>

                                            {' '}

                                            {
                                                selectedLoc.bestTimeToVisit ||
                                                'All year round'
                                            }
                                        </p>

                                    </div>


                                    <p
                                        style={{
                                            color:
                                                'var(--text-secondary)',
                                            lineHeight:
                                                '1.5',
                                            marginTop:
                                                '1rem'
                                        }}
                                    >
                                        {
                                            selectedLoc.shortDescription ||
                                            selectedLoc.description ||
                                            'Explore the history and cultural heritage of this monastery.'
                                        }
                                    </p>


                                    <div
                                        style={{
                                            marginTop:
                                                'auto'
                                        }}
                                    >

                                        <Link
                                            to={`/explore/${selectedLoc._id}`}
                                            style={{
                                                textDecoration:
                                                    'none'
                                            }}
                                        >

                                            <button
                                                className="btn-primary"
                                                style={{
                                                    width:
                                                        '100%',
                                                    display:
                                                        'flex',
                                                    justifyContent:
                                                        'center',
                                                    alignItems:
                                                        'center',
                                                    gap:
                                                        '6px'
                                                }}
                                            >

                                                Explore Heritage

                                                <ArrowRight
                                                    size={16}
                                                />

                                            </button>

                                        </Link>


                                        <p
                                            style={{
                                                fontSize:
                                                    '0.75rem',
                                                color:
                                                    'var(--text-muted)',
                                                marginTop:
                                                    '1rem'
                                            }}
                                        >

                                            <Info
                                                size={12}
                                            />

                                            {' '}

                                            Interactive heritage
                                            map for Sikkim
                                            monasteries.

                                        </p>

                                    </div>

                                </div>

                            ) : (

                                <div
                                    style={{
                                        textAlign:
                                            'center',
                                        padding:
                                            '3rem 1rem'
                                    }}
                                >

                                    <MapIcon
                                        size={44}
                                    />

                                    <h3>
                                        Select a Monastery
                                    </h3>

                                    <p>
                                        Click any marker
                                        on the map.
                                    </p>

                                </div>

                            )}

                        </div>

                    </div>

                )}

        </div>
    );
}