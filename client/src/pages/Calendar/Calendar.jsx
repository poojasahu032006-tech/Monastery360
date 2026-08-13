import React, { useState } from 'react';
import { Calendar as CalendarIcon, Moon, Sun, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import '../pages.css';

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const CALENDAR_EVENTS = [
    { day: 15, month: 1, title: 'Losar Celebration', monastery: 'Rumtek Monastery', type: 'Festival' },
    { day: 3, month: 2, title: 'Bumchu Holy Water', monastery: 'Tashiding Monastery', type: 'Sacred Ritual' },
    { day: 15, month: 4, title: 'Saga Dawa (Buddha Jayanti)', monastery: 'All Monasteries', type: 'Auspicious Day' },
    { day: 4, month: 6, title: 'Drupka Teshi (First Sermon)', monastery: 'Enchey Monastery', type: 'Prayer Ceremony' },
    { day: 15, month: 8, title: 'Pang Lhabsol', monastery: ' Tsuklakhang Palace', type: 'State Festival' },
    { day: 22, month: 10, title: 'Lhabab Duchen', monastery: 'Pemayangtse Monastery', type: 'Auspicious Day' },
    { day: 28, month: 11, title: 'Kagyed Dance', monastery: 'Phodong Monastery', type: 'Cham Masked Dance' },
];

export default function Calendar() {
    const [currentMonthIndex, setCurrentMonthIndex] = useState(1); // Feb default

    const selectedMonthName = MONTHS[currentMonthIndex];
    const monthEvents = CALENDAR_EVENTS.filter(e => e.month === currentMonthIndex);

    const prevMonth = () => setCurrentMonthIndex((prev) => (prev === 0 ? 11 : prev - 1));
    const nextMonth = () => setCurrentMonthIndex((prev) => (prev === 11 ? 0 : prev + 1));

    return (
        <div className="container" style={{ padding: '3rem 1.5rem' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <span className="home-hero-eyebrow" style={{ marginBottom: '1rem' }}>
                    <Moon size={14} /> Tibetan Lunar Calendar 2026
                </span>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4vw,3rem)', color: 'var(--text-primary)' }}>
                    Cultural & Monastic <span className="gradient-text">Calendar</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0.75rem auto 0', fontSize: '1rem', lineHeight: '1.6' }}>
                    Track sacred Buddhist lunar festival dates, Tsechu ceremony days, and auspicious prayer times across Sikkim.
                </p>
            </div>

            {/* Calendar Controls Card */}
            <div className="card" style={{ maxWidth: '800px', margin: '0 auto 2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button onClick={prevMonth} className="btn-ghost-sm" style={{ padding: '6px 12px' }}>
                            <ChevronLeft size={18} />
                        </button>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--text-primary)', minWidth: '140px', textAlign: 'center' }}>
                            {selectedMonthName} 2026
                        </h2>
                        <button onClick={nextMonth} className="btn-ghost-sm" style={{ padding: '6px 12px' }}>
                            <ChevronRight size={18} />
                        </button>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span className="badge badge--gold" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Sun size={12} /> Tibetan Dawa Calendar
                        </span>
                    </div>
                </div>

                {/* Days Grid View */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', marginBottom: '1.5rem' }}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div key={d} style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', paddingBottom: '8px' }}>
                            {d}
                        </div>
                    ))}
                    {Array.from({ length: 28 }, (_, i) => i + 1).map(day => {
                        const hasEvent = monthEvents.some(e => e.day === day);
                        return (
                            <div
                                key={day}
                                style={{
                                    height: '52px',
                                    borderRadius: 'var(--radius-sm)',
                                    background: hasEvent ? 'rgba(201,135,58,0.2)' : 'var(--bg-elevated)',
                                    border: hasEvent ? '1px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justify: 'center',
                                    fontSize: '0.875rem',
                                    color: hasEvent ? 'var(--color-primary-light)' : 'var(--text-secondary)',
                                    fontWeight: hasEvent ? 700 : 400,
                                }}
                            >
                                <span>{day}</span>
                                {hasEvent && <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--color-primary)', marginTop: '2px' }}></span>}
                            </div>
                        );
                    })}
                </div>

                {/* Events list for month */}
                <div>
                    <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CalendarIcon size={16} style={{ color: 'var(--color-primary)' }} /> Events in {selectedMonthName}
                    </h3>
                    {monthEvents.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {monthEvents.map((ev, idx) => (
                                <div key={idx} style={{
                                    background: 'var(--bg-elevated)',
                                    padding: '10px 14px',
                                    borderRadius: 'var(--radius-md)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justify: 'space-between',
                                    borderLeft: '3px solid var(--color-primary)'
                                }}>
                                    <div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600 }}>{ev.title}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{ev.monastery}</div>
                                    </div>
                                    <span className="badge badge--gold" style={{ fontSize: '0.75rem' }}>Day {ev.day} • {ev.type}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            No major public festival listed for this month. Daily morning and evening prayer sessions continue at all monasteries.
                        </p>
                    )}
                </div>
            </div>

            <div className="card" style={{ maxWidth: '800px', margin: '0 auto', background: 'rgba(201, 135, 58, 0.04)', border: '1px dashed var(--border-subtle)', textAlign: 'center', padding: '1.5rem' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <Info size={16} style={{ color: 'var(--color-primary)' }} /> Part 3 will connect this calendar to real-time notification alerts and Google Calendar exports.
                </p>
            </div>
        </div>
    );
}
