import React, { useState, useEffect, useCallback } from 'react';
import {
    X, Calendar, Clock, Users, CheckCircle, ChevronLeft,
    Ticket, MapPin, AlertCircle, Star, ArrowRight, Info,
    Plus, Minus, Phone, Mail, User, Loader2
} from 'lucide-react';
import {
    MONASTERY_EXPERIENCES,
    MONASTERY_EVENTS,
    getAvailableDates,
    getSlotsForExperience,
    recordExperienceBooking,
    getAlternativeSlotsFor,
    getEventSlots,
    normalizeMonasteryId,
} from '../../data/monasteryBookingData';
import './ExperienceBookingModal.css';

// ─── Constants ───────────────────────────────────────────────────────────────
const STEPS = { SELECT_EXPERIENCE: 1, SELECT_DATE: 2, SELECT_SLOT: 3, FILL_FORM: 4, SUMMARY: 5, CONFIRMED: 6 };

// ─── Status badge component ───────────────────────────────────────────────────
function StatusPill({ status }) {
    const cfg = {
        available:    { bg: 'rgba(22,163,74,0.12)',  color: '#15803D', dot: '#16A34A' },
        filling_fast: { bg: 'rgba(217,119,6,0.12)', color: '#B45309', dot: '#D97706' },
        full:         { bg: 'rgba(220,38,38,0.10)', color: '#B91C1C', dot: '#DC2626' },
    };
    const c = cfg[status] || cfg.available;
    const label = status === 'full' ? 'FULL' : status === 'filling_fast' ? 'Filling Fast' : 'Available';
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            padding: '3px 10px', borderRadius: '999px',
            background: c.bg, color: c.color,
            fontSize: '0.75rem', fontWeight: 700,
        }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: c.dot, flexShrink: 0 }} />
            {label}
        </span>
    );
}

