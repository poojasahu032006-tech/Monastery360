import React, { useState, useEffect } from 'react';
import {
    Clock, Users, CheckCircle, Calendar,
    ChevronDown, ChevronUp, BookOpen, Sparkles
} from 'lucide-react';
import {
    getMonasteryLiveTimetable,
    normalizeMonasteryId,
    MONASTERY_TIMETABLES,
    DEFAULT_MONASTERY_TIMETABLE,
} from '../../data/monasteryBookingData';

// ─── Status config ────────────────────────────────────────────────────────────
function getTypeConfig(type) {
    switch (type) {
        case 'tour':     return { bg: 'rgba(139,46,46,0.08)',   border: 'rgba(139,46,46,0.22)', dot: '#8B2E2E',  label: 'Guided Tour' };
        case 'cultural': return { bg: 'rgba(154,110,30,0.08)', border: 'rgba(154,110,30,0.22)', dot: '#9A6E1E', label: 'Cultural' };
        case 'prayer':   return { bg: 'rgba(37,82,64,0.07)',   border: 'rgba(37,82,64,0.2)',   dot: '#255240',  label: 'Prayer / Ceremony' };
        case 'break':    return { bg: 'rgba(100,116,139,0.06)', border: 'rgba(100,116,139,0.15)', dot: '#64748B', label: 'Visitor Break' };
        default:         return { bg: 'var(--bg-elevated)',    border: 'var(--border-subtle)',  dot: '#94A3B8',  label: 'Scheduled Activity' };
    }
}

// ─── Individual timetable row ─────────────────────────────────────────────────
function TimetableRow({ item, onBook }) {
    const cfg = getTypeConfig(item.type);
    const isFull = item.remaining === 0;
    const isFilling = item.remaining !== null && item.remaining > 0 && item.remaining <= 5;
    const isAvail = item.remaining !== null && item.remaining > 5;

    let seatColor = 'var(--text-muted)';
    let seatBadge = null;
    if (isFull)    { seatColor = '#DC2626'; seatBadge = 'FULL'; }
    if (isFilling) { seatColor = '#B45309'; }
    if (isAvail)   { seatColor = '#15803D'; }

    return (
        <div style={{
            display: 'flex', gap: '1rem', padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            background: cfg.bg,
            border: `1px solid ${cfg.border}`,
            marginBottom: '0.5rem',
            transition: 'box-shadow 180ms ease',
            alignItems: 'flex-start',
        }}>
            {/* Left: dot + time */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, paddingTop: 2 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
                <div style={{ width: 1, flex: 1, minHeight: 16, background: `${cfg.dot}33`, marginTop: 4 }} />
            </div>

            {/* Centre: content */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: cfg.dot, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 2 }}>
                    <Clock size={10} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} />
                    {item.time}
                </div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 3, lineHeight: 1.3 }}>
                    {item.event}
                </div>

                {item.bookable && item.remaining !== null ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: seatColor, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Users size={12} />
                            {isFull ? `${item.capacity} / ${item.capacity} — No seats` : `${item.remaining} / ${item.capacity} seats available`}
                        </span>
                        {seatBadge && (
                            <span style={{ fontSize: '0.6875rem', fontWeight: 800, padding: '2px 8px', borderRadius: 999, background: 'rgba(220,38,38,0.10)', color: '#B91C1C' }}>
                                FULL
                            </span>
                        )}
                        {isFilling && (
                            <span style={{ fontSize: '0.6875rem', fontWeight: 800, padding: '2px 8px', borderRadius: 999, background: 'rgba(217,119,6,0.10)', color: '#B45309' }}>
                                Filling Fast
                            </span>
                        )}
                        {isAvail && (
                            <span style={{ fontSize: '0.6875rem', fontWeight: 800, padding: '2px 8px', borderRadius: 999, background: 'rgba(22,163,74,0.10)', color: '#15803D' }}>
                                Available
                            </span>
                        )}
                    </div>
                ) : (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>{item.statusText || item.status}</div>
                )}
            </div>

            {/* Right: Book button */}
            {item.bookable && item.isBookable && onBook && (
                <button
                    onClick={() => onBook(item)}
                    style={{
                        flexShrink: 0, padding: '5px 14px',
                        borderRadius: 'var(--radius-md)',
                        background: '#8B2E2E', color: '#FFF',
                        border: '1px solid #752525',
                        fontSize: '0.75rem', fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'background 160ms ease',
                        whiteSpace: 'nowrap',
                        marginTop: 2,
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#A53A3A'}
                    onMouseLeave={e => e.currentTarget.style.background = '#8B2E2E'}
                >
                    Book
                </button>
            )}
        </div>
    );
}

