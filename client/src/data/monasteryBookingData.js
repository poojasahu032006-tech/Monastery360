/**
 * MONASTERY360 — MONASTERY EXPERIENCE BOOKING, TIMETABLES & LIVE SLOT DATA ENGINE
 * Manages daily monastic timetables, experience types, multi-date slot allocations,
 * capacity math (remaining = capacity - booked), overbooking validation, and booking persistence.
 */

// ============================================================================
// 1. EXPERIENCE DEFINITIONS
// ============================================================================
export const MONASTERY_EXPERIENCES = [
    {
        id: 'guided-heritage-tour',
        title: 'Guided Heritage Tour',
        badge: 'Top Rated',
        category: 'Heritage',
        duration: '90 mins',
        capacity: 20,
        price: 'Free / Heritage Pass',
        description: 'Explore ancient frescoes, prayer halls, and sacred thangkas with a certified monastic cultural guide.',
        suitableFor: 'All visitors, history enthusiasts',
        defaultSlots: [
            { startTime: '09:00 AM', endTime: '10:30 AM', baseBooked: 8 },
            { startTime: '02:00 PM', endTime: '03:30 PM', baseBooked: 20 }, // Full by default for testing
            { startTime: '03:30 PM', endTime: '05:00 PM', baseBooked: 14 },
        ],
    },
    {
        id: 'cultural-walk-ceremony',
        title: 'Monastery Cultural Walk & Butter Lamp Ceremony',
        badge: 'Spiritual',
        category: 'Rituals',
        duration: '60 mins',
        capacity: 15,
        price: 'Free / Offering Optional',
        description: 'Walk the sacred circumambulation (Kora) path, spin giant prayer wheels, and light blessed butter lamps.',
        suitableFor: 'Spiritual seekers, families',
        defaultSlots: [
            { startTime: '11:00 AM', endTime: '12:00 PM', baseBooked: 10 },
            { startTime: '04:00 PM', endTime: '05:00 PM', baseBooked: 6 },
        ],
    },
    {
        id: 'photography-architecture-walk',
        title: 'Monastic Architecture & Sacred Art Walk',
        badge: 'Creative',
        category: 'Art & Design',
        duration: '75 mins',
        capacity: 12,
        price: 'Free Entry',
        description: 'Learn the architectural symbolism of Tibetan pagodas, golden stupas, and hand-carved courtyard pillars.',
        suitableFor: 'Photographers, architectural enthusiasts',
        defaultSlots: [
            { startTime: '10:00 AM', endTime: '11:15 AM', baseBooked: 7 },
            { startTime: '01:30 PM', endTime: '02:45 PM', baseBooked: 12 }, // Full
        ],
    },
    {
        id: '360-virtual-tour-audio',
        title: '360° Immersive Virtual Walkthrough & Audio Guide',
        badge: 'Digital Pass',
        category: 'Virtual Experience',
        duration: '45 mins',
        capacity: 30,
        price: 'Free Digital Access',
        description: 'Guided VR exploration with multilingual commentary by resident historians.',
        suitableFor: 'Remote explorers & on-site mobile guides',
        defaultSlots: [
            { startTime: '10:30 AM', endTime: '11:15 AM', baseBooked: 12 },
            { startTime: '03:00 PM', endTime: '03:45 PM', baseBooked: 18 },
        ],
    },
];