// ─── Slot card ────────────────────────────────────────────────────────────────
function SlotCard({ slot, onBook }) {
    const isFull = slot.status === 'full';
    const isFilling = slot.status === 'filling_fast';
    return (
        <div
            className={`slot-item-card${isFull ? ' is-full' : ''}`}
            style={{ cursor: isFull ? 'default' : 'pointer' }}
            onClick={!isFull ? () => onBook(slot) : undefined}
        >
            <div>
                <div className="slot-time-text">
                    <Clock size={13} style={{ verticalAlign: 'middle', marginRight: 5, color: 'var(--color-primary)' }} />
                    {slot.timeRange}
                </div>
                <div className="slot-seats-metric" style={{ marginTop: 4 }}>
                    {isFull
                        ? <span style={{ color: '#DC2626', fontWeight: 700 }}>{slot.capacity} / {slot.capacity} — No seats available</span>
                        : <span style={{ color: isFilling ? '#B45309' : '#15803D', fontWeight: 700 }}>
                            {slot.remaining} / {slot.capacity} seats available
                          </span>
                    }
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <StatusPill status={slot.status} />
                {isFull
                    ? <span className="btn-slot-disabled">Unavailable</span>
                    : <button className="btn-slot-book" onClick={(e) => { e.stopPropagation(); onBook(slot); }}>Book</button>
                }
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ExperienceBookingModal({ isOpen, onClose, monasteryName, monasteryId }) {
    const normalizedId = normalizeMonasteryId(monasteryId) || 'rumtek';

    const [step, setStep] = useState(STEPS.SELECT_EXPERIENCE);
    const [selectedExperience, setSelectedExperience] = useState(MONASTERY_EXPERIENCES[0]);
    const [availableDates, setAvailableDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);

    const [visitorName, setVisitorName] = useState('');
    const [visitorEmail, setVisitorEmail] = useState('');
    const [visitorPhone, setVisitorPhone] = useState('');
    const [visitorsCount, setVisitorsCount] = useState(1);

    const [fieldErrors, setFieldErrors] = useState({});
    const [submitError, setSubmitError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [confirmedBooking, setConfirmedBooking] = useState(null);

    useEffect(() => {
        const dates = getAvailableDates();
        setAvailableDates(dates);
        setSelectedDate(dates[0]);
    }, []);

    useEffect(() => {
        if (!selectedExperience || !selectedDate) return;
        setSlots(getSlotsForExperience(normalizedId, selectedExperience.id, selectedDate.isoString));
    }, [selectedExperience, selectedDate, normalizedId]);

    useEffect(() => {
        if (isOpen) {
            setStep(STEPS.SELECT_EXPERIENCE);
            setSelectedExperience(MONASTERY_EXPERIENCES[0]);
            setSelectedSlot(null);
            setVisitorName(''); setVisitorEmail(''); setVisitorPhone('');
            setVisitorsCount(1);
            setFieldErrors({}); setSubmitError('');
            setConfirmedBooking(null);
        }
    }, [isOpen]);

    const refreshSlots = useCallback(() => {
        if (!selectedExperience || !selectedDate) return;
        setSlots(getSlotsForExperience(normalizedId, selectedExperience.id, selectedDate.isoString));
    }, [selectedExperience, selectedDate, normalizedId]);

    if (!isOpen) return null;

    const handleBackdropClick = (e) => { if (e.target === e.currentTarget) onClose(); };

    const availableSlots = slots.filter(s => s.isBookable);
    const fullSlots = slots.filter(s => !s.isBookable);
    const alternatives = availableSlots.length === 0 && selectedDate
        ? getAlternativeSlotsFor(normalizedId, selectedExperience.id, selectedDate.isoString)
        : [];

    function validateForm() {
        const errs = {};
        if (!visitorName.trim()) errs.name = 'Full name is required.';
        if (!visitorEmail.trim()) errs.email = 'Email address is required.';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(visitorEmail)) errs.email = 'Enter a valid email address.';
        if (!visitorPhone.trim()) errs.phone = 'Phone number is required.';
        else if (!/^\+?[\d\s\-()]{7,15}$/.test(visitorPhone)) errs.phone = 'Enter a valid phone number.';
        if (visitorsCount < 1) errs.visitors = 'At least 1 visitor required.';
        if (selectedSlot && visitorsCount > selectedSlot.remaining) {
            errs.visitors = `Only ${selectedSlot.remaining} seat(s) available for this slot.`;
        }
        return errs;
    }

    async function handleConfirmBooking() {
        const errs = validateForm();
        setFieldErrors(errs);
        if (Object.keys(errs).length > 0) return;
        setIsSubmitting(true);
        setSubmitError('');
        try {
            const result = recordExperienceBooking({
                monasteryId: normalizedId, monasteryName,
                experienceId: selectedExperience.id, experienceTitle: selectedExperience.title,
                dateIso: selectedDate.isoString, formattedDate: selectedDate.formattedDate,
                timeSlot: selectedSlot, visitorsCount: Number(visitorsCount),
                visitorName, visitorEmail, visitorPhone,
            });
            setConfirmedBooking(result);
            refreshSlots();
            setStep(STEPS.CONFIRMED);
        } catch (err) {
            setSubmitError(err.message || 'Booking failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }

    function handleSelectExperience(exp) { setSelectedExperience(exp); setSelectedSlot(null); setStep(STEPS.SELECT_DATE); }
    function handleSelectDate(date) { setSelectedDate(date); setSelectedSlot(null); setStep(STEPS.SELECT_SLOT); }
    function handleSelectSlot(slot) { setSelectedSlot(slot); setVisitorsCount(1); setFieldErrors({}); setSubmitError(''); setStep(STEPS.FILL_FORM); }
    function handleProceedToSummary() {
        const errs = validateForm();
        setFieldErrors(errs);
        if (Object.keys(errs).length === 0) setStep(STEPS.SUMMARY);
    }
    function goBack() {
        if (step === STEPS.SELECT_DATE) setStep(STEPS.SELECT_EXPERIENCE);
        else if (step === STEPS.SELECT_SLOT) setStep(STEPS.SELECT_DATE);
        else if (step === STEPS.FILL_FORM) setStep(STEPS.SELECT_SLOT);
        else if (step === STEPS.SUMMARY) setStep(STEPS.FILL_FORM);
    }

    const BackBtn = () => (
        <button onClick={goBack} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700, fontSize: '0.8125rem', marginBottom: '0.875rem', padding: 0 }}>
            <ChevronLeft size={15} /> Back
        </button>
    );

    const stepConfig = [
        { s: STEPS.SELECT_EXPERIENCE, label: 'Experience' },
        { s: STEPS.SELECT_DATE, label: 'Date' },
        { s: STEPS.SELECT_SLOT, label: 'Slot' },
        { s: STEPS.FILL_FORM, label: 'Details' },
        { s: STEPS.SUMMARY, label: 'Confirm' },
    ];

    return (
        <div className="exp-modal-backdrop" onClick={handleBackdropClick}>
            <div className="exp-modal-card" role="dialog" aria-modal="true">

                {/* HEADER */}
                <div className="exp-modal-header">
                    <div>
                        <div className="exp-modal-eyebrow">
                            <Ticket size={12} /> Reserve Experience
                        </div>
                        <h2 className="exp-modal-title">
                            {step === STEPS.CONFIRMED ? 'Booking Confirmed' : monasteryName}
                        </h2>
                        {step !== STEPS.CONFIRMED && step !== STEPS.SELECT_EXPERIENCE && (
                            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: 3, display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                                <MapPin size={11} style={{ color: 'var(--color-primary)' }} />
                                {selectedExperience?.title}
                                {selectedDate && <>&nbsp;&mdash;&nbsp;<strong style={{ color: 'var(--text-secondary)' }}>{selectedDate.formattedDate}</strong></>}
                            </div>
                        )}
                    </div>
                    <button className="exp-modal-close-btn" onClick={onClose} aria-label="Close">
                        <X size={16} />
                    </button>
                </div>

                {/* STEP BREADCRUMB */}
                {step !== STEPS.CONFIRMED && (
                    <div style={{ display: 'flex', alignItems: 'center', padding: '0 1.75rem', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-elevated)', overflowX: 'auto' }}>
                        {stepConfig.map(({ s, label }, idx) => (
                            <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
                                {idx > 0 && <div style={{ width: 20, height: 1, background: step >= s ? 'var(--color-primary)' : 'var(--border-medium)', flexShrink: 0 }} />}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 5px' }}>
                                    <div style={{
                                        width: 22, height: 22, borderRadius: '50%',
                                        background: step >= s ? 'var(--color-primary)' : 'var(--border-medium)',
                                        color: step >= s ? '#FFF' : 'var(--text-muted)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '0.6875rem', fontWeight: 800, flexShrink: 0,
                                        transition: 'background 200ms ease',
                                    }}>
                                        {step > s ? <CheckCircle size={13} /> : idx + 1}
                                    </div>
                                    <span style={{ fontSize: '0.625rem', fontWeight: 700, marginTop: 2, color: step >= s ? 'var(--color-primary)' : 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                                        {label}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* BODY */}
                <div className="exp-modal-body">

                    {/* ── STEP 1: Select Experience ── */}
                    {step === STEPS.SELECT_EXPERIENCE && (
                        <div>
                            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                                <Star size={14} style={{ color: 'var(--color-secondary)' }} /> Select an Experience
                            </div>
                            <div className="exp-tabs-group" style={{ flexWrap: 'wrap', gap: 10 }}>
                                {MONASTERY_EXPERIENCES.map(exp => (
                                    <button key={exp.id} className={`exp-tab-item${selectedExperience?.id === exp.id ? ' is-selected' : ''}`} onClick={() => handleSelectExperience(exp)}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 4, marginBottom: 4 }}>
                                            <span className="exp-tab-title">{exp.title}</span>
                                            <span style={{ fontSize: '0.6875rem', fontWeight: 700, padding: '2px 6px', borderRadius: 999, background: 'rgba(139,46,46,0.1)', color: 'var(--color-primary)', whiteSpace: 'nowrap', flexShrink: 0 }}>{exp.badge}</span>
                                        </div>
                                        <span className="exp-tab-duration"><Clock size={10} style={{ display: 'inline', verticalAlign: 'middle' }} /> {exp.duration} · {exp.category}</span>
                                        <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: 2, display: 'block' }}>{exp.price}</span>
                                        <p style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.45 }}>{exp.description}</p>
                                    </button>
                                ))}
                            </div>

                            {/* Upcoming Events for this monastery */}
                            {(() => {
                                const monEvents = MONASTERY_EVENTS.filter(e => e.monasteryId === normalizedId);
                                if (!monEvents.length) return null;
                                return (
                                    <div style={{ marginTop: '1.5rem' }}>
                                        <div style={{ fontSize: '0.8125rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <Calendar size={13} style={{ color: 'var(--color-secondary)' }} /> Upcoming Events at This Monastery
                                        </div>
                                        {monEvents.map(evt => {
                                            const evtSlots = getEventSlots(evt.id);
                                            const anyAvail = evtSlots.some(s => s.isBookable);
                                            return (
                                                <div key={evt.id} style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', background: 'var(--bg-elevated)', marginBottom: '0.625rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                                                        <div>
                                                            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>{evt.title}</div>
                                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}><Calendar size={10} style={{ display: 'inline', verticalAlign: 'middle' }} /> {evt.formattedDate} · {evt.category}</div>
                                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.4 }}>{evt.description}</div>
                                                        </div>
                                                        <span style={{ fontSize: '0.6875rem', fontWeight: 800, padding: '3px 8px', borderRadius: 999, background: anyAvail ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.08)', color: anyAvail ? '#15803D' : '#B91C1C', whiteSpace: 'nowrap', flexShrink: 0 }}>
                                                            {anyAvail ? 'Seats Available' : 'Fully Booked'}
                                                        </span>
                                                    </div>
                                                    <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                                        {evtSlots.map(s => (
                                                            <div key={s.slotIndex} style={{ fontSize: '0.75rem', fontWeight: 600, padding: '4px 10px', borderRadius: 6, background: s.isBookable ? 'rgba(22,163,74,0.08)' : 'rgba(220,38,38,0.08)', color: s.isBookable ? '#15803D' : '#B91C1C', border: `1px solid ${s.isBookable ? 'rgba(22,163,74,0.2)' : 'rgba(220,38,38,0.2)'}` }}>
                                                                {s.timeRange} · {s.isBookable ? `${s.remaining} seats` : 'FULL'}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })()}
                        </div>
                    )}

                    {/* ── STEP 2: Select Date ── */}
                    {step === STEPS.SELECT_DATE && (
                        <div>
                            <BackBtn />
                            <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'rgba(139,46,46,0.06)', border: '1px solid rgba(139,46,46,0.2)', marginBottom: '1.25rem' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Selected Experience</div>
                                <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>{selectedExperience?.title}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 1 }}>{selectedExperience?.duration} · Up to {selectedExperience?.capacity} visitors per slot</div>
                            </div>
                            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                                <Calendar size={14} style={{ color: 'var(--color-primary)' }} /> Select Visit Date
                            </div>
                            <div className="date-pills-row">
                                {availableDates.map(date => (
                                    <button key={date.id} className={`date-pill-btn${selectedDate?.id === date.id ? ' is-active' : ''}`} onClick={() => handleSelectDate(date)}>
                                        {date.shortLabel}
                                    </button>
                                ))}
                            </div>
                            <div style={{ marginTop: '1.5rem', padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                                <Info size={14} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: 2 }} />
                                <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Slot availability is tracked live. Counts update as bookings are made.</span>
                            </div>
                            <button onClick={() => selectedDate && setStep(STEPS.SELECT_SLOT)} className="btn-slot-book" style={{ marginTop: '1.25rem', width: '100%', padding: '11px', fontSize: '0.9375rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                View Available Slots <ArrowRight size={15} />
                            </button>
                        </div>
                    )}

                    {/* ── STEP 3: Select Slot ── */}
                    {step === STEPS.SELECT_SLOT && (
                        <div>
                            <BackBtn />
                            <div className="date-pills-row" style={{ marginBottom: '1.25rem' }}>
                                {availableDates.map(date => (
                                    <button key={date.id} className={`date-pill-btn${selectedDate?.id === date.id ? ' is-active' : ''}`} onClick={() => setSelectedDate(date)}>
                                        {date.shortLabel}
                                    </button>
                                ))}
                            </div>
                            <div className="slots-container-card">
                                {availableSlots.length > 0 ? (
                                    <>
                                        <div className="slots-section-title">
                                            <CheckCircle size={13} style={{ color: '#16A34A' }} />
                                            Available Slots — {availableSlots.length} open
                                        </div>
                                        {availableSlots.map((slot, i) => <SlotCard key={i} slot={slot} onBook={handleSelectSlot} />)}
                                    </>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                                        <AlertCircle size={32} style={{ color: '#DC2626', marginBottom: 8 }} />
                                        <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>No slots available for this date</div>
                                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>All time slots for {selectedDate?.formattedDate} are fully booked.</div>
                                    </div>
                                )}
                                {fullSlots.length > 0 && (
                                    <div style={{ marginTop: availableSlots.length > 0 ? '1.25rem' : '0.75rem', borderTop: availableSlots.length > 0 ? '1px solid var(--border-subtle)' : 'none', paddingTop: availableSlots.length > 0 ? '1rem' : 0 }}>
                                        <div className="slots-section-title" style={{ color: 'var(--text-muted)' }}>
                                            <X size={13} style={{ color: '#DC2626' }} />
                                            Fully Booked — {fullSlots.length} slot{fullSlots.length > 1 ? 's' : ''}
                                        </div>
                                        {fullSlots.map((slot, i) => <SlotCard key={i} slot={slot} onBook={() => {}} />)}
                                    </div>
                                )}
                            </div>

                            {/* Smart Alternatives */}
                            {alternatives.length > 0 && (
                                <div style={{ marginTop: '1.25rem', padding: '1rem', borderRadius: 'var(--radius-lg)', background: 'rgba(139,46,46,0.04)', border: '1px solid rgba(139,46,46,0.18)' }}>
                                    <div style={{ fontSize: '0.8125rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: 5 }}>
                                        <ArrowRight size={13} /> Try These Alternatives
                                    </div>
                                    {alternatives.map((alt, i) => (
                                        <div key={i} style={{ padding: '10px 12px', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', marginBottom: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                                            <div>
                                                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>{alt.monasteryName}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 1 }}>{alt.experienceTitle}</div>
                                            </div>
                                            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#15803D' }}>{alt.nextAvailableSlot.timeRange}</div>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 1 }}>{alt.nextAvailableSlot.remaining} seats available</div>
                                            </div>
                                        </div>
                                    ))}
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.5 }}>
                                        Visit the Explore Directory to book at alternative monasteries.
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── STEP 4: Booking Form ── */}
                    {step === STEPS.FILL_FORM && (
                        <div className="booking-form-wrap">
                            <BackBtn />
                            <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'rgba(22,163,74,0.06)', border: '1px solid rgba(22,163,74,0.25)', marginBottom: '0.25rem' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#15803D', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Selected Slot</div>
                                <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>{selectedSlot?.timeRange}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 1 }}>{selectedDate?.formattedDate} · {selectedSlot?.remaining} seats remaining</div>
                            </div>

                            <div className="form-field-group">
                                <label className="form-field-label" htmlFor="ebm-name"><User size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />Full Name *</label>
                                <input id="ebm-name" className="form-field-input" type="text" placeholder="e.g. Priya Subba" value={visitorName} onChange={e => { setVisitorName(e.target.value); setFieldErrors(f => ({ ...f, name: '' })); }} style={fieldErrors.name ? { borderColor: '#DC2626' } : {}} />
                                {fieldErrors.name && <span style={{ color: '#DC2626', fontSize: '0.75rem' }}>{fieldErrors.name}</span>}
                            </div>

                            <div className="form-field-group">
                                <label className="form-field-label" htmlFor="ebm-email"><Mail size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />Email Address *</label>
                                <input id="ebm-email" className="form-field-input" type="email" placeholder="e.g. priya@email.com" value={visitorEmail} onChange={e => { setVisitorEmail(e.target.value); setFieldErrors(f => ({ ...f, email: '' })); }} style={fieldErrors.email ? { borderColor: '#DC2626' } : {}} />
                                {fieldErrors.email && <span style={{ color: '#DC2626', fontSize: '0.75rem' }}>{fieldErrors.email}</span>}
                            </div>

                            <div className="form-field-group">
                                <label className="form-field-label" htmlFor="ebm-phone"><Phone size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />Phone Number *</label>
                                <input id="ebm-phone" className="form-field-input" type="tel" placeholder="e.g. +91 98765 43210" value={visitorPhone} onChange={e => { setVisitorPhone(e.target.value); setFieldErrors(f => ({ ...f, phone: '' })); }} style={fieldErrors.phone ? { borderColor: '#DC2626' } : {}} />
                                {fieldErrors.phone && <span style={{ color: '#DC2626', fontSize: '0.75rem' }}>{fieldErrors.phone}</span>}
                            </div>

                            <div className="form-field-group">
                                <label className="form-field-label"><Users size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />Number of Visitors *&nbsp;<span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(max {selectedSlot?.remaining})</span></label>
                                <div className="visitors-counter-wrap">
                                    <button className="counter-btn" disabled={visitorsCount <= 1} onClick={() => setVisitorsCount(v => Math.max(1, v - 1))} aria-label="Decrease"><Minus size={14} /></button>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', minWidth: 32, textAlign: 'center' }}>{visitorsCount}</span>
                                    <button className="counter-btn" disabled={visitorsCount >= (selectedSlot?.remaining || 1)} onClick={() => setVisitorsCount(v => Math.min(selectedSlot?.remaining || 1, v + 1))} aria-label="Increase"><Plus size={14} /></button>
                                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginLeft: 4 }}>visitor{visitorsCount > 1 ? 's' : ''}</span>
                                </div>
                                {fieldErrors.visitors && <span style={{ color: '#DC2626', fontSize: '0.75rem' }}>{fieldErrors.visitors}</span>}
                            </div>

                            {submitError && (
                                <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.3)', color: '#B91C1C', fontSize: '0.8125rem', fontWeight: 600, display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                                    <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />{submitError}
                                </div>
                            )}

                            <button onClick={handleProceedToSummary} className="btn-slot-book" style={{ width: '100%', padding: '11px', fontSize: '0.9375rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                Review Booking Summary <ArrowRight size={15} />
                            </button>
                        </div>
                    )}

                    {/* ── STEP 5: Summary ── */}
                    {step === STEPS.SUMMARY && (
                        <div className="booking-form-wrap">
                            <BackBtn />
                            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                                <Info size={14} style={{ color: 'var(--color-primary)' }} /> Booking Summary
                            </div>
                            <div className="booking-summary-box">
                                {[
                                    { label: 'Monastery', value: monasteryName },
                                    { label: 'Experience', value: selectedExperience?.title },
                                    { label: 'Date', value: selectedDate?.formattedDate },
                                    { label: 'Time', value: selectedSlot?.timeRange },
                                    { label: 'Name', value: visitorName },
                                    { label: 'Email', value: visitorEmail },
                                    { label: 'Phone', value: visitorPhone },
                                    { label: 'Visitors', value: visitorsCount },
                                ].map(({ label, value }) => (
                                    <div key={label} className="summary-row-item"><span>{label}</span><strong>{value}</strong></div>
                                ))}
                                <div style={{ height: 1, background: 'var(--border-subtle)', margin: '6px 0' }} />
                                <div className="summary-row-item">
                                    <span>Seats before booking</span>
                                    <strong>{selectedSlot?.remaining}</strong>
                                </div>
                                <div className="summary-row-item">
                                    <span>Seats after booking</span>
                                    <strong style={{ color: Math.max(0, (selectedSlot?.remaining || 0) - visitorsCount) === 0 ? '#DC2626' : Math.max(0, (selectedSlot?.remaining || 0) - visitorsCount) <= 5 ? '#D97706' : '#15803D' }}>
                                        {Math.max(0, (selectedSlot?.remaining || 0) - visitorsCount)}
                                    </strong>
                                </div>
                            </div>
                            {submitError && (
                                <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.3)', color: '#B91C1C', fontSize: '0.8125rem', fontWeight: 600, display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                                    <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />{submitError}
                                </div>
                            )}
                            <button onClick={handleConfirmBooking} disabled={isSubmitting} className="btn-slot-book" style={{ width: '100%', padding: '12px', fontSize: '0.9375rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: isSubmitting ? 0.7 : 1 }}>
                                {isSubmitting ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Processing...</> : <><CheckCircle size={15} /> Confirm Booking</>}
                            </button>
                        </div>
                    )}

                    {/* ── STEP 6: Confirmed ── */}
                    {step === STEPS.CONFIRMED && confirmedBooking && (
                        <div className="confirmation-container">
                            <div className="conf-check-icon"><CheckCircle size={30} /></div>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Booking Confirmed</h3>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Your experience has been reserved successfully.</p>
                            <div className="conf-code-badge">{confirmedBooking.bookingId}</div>
                            <div className="booking-summary-box" style={{ width: '100%', textAlign: 'left', marginBottom: '1.25rem' }}>
                                {[
                                    { label: 'Monastery', value: confirmedBooking.monasteryName },
                                    { label: 'Experience', value: confirmedBooking.experienceTitle },
                                    { label: 'Date', value: confirmedBooking.eventDate },
                                    { label: 'Time', value: confirmedBooking.timeSlot },
                                    { label: 'Visitors', value: confirmedBooking.attendees },
                                    { label: 'Status', value: <span style={{ color: '#15803D', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: '0.8125rem' }}>Confirmed</span> },
                                ].map(({ label, value }) => (
                                    <div key={label} className="summary-row-item"><span>{label}</span><strong>{value}</strong></div>
                                ))}
                            </div>
                            <div style={{ display: 'flex', gap: 10, width: '100%' }}>
                                <a href="/my-bookings" className="btn-slot-book" style={{ flex: 1, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, textDecoration: 'none', padding: '10px 0' }}>
                                    <Ticket size={14} /> View Booking
                                </a>
                                <button onClick={onClose} className="btn-slot-disabled" style={{ flex: 1, cursor: 'pointer' }}>Back to Monastery</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