// ─── Main Timetable Component ─────────────────────────────────────────────────
export default function MonasteryTimetable({ monasteryId, monasteryName, onOpenBooking }) {
    const normalizedId = normalizeMonasteryId(monasteryId);
    const today = new Date().toISOString().split('T')[0];

    const [timetable, setTimetable] = useState([]);
    const [collapsed, setCollapsed] = useState(false);
    const hasSpecificTimetable = normalizedId && !!MONASTERY_TIMETABLES[normalizedId];

    useEffect(() => {
        const live = getMonasteryLiveTimetable(normalizedId || 'default', today);
        setTimetable(live);
    }, [normalizedId, today]);

    // Refresh timetable on focus (e.g. after booking in modal)
    useEffect(() => {
        const onFocus = () => {
            const live = getMonasteryLiveTimetable(normalizedId || 'default', today);
            setTimetable(live);
        };
        window.addEventListener('focus', onFocus);
        return () => window.removeEventListener('focus', onFocus);
    }, [normalizedId, today]);

    const bookableToday = timetable.filter(t => t.bookable && t.isBookable).length;
    const fullToday = timetable.filter(t => t.bookable && !t.isBookable).length;

    return (
        <div style={{
            background: 'var(--bg-card)',
            border: '1.5px solid var(--border-medium)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)',
        }}>
            {/* Header */}
            <div style={{
                padding: '1.125rem 1.5rem',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'var(--bg-elevated)',
            }}>
                <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                        <Calendar size={12} />
                        Today&apos;s Schedule
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                        {monasteryName || 'Monastery'} — Daily Timetable
                    </h3>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 3 }}>
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        {!hasSpecificTimetable && <span style={{ marginLeft: 8, color: 'var(--color-secondary)', fontWeight: 600 }}>(Standard Schedule)</span>}
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <div style={{ color: '#15803D', fontWeight: 700 }}>{bookableToday} bookable</div>
                        {fullToday > 0 && <div style={{ color: '#DC2626', fontWeight: 600 }}>{fullToday} full</div>}
                    </div>
                    <button
                        onClick={() => setCollapsed(c => !c)}
                        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}
                        aria-label={collapsed ? 'Expand timetable' : 'Collapse timetable'}
                    >
                        {collapsed ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
                    </button>
                </div>
            </div>

            {/* Quick stats strip */}
            {!collapsed && (
                <div style={{ padding: '0.625rem 1.5rem', background: 'rgba(139,46,46,0.04)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                    {[
                        { icon: <BookOpen size={12} />, text: `${timetable.length} scheduled activities`, color: 'var(--text-secondary)' },
                        { icon: <CheckCircle size={12} />, text: `${bookableToday} bookable experiences`, color: '#15803D' },
                        { icon: <Users size={12} />, text: `${fullToday} slots fully booked`, color: fullToday > 0 ? '#DC2626' : 'var(--text-muted)' },
                    ].map((stat, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.775rem', fontWeight: 600, color: stat.color }}>
                            {stat.icon} {stat.text}
                        </div>
                    ))}
                </div>
            )}

            {/* Timetable rows */}
            {!collapsed && (
                <div style={{ padding: '1rem 1.5rem 1.25rem' }}>
                    {timetable.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
                            <Sparkles size={28} style={{ margin: '0 auto 0.5rem' }} />
                            <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>No schedule data available for this monastery.</div>
                        </div>
                    ) : (
                        timetable.map((item, idx) => (
                            <TimetableRow key={idx} item={item} onBook={item.bookable && item.isBookable ? onOpenBooking : null} />
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