// ============================================================================
// 2. DAILY TIMETABLE TEMPLATES PER MONASTERY
// ============================================================================
export const MONASTERY_TIMETABLES = {
    rumtek: [
        { time: '06:00 AM – 07:00 AM', event: 'Dawn Chanting & Incense Offering', type: 'prayer', status: 'Monks Only / Quiet Viewing', bookable: false },
        { time: '08:00 AM – 09:00 AM', event: 'Morning Prayer & Visitor Shrine Access', type: 'prayer', status: 'Open to All Visitors', bookable: false },
        { time: '09:00 AM – 10:30 AM', event: 'Guided Heritage Tour (Morning Session)', type: 'tour', experienceId: 'guided-heritage-tour', capacity: 20, booked: 8, bookable: true },
        { time: '11:00 AM – 12:00 PM', event: 'Monastery Cultural Walk & Butter Lamp Offering', type: 'cultural', experienceId: 'cultural-walk-ceremony', capacity: 15, booked: 11, bookable: true },
        { time: '12:00 PM – 01:00 PM', event: 'Visitor Break & Courtyard Meditation', type: 'break', status: 'Open Courtyards', bookable: false },
        { time: '01:00 PM – 02:00 PM', event: 'Monastery Midday Rest & Silent Hours', type: 'break', status: 'Sanctuary Closed for Prayers', bookable: false },
        { time: '02:00 PM – 03:30 PM', event: 'Guided Heritage Tour (Afternoon Session)', type: 'tour', experienceId: 'guided-heritage-tour', capacity: 20, booked: 20, bookable: true }, // Full
        { time: '03:30 PM – 04:45 PM', event: 'Monastic Architecture & Sacred Art Walk', type: 'cultural', experienceId: 'photography-architecture-walk', capacity: 12, booked: 7, bookable: true },
        { time: '05:00 PM – 06:00 PM', event: 'Evening Prayer (Mahakala Puja) & Lamp Lighting', type: 'prayer', status: 'Limited Visitor Seating', bookable: false },
    ],
    pemayangtse: [
        { time: '06:30 AM – 07:30 AM', event: 'Morning Monastic Meditation & Chants', type: 'prayer', status: 'Quiet Observation', bookable: false },
        { time: '08:30 AM – 10:00 AM', event: 'Pemayangtse Heritage & Zangdok Palri Guided Tour', type: 'tour', experienceId: 'guided-heritage-tour', capacity: 20, booked: 6, bookable: true },
        { time: '10:30 AM – 11:30 AM', event: 'Sacred Wooden Sculpture Interpretation', type: 'cultural', experienceId: 'photography-architecture-walk', capacity: 12, booked: 10, bookable: true },
        { time: '12:00 PM – 01:30 PM', event: 'Midday Visitor Break & Scenic Kanchenjunga View', type: 'break', status: 'Gardens Open', bookable: false },
        { time: '02:00 PM – 03:30 PM', event: 'Guided Heritage Tour (Afternoon Session)', type: 'tour', experienceId: 'guided-heritage-tour', capacity: 20, booked: 18, bookable: true },
        { time: '04:00 PM – 05:00 PM', event: 'Evening Chanting & Butter Lamp Lighting', type: 'prayer', status: 'Open to Visitors', bookable: false },
    ],
    enchey: [
        { time: '06:00 AM – 07:00 AM', event: 'Dawn Solitary Meditation & Bell Chimes', type: 'prayer', status: 'Open for Silent Meditation', bookable: false },
        { time: '08:30 AM – 10:00 AM', event: 'Enchey Pine Forest & Heritage Tour', type: 'tour', experienceId: 'guided-heritage-tour', capacity: 20, booked: 5, bookable: true },
        { time: '10:30 AM – 11:30 AM', event: 'Tantric Shrine History & Murals Walk', type: 'cultural', experienceId: 'photography-architecture-walk', capacity: 12, booked: 4, bookable: true },
        { time: '01:00 PM – 02:00 PM', event: 'Lunch Break & Monastery Courtyard Walk', type: 'break', status: 'Open Grounds', bookable: false },
        { time: '02:30 PM – 04:00 PM', event: 'Guided Cultural Tour (Afternoon Session)', type: 'tour', experienceId: 'guided-heritage-tour', capacity: 20, booked: 9, bookable: true },
        { time: '05:00 PM – 06:00 PM', event: 'Evening Incense Ceremony & Butter Lamps', type: 'prayer', status: 'Open to Visitors', bookable: false },
    ],
    tashiding: [
        { time: '06:30 AM – 07:30 AM', event: 'Dawn Consecration & Chorten Prayers', type: 'prayer', status: 'Sacred Chorten Walk', bookable: false },
        { time: '09:00 AM – 10:30 AM', event: 'Sacred Tashiding Stupa & Heritage Guided Tour', type: 'tour', experienceId: 'guided-heritage-tour', capacity: 18, booked: 4, bookable: true },
        { time: '11:00 AM – 12:00 PM', event: 'Holy Water Ceremony Interpretation', type: 'cultural', experienceId: 'cultural-walk-ceremony', capacity: 15, booked: 6, bookable: true },
        { time: '02:00 PM – 03:30 PM', event: 'Tashiding Hilltop Guided Walk', type: 'tour', experienceId: 'guided-heritage-tour', capacity: 18, booked: 8, bookable: true },
        { time: '04:30 PM – 05:30 PM', event: 'Evening Chanting & Butter Lamps', type: 'prayer', status: 'Open to Visitors', bookable: false },
    ],
    lingdum: [
        { time: '06:30 AM – 07:30 AM', event: 'Morning Monastic Chanting & Horn Ceremony', type: 'prayer', status: 'Open to Visitors', bookable: false },
        { time: '09:00 AM – 10:30 AM', event: 'Lingdum Ranka Architectural Tour', type: 'tour', experienceId: 'guided-heritage-tour', capacity: 20, booked: 7, bookable: true },
        { time: '11:00 AM – 12:00 PM', event: 'Cinematic Monastic Courtyard Walk', type: 'cultural', experienceId: 'photography-architecture-walk', capacity: 15, booked: 9, bookable: true },
        { time: '02:00 PM – 03:30 PM', event: 'Guided Heritage Tour (Afternoon Session)', type: 'tour', experienceId: 'guided-heritage-tour', capacity: 20, booked: 19, bookable: true },
        { time: '04:30 PM – 05:30 PM', event: 'Evening Prayer & Lamp Lighting', type: 'prayer', status: 'Open to Visitors', bookable: false },
    ],
};

// Generic fallback timetable for other monasteries
export const DEFAULT_MONASTERY_TIMETABLE = [
    { time: '06:00 AM – 07:00 AM', event: 'Morning Dawn Prayers & Incense Offering', type: 'prayer', status: 'Quiet Viewing', bookable: false },
    { time: '08:30 AM – 09:30 AM', event: 'Morning Shrine Hall Access & Blessings', type: 'prayer', status: 'Open to Visitors', bookable: false },
    { time: '09:30 AM – 11:00 AM', event: 'Guided Heritage Tour', type: 'tour', experienceId: 'guided-heritage-tour', capacity: 20, booked: 7, bookable: true },
    { time: '11:30 AM – 12:30 PM', event: 'Monastery Cultural Walk', type: 'cultural', experienceId: 'cultural-walk-ceremony', capacity: 15, booked: 5, bookable: true },
    { time: '01:00 PM – 02:00 PM', event: 'Midday Rest & Meditation', type: 'break', status: 'Courtyard Open', bookable: false },
    { time: '02:30 PM – 04:00 PM', event: 'Guided Heritage Tour (Afternoon)', type: 'tour', experienceId: 'guided-heritage-tour', capacity: 20, booked: 14, bookable: true },
    { time: '04:30 PM – 05:30 PM', event: 'Evening Chanting & Lamp Ceremony', type: 'prayer', status: 'Open to Visitors', bookable: false },
];

// ============================================================================
// 3. STORAGE & STATE MANAGEMENT (WITH LOCALSTORAGE PERSISTENCE)
// ============================================================================
const BOOKINGS_STORAGE_KEY = 'monastery360_experience_bookings';
const SLOTS_OVERRIDE_STORAGE_KEY = 'monastery360_slots_override';

/**
 * Generates dates for the next 7 days in formatted style
 */
export function getAvailableDates() {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);

        const iso = d.toISOString().split('T')[0];
        let label = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
        if (i === 0) label = `Today (${label})`;
        else if (i === 1) label = `Tomorrow (${label})`;

        dates.push({
            id: iso,
            dateObj: d,
            isoString: iso,
            formattedDate: d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }),
            shortLabel: label,
            isToday: i === 0,
        });
    }
    return dates;
}

/**
 * Returns customized slots for a monastery, experience, and date
 */
export function getSlotsForExperience(monasteryId, experienceId, dateIso) {
    const exp = MONASTERY_EXPERIENCES.find(e => e.id === experienceId) || MONASTERY_EXPERIENCES[0];
    const defaultSlots = exp.defaultSlots;

    // Load any user bookings from localStorage that affect this slot
    const overrides = getStoredSlotOverrides();
    const keyPrefix = `${monasteryId}_${experienceId}_${dateIso}`;

    return defaultSlots.map((slot, idx) => {
        const slotKey = `${keyPrefix}_${idx}`;
        const bookedCount = overrides[slotKey] !== undefined ? overrides[slotKey] : slot.baseBooked;
        const capacity = exp.capacity;
        const remaining = Math.max(0, capacity - bookedCount);

        let status = 'available';
        let statusBadge = 'Available';
        let color = '#16A34A'; // Green

        if (remaining === 0) {
            status = 'full';
            statusBadge = 'FULL';
            color = '#DC2626'; // Red
        } else if (remaining <= 5) {
            status = 'filling_fast';
            statusBadge = 'Filling Fast';
            color = '#D97706'; // Amber
        }

        return {
            slotIndex: idx,
            slotKey,
            startTime: slot.startTime,
            endTime: slot.endTime,
            timeRange: `${slot.startTime} – ${slot.endTime}`,
            capacity,
            booked: bookedCount,
            remaining,
            status,
            statusBadge,
            color,
            isBookable: remaining > 0,
        };
    });
}

/**
 * Get stored slot overrides (incremented bookings)
 */
export function getStoredSlotOverrides() {
    try {
        const raw = localStorage.getItem(SLOTS_OVERRIDE_STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

/**
 * Record a booking: decreases available seats, saves booking to history
 */
export function recordExperienceBooking(bookingData) {
    const {
        monasteryId,
        monasteryName,
        experienceId,
        experienceTitle,
        dateIso,
        formattedDate,
        timeSlot,
        visitorsCount,
        visitorName,
        visitorEmail,
        visitorPhone,
    } = bookingData;

    // 1. Check slot validity and prevent overbooking
    const slots = getSlotsForExperience(monasteryId, experienceId, dateIso);
    const targetSlot = slots.find(s => s.timeRange === timeSlot.timeRange);

    if (!targetSlot) {
        throw new Error('Selected time slot not found.');
    }

    if (targetSlot.remaining < visitorsCount) {
        throw new Error(`Only ${targetSlot.remaining} seat(s) available for this time slot.`);
    }

    // 2. Increment booked count in overrides
    const overrides = getStoredSlotOverrides();
    const newBookedCount = targetSlot.booked + visitorsCount;
    overrides[targetSlot.slotKey] = newBookedCount;
    localStorage.setItem(SLOTS_OVERRIDE_STORAGE_KEY, JSON.stringify(overrides));

    // 3. Generate unique reference ID (e.g. M360-RUM-89241)
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    const prefix = monasteryId.slice(0, 3).toUpperCase();
    const bookingId = `M360-${prefix}-${randomCode}`;

    // 4. Save confirmed booking in user's bookings history
    const newBookingRecord = {
        _id: `exp_${Date.now()}`,
        bookingId,
        monasteryId,
        monasteryName,
        eventName: `${experienceTitle} at ${monasteryName}`,
        experienceTitle,
        eventDate: formattedDate,
        dateIso,
        timeSlot: targetSlot.timeRange,
        attendees: Number(visitorsCount),
        location: monasteryName,
        name: visitorName,
        email: visitorEmail,
        phone: visitorPhone,
        status: 'confirmed',
        type: 'experience',
        createdAt: new Date().toISOString(),
    };

    try {
        const storedRaw = localStorage.getItem(BOOKINGS_STORAGE_KEY);
        const existing = storedRaw ? JSON.parse(storedRaw) : [];
        existing.unshift(newBookingRecord);
        localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(existing));
    } catch (e) {
        console.error('Error storing booking in localStorage:', e);
    }

    return newBookingRecord;
}

/**
 * Retrieve all experience bookings for current user
 */
export function getSavedExperienceBookings() {
    try {
        const raw = localStorage.getItem(BOOKINGS_STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

// ============================================================================
// 4. MONASTERY EVENTS (Festivals / Special Cultural Events)
// ============================================================================
export const MONASTERY_EVENTS = [
    {
        id: 'losar-rumtek',
        monasteryId: 'rumtek',
        title: 'Losar Festival Celebration',
        description: 'Tibetan New Year cultural ceremony with mask dances, butter lamp offerings, and traditional music.',
        date: '2026-02-20',
        formattedDate: '20 February 2026',
        category: 'Festival',
        slots: [
            { startTime: '10:00 AM', endTime: '11:30 AM', capacity: 40, baseBooked: 32 },
            { startTime: '02:00 PM', endTime: '03:30 PM', capacity: 40, baseBooked: 40 }, // Full
        ],
    },
    {
        id: 'cham-dance-ralang',
        monasteryId: 'ralang',
        title: 'Pang Lhabsol Cham Dance',
        description: 'Sacred mask dance ceremony honouring Mt. Kanchenjunga, performed by monks in elaborate costumes.',
        date: '2026-09-15',
        formattedDate: '15 September 2026',
        category: 'Cultural Ceremony',
        slots: [
            { startTime: '09:00 AM', endTime: '11:00 AM', capacity: 50, baseBooked: 18 },
            { startTime: '01:00 PM', endTime: '03:00 PM', capacity: 50, baseBooked: 44 },
        ],
    },
    {
        id: 'saga-dawa-pemayangtse',
        monasteryId: 'pemayangtse',
        title: 'Saga Dawa Full Moon Ceremony',
        description: 'Sacred Buddhist full moon procession and lamp lighting ceremony celebrating Buddha\'s enlightenment.',
        date: '2026-05-26',
        formattedDate: '26 May 2026',
        category: 'Spiritual Ceremony',
        slots: [
            { startTime: '07:00 AM', endTime: '08:30 AM', capacity: 30, baseBooked: 8 },
            { startTime: '06:00 PM', endTime: '07:30 PM', capacity: 30, baseBooked: 22 },
        ],
    },
    {
        id: 'dashain-enchey',
        monasteryId: 'enchey',
        title: 'Enchey Monastery Cham Festival',
        description: 'Annual mask dance and ritual performance unique to Enchey, drawing pilgrims from across Sikkim.',
        date: '2026-12-18',
        formattedDate: '18 December 2026',
        category: 'Festival',
        slots: [
            { startTime: '10:00 AM', endTime: '12:00 PM', capacity: 35, baseBooked: 10 },
            { startTime: '02:00 PM', endTime: '04:00 PM', capacity: 35, baseBooked: 29 },
        ],
    },
];

/**
 * Get live event slots (with localStorage overrides applied)
 */
export function getEventSlots(eventId) {
    const event = MONASTERY_EVENTS.find(e => e.id === eventId);
    if (!event) return [];

    const overrides = getStoredSlotOverrides();
    const keyPrefix = `event_${eventId}`;

    return event.slots.map((slot, idx) => {
        const slotKey = `${keyPrefix}_${idx}`;
        const bookedCount = overrides[slotKey] !== undefined ? overrides[slotKey] : slot.baseBooked;
        const remaining = Math.max(0, slot.capacity - bookedCount);

        let status = 'available';
        let statusBadge = 'Available';
        let color = '#16A34A';

        if (remaining === 0) { status = 'full'; statusBadge = 'FULL'; color = '#DC2626'; }
        else if (remaining <= 5) { status = 'filling_fast'; statusBadge = 'Filling Fast'; color = '#D97706'; }

        return {
            slotIndex: idx, slotKey,
            startTime: slot.startTime, endTime: slot.endTime,
            timeRange: `${slot.startTime} – ${slot.endTime}`,
            capacity: slot.capacity, booked: bookedCount,
            remaining, status, statusBadge, color,
            isBookable: remaining > 0,
        };
    });
}

/**
 * Normalize a monastery URL id to a timetable key.
 * e.g. MongoDB _id strings don't match timetable keys; we match by name slug.
 */
export function normalizeMonasteryId(rawId) {
    if (!rawId) return null;
    const id = rawId.toLowerCase().trim();
    // Direct match
    const directKeys = ['rumtek', 'pemayangtse', 'enchey', 'tashiding', 'lingdum'];
    if (directKeys.includes(id)) return id;

    // Partial match for MongoDB ObjectId-style or name-based slugs
    const slugMap = {
        rum: 'rumtek', pema: 'pemayangtse', enchey: 'enchey',
        tash: 'tashiding', lingd: 'lingdum', ralang: 'rumtek',
        dubdi: 'tashiding', phodong: 'rumtek', lachen: 'pemayangtse',
    };
    for (const [key, val] of Object.entries(slugMap)) {
        if (id.startsWith(key)) return val;
    }
    return null; // will fall back to DEFAULT_MONASTERY_TIMETABLE
}

/**
 * Get alternative available slots from OTHER monasteries when current is full or limited.
 * Returns up to 3 alternatives with at least one available slot.
 */
export function getAlternativeSlotsFor(currentMonasteryId, experienceId, dateIso) {
    const otherKeys = ['rumtek', 'pemayangtse', 'enchey', 'tashiding', 'lingdum']
        .filter(k => k !== currentMonasteryId);

    const results = [];
    for (const mId of otherKeys) {
        const slots = getSlotsForExperience(mId, experienceId, dateIso);
        const available = slots.filter(s => s.isBookable);
        if (available.length > 0) {
            const exp = MONASTERY_EXPERIENCES.find(e => e.id === experienceId);
            results.push({
                monasteryId: mId,
                monasteryName: mId.charAt(0).toUpperCase() + mId.slice(1) + ' Monastery',
                experienceTitle: exp?.title || 'Guided Tour',
                nextAvailableSlot: available[0],
                totalAvailable: available.length,
            });
        }
        if (results.length >= 2) break;
    }
    return results;
}

// ============================================================================
// 5. GET MONASTERY LIVE TIMETABLE (moved below to maintain export ordering)
// ============================================================================

/**
 * Get monastery timetable with live remaining seats calculation
 */
export function getMonasteryLiveTimetable(monasteryId, dateIso = new Date().toISOString().split('T')[0]) {
    const rawTable = MONASTERY_TIMETABLES[monasteryId] || DEFAULT_MONASTERY_TIMETABLE;
    const overrides = getStoredSlotOverrides();

    return rawTable.map((item, idx) => {
        if (!item.bookable || !item.experienceId) {
            return {
                ...item,
                remaining: null,
                statusText: item.status,
                color: '#64748B',
                isBookable: false,
            };
        }

        const slotKey = `${monasteryId}_${item.experienceId}_${dateIso}_0`;
        const bookedCount = overrides[slotKey] !== undefined ? overrides[slotKey] : item.booked;
        const capacity = item.capacity || 20;
        const remaining = Math.max(0, capacity - bookedCount);

        let statusText = `${remaining} / ${capacity} seats available`;
        let color = '#16A34A'; // Green
        let statusBadge = 'Available';

        if (remaining === 0) {
            statusText = 'FULL';
            color = '#DC2626'; // Red
            statusBadge = 'FULL';
        } else if (remaining <= 5) {
            statusText = `${remaining} / ${capacity} seats (Filling Fast)`;
            color = '#D97706'; // Amber
            statusBadge = 'Filling Fast';
        }

        return {
            ...item,
            capacity,
            booked: bookedCount,
            remaining,
            statusText,
            statusBadge,
            color,
            isBookable: remaining > 0,
        };
    });
}
