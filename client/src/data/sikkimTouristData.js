/**
 * MONASTERY360 — SIKKIM TOURIST ASSISTANCE & CROWD MANAGEMENT DATA ENGINE
 * Provides structured monasteries, transport hubs, taxi stands, hospitals,
 * tourist facilitation centres, and distance/crowd computation utilities.
 */

// ============================================================================
// 1. TIME SLOTS CONFIGURATION
// ============================================================================
export const TIME_SLOTS = [
    { id: 'slot-1', label: '8:00 AM – 10:00 AM', shortLabel: '8–10 AM', period: 'Morning Prayers' },
    { id: 'slot-2', label: '10:00 AM – 12:00 PM', shortLabel: '10–12 PM', period: 'Morning Inflow' },
    { id: 'slot-3', label: '12:00 PM – 2:00 PM', shortLabel: '12–2 PM', period: 'Midday Peak' },
    { id: 'slot-4', label: '2:00 PM – 4:00 PM', shortLabel: '2–4 PM', period: 'Afternoon Peak' },
    { id: 'slot-5', label: '4:00 PM – 6:00 PM', shortLabel: '4–6 PM', period: 'Evening Prayers' },
];

export const CURRENT_DEFAULT_SLOT = 'slot-3'; // 12:00 PM - 2:00 PM

// ============================================================================
// 2. POPULAR SIKKIM HUBS (For Manual Location Selection)
// ============================================================================
export const POPULAR_SIKKIM_HUBS = [
    { id: 'gangtok', name: 'Gangtok (MG Marg / Central)', district: 'East Sikkim', lat: 27.3288, lng: 88.6133 },
    { id: 'pelling', name: 'Pelling (West Sikkim)', district: 'West Sikkim', lat: 27.3175, lng: 88.2415 },
    { id: 'namchi', name: 'Namchi (South Sikkim)', district: 'South Sikkim', lat: 27.1662, lng: 88.3582 },
    { id: 'ravangla', name: 'Ravangla (South Sikkim)', district: 'South Sikkim', lat: 27.3075, lng: 88.3630 },
    { id: 'yuksom', name: 'Yuksom (Historic West)', district: 'West Sikkim', lat: 27.3733, lng: 88.2217 },
    { id: 'mangan', name: 'Mangan (North Sikkim)', district: 'North Sikkim', lat: 27.5050, lng: 88.5280 },
    { id: 'pakyong', name: 'Pakyong (Airport Transit)', district: 'East Sikkim', lat: 27.2325, lng: 88.5880 },
];

// ============================================================================
// 3. MONASTERIES MASTER DATA WITH CROWD SLOTS
// ============================================================================
export const MONASTERIES_DATA = [
    {
        id: 'rumtek',
        name: 'Rumtek Monastery',
        district: 'East Sikkim',
        address: 'Rumtek, 24 km from Gangtok, East Sikkim 737135',
        lat: 27.3065,
        lng: 88.5447,
        capacity: 100,
        // Base occupancy percentages per time-slot
        timeSlots: {
            'slot-1': 35, // 8-10 AM
            'slot-2': 65, // 10-12 PM
            'slot-3': 88, // 12-2 PM
            'slot-4': 96, // 2-4 PM
            'slot-5': 38, // 4-6 PM
        },
        rating: 4.8,
        reviewCount: 342,
        openingHours: '6:00 AM – 6:00 PM',
        image: '/images/rumtek.jpg',
        shortDescription: 'Seat of the Gyalwang Karmapa in exile with the Golden Stupa and magnificent Tibetan frescoes.',
        virtualTourAvailable: true,
        bookingAvailable: true,
        tags: ['Kagyu', 'Heritage', 'Spiritual', 'Popular', 'Architecture'],
        establishedYear: '1750s / 1966',
        alternativeMonasteryId: 'enchey', // recommended alternative when full
    },
    {
        id: 'pemayangtse',
        name: 'Pemayangtse Monastery',
        district: 'West Sikkim',
        address: 'Pelling, West Sikkim 737113',
        lat: 27.3060,
        lng: 88.2520,
        capacity: 90,
        timeSlots: {
            'slot-1': 28,
            'slot-2': 58,
            'slot-3': 78,
            'slot-4': 86,
            'slot-5': 32,
        },
        rating: 4.7,
        reviewCount: 215,
        openingHours: '7:00 AM – 5:00 PM',
        image: '/images/pemayangtse.jpg',
        shortDescription: 'Premier Nyingma monastery overlooking Kanchenjunga, famous for the 7-tiered wooden Zangdok Palri.',
        virtualTourAvailable: true,
        bookingAvailable: false,
        tags: ['Nyingma', 'Heritage', 'Historical', 'Popular'],
        establishedYear: '1705',
        alternativeMonasteryId: 'sanga-choeling',
    },
    {
        id: 'enchey',
        name: 'Enchey Monastery',
        district: 'East Sikkim',
        address: 'Gangtok-Nathula Road, Gangtok, East Sikkim 737101',
        lat: 27.3385,
        lng: 88.6186,
        capacity: 80,
        timeSlots: {
            'slot-1': 22,
            'slot-2': 38,
            'slot-3': 45,
            'slot-4': 52,
            'slot-5': 28,
        },
        rating: 4.6,
        reviewCount: 188,
        openingHours: '6:00 AM – 6:00 PM',
        image: '/images/enchey.jpg',
        shortDescription: 'Tranquil 200-year-old sanctuary perched on a scenic ridge surrounded by pine forests in Gangtok.',
        virtualTourAvailable: false,
        bookingAvailable: false,
        tags: ['Nyingma', 'Spiritual', 'Peaceful', 'Gangtok', 'Serene'],
        establishedYear: '1909',
        alternativeMonasteryId: 'lingdum',
    },
    {
        id: 'tashiding',
        name: 'Tashiding Monastery',
        district: 'West Sikkim',
        address: 'Tashiding, near Yuksom, West Sikkim 737111',
        lat: 27.3082,
        lng: 88.2980,
        capacity: 70,
        timeSlots: {
            'slot-1': 18,
            'slot-2': 32,
            'slot-3': 42,
            'slot-4': 48,
            'slot-5': 20,
        },
        rating: 4.8,
        reviewCount: 146,
        openingHours: '6:30 AM – 5:30 PM',
        image: '/images/tashiding.jpg',
        shortDescription: 'Sacred heart of Sikkim perched high on a heart-shaped hill between the Rathong and Rangit rivers.',
        virtualTourAvailable: false,
        bookingAvailable: false,
        tags: ['Nyingma', 'Holy', 'Pilgrimage', 'Peaceful'],
        establishedYear: '1641 / 1717',
        alternativeMonasteryId: 'dubdi',
    },
    {
        id: 'phodong',
        name: 'Phodong Monastery',
        district: 'North Sikkim',
        address: 'Phodong, 38 km from Gangtok, North Sikkim 737116',
        lat: 27.4200,
        lng: 88.5833,
        capacity: 65,
        timeSlots: {
            'slot-1': 15,
            'slot-2': 30,
            'slot-3': 40,
            'slot-4': 46,
            'slot-5': 18,
        },
        rating: 4.5,
        reviewCount: 96,
        openingHours: '7:00 AM – 5:00 PM',
        image: '/images/phodong.jpg',
        shortDescription: 'One of the six major monasteries of Sikkim belonging to the Karma Kagyu lineage with antique murals.',
        virtualTourAvailable: false,
        bookingAvailable: false,
        tags: ['Kagyu', 'Ancient', 'Murals', 'North Sikkim'],
        establishedYear: '1740',
        alternativeMonasteryId: 'lachen',
    },
    {
        id: 'ralang',
        name: 'Ralang Monastery',
        district: 'South Sikkim',
        address: 'Ralang, 13 km from Ravangla, South Sikkim 737139',
        lat: 27.2889,
        lng: 88.3458,
        capacity: 90,
        timeSlots: {
            'slot-1': 24,
            'slot-2': 48,
            'slot-3': 60,
            'slot-4': 68,
            'slot-5': 30,
        },
        rating: 4.7,
        reviewCount: 164,
        openingHours: '6:00 AM – 6:00 PM',
        image: '/images/ralang.jpg',
        shortDescription: 'Grand Karma Kagyu monastery host to the vibrant annual Pang Lhabsol Cham mask dances.',
        virtualTourAvailable: true,
        bookingAvailable: true,
        tags: ['Kagyu', 'Pang Lhabsol', 'Cham Dance', 'Ravangla'],
        establishedYear: '1975',
        alternativeMonasteryId: 'tashiding',
    },
    {
        id: 'dubdi',
        name: 'Dubdi Monastery',
        district: 'West Sikkim',
        address: 'Yuksom, West Sikkim 737113',
        lat: 27.3733,
        lng: 88.2217,
        capacity: 50,
        timeSlots: {
            'slot-1': 12,
            'slot-2': 22,
            'slot-3': 30,
            'slot-4': 35,
            'slot-5': 15,
        },
        rating: 4.6,
        reviewCount: 112,
        openingHours: '7:00 AM – 4:30 PM',
        image: '/images/dubdi.jpg',
        shortDescription: 'The oldest monastery in Sikkim (1701), known as the Hermit\'s Cell, nestled amidst lush chestnut forests.',
        virtualTourAvailable: false,
        bookingAvailable: false,
        tags: ['Nyingma', 'Oldest', 'Heritage', 'Trek', 'Serene'],
        establishedYear: '1701',
        alternativeMonasteryId: 'pemayangtse',
    },
    {
        id: 'lingdum',
        name: 'Lingdum (Ranka) Monastery',
        district: 'East Sikkim',
        address: 'Ranka, 16 km from Gangtok, East Sikkim 737135',
        lat: 27.3242,
        lng: 88.5794,
        capacity: 95,
        timeSlots: {
            'slot-1': 28,
            'slot-2': 55,
            'slot-3': 72,
            'slot-4': 82,
            'slot-5': 36,
        },
        rating: 4.7,
        reviewCount: 228,
        openingHours: '6:00 AM – 6:00 PM',
        image: '/images/lingdum.jpg',
        shortDescription: 'Magnificent Tibetan monastic complex surrounded by forested hills, famous for film cinematography.',
        virtualTourAvailable: true,
        bookingAvailable: true,
        tags: ['Kagyu', 'Architecture', 'Popular', 'Scenic', 'Gangtok'],
        establishedYear: '1999',
        alternativeMonasteryId: 'enchey',
    },
    {
        id: 'sanga-choeling',
        name: 'Sanga Choeling Monastery',
        district: 'West Sikkim',
        address: 'Ridge above Pelling, West Sikkim 737113',
        lat: 27.3083,
        lng: 88.2250,
        capacity: 55,
        timeSlots: {
            'slot-1': 16,
            'slot-2': 28,
            'slot-3': 38,
            'slot-4': 42,
            'slot-5': 18,
        },
        rating: 4.6,
        reviewCount: 98,
        openingHours: '6:30 AM – 5:00 PM',
        image: '/images/sangaChoeling.jpg',
        shortDescription: 'Constructed in 1697 atop a secluded ridge, one of the oldest Nyingma shrines with sacred relics and scenic trail.',
        virtualTourAvailable: false,
        bookingAvailable: false,
        tags: ['Nyingma', 'Historical', 'Peaceful', 'Ridge Trek'],
        establishedYear: '1697',
        alternativeMonasteryId: 'pemayangtse',
    },
    {
        id: 'lachen',
        name: 'Lachen Monastery',
        district: 'North Sikkim',
        address: 'Lachen Village, North Sikkim 737120',
        lat: 27.7167,
        lng: 88.5500,
        capacity: 60,
        timeSlots: {
            'slot-1': 14,
            'slot-2': 26,
            'slot-3': 34,
            'slot-4': 38,
            'slot-5': 16,
        },
        rating: 4.5,
        reviewCount: 82,
        openingHours: '6:00 AM – 5:00 PM',
        image: '/images/lachen.jpg',
        shortDescription: 'High-altitude Nyingma monastery (Ngagyur Dongag Choeling) overlooking alpine valleys and prayer wheels.',
        virtualTourAvailable: false,
        bookingAvailable: false,
        tags: ['Nyingma', 'Alpine', 'High Altitude', 'Remote'],
        establishedYear: '1858',
        alternativeMonasteryId: 'phodong',
    },
];

// ============================================================================
// 4. ESSENTIAL SIKKIM TOURIST POIS (TRANSPORT, HELP, HOSPITALS, HOTELS)
// ============================================================================
export const SIKKIM_POIS = [
    // ── Transport: Bus Stands & Taxi Stands ──
    {
        id: 'poi-snt-gangtok',
        name: 'SNT Bus Terminus (Gangtok)',
        category: 'transport',
        type: 'Bus Station',
        district: 'East Sikkim',
        address: 'National Highway 10, Gangtok 737101',
        lat: 27.3256,
        lng: 88.6088,
        phone: '+91 3592 202075',
        status: 'Open 24/7 (Bus services 5:30 AM – 7:00 PM)',
        description: 'Primary state transport hub connecting Gangtok to Siliguri, Darjeeling, Kalimpong, and all Sikkim district centres.',
    },
    {
        id: 'poi-taxi-deorali',
        name: 'Deorali Shared Taxi & Jeep Stand',
        category: 'transport',
        type: 'Taxi Stand',
        district: 'East Sikkim',
        address: 'Deorali Bazaar, Gangtok 737102',
        lat: 27.3195,
        lng: 88.6033,
        phone: '+91 94340 12345',
        status: 'Active (6:00 AM – 8:00 PM)',
        description: 'Main taxi stand for shared and reserved cabs to Rumtek, South Sikkim (Namchi/Ravangla), and Siliguri/NJP.',
    },
    {
        id: 'poi-taxi-vajra',
        name: 'Vajra Taxi & North Sikkim Jeep Stand',
        category: 'transport',
        type: 'Taxi Stand',
        district: 'East Sikkim',
        address: 'Vajra Cinema Road, Upper Gangtok 737101',
        lat: 27.3412,
        lng: 88.6145,
        phone: '+91 3592 201122',
        status: 'Active (5:00 AM – 6:00 PM)',
        description: 'Exclusive departure point for North Sikkim tours (Lachen, Lachung, Phodong, Yumthang Valley).',
    },
    {
        id: 'poi-taxi-pelling',
        name: 'Pelling Main Taxi & Transit Stand',
        category: 'transport',
        type: 'Taxi Stand',
        district: 'West Sikkim',
        address: 'Upper Pelling Main Road, West Sikkim 737113',
        lat: 27.3175,
        lng: 88.2415,
        phone: '+91 97330 98765',
        status: 'Active (6:00 AM – 7:00 PM)',
        description: 'Direct cabs and shared jeeps to Pemayangtse, Sanga Choeling, Tashiding, Yuksom, Geyzing, and Gangtok.',
    },
    {
        id: 'poi-taxi-namchi',
        name: 'Namchi Central Taxi & Bus Terminal',
        category: 'transport',
        type: 'Transport Hub',
        district: 'South Sikkim',
        address: 'Central Park, Namchi 737126',
        lat: 27.1662,
        lng: 88.3582,
        phone: '+91 3595 250555',
        status: 'Active (6:00 AM – 7:30 PM)',
        description: 'Central taxi stand connecting Namchi Char Dham, Samdruptse, Ralang Monastery, and Jorethang hub.',
    },
    {
        id: 'poi-taxi-ravangla',
        name: 'Ravangla Transit Taxi Stand',
        category: 'transport',
        type: 'Taxi Stand',
        district: 'South Sikkim',
        address: 'Ravangla Bazaar, South Sikkim 737139',
        lat: 27.3075,
        lng: 88.3630,
        phone: '+91 94740 55443',
        status: 'Active (6:30 AM – 6:30 PM)',
        description: 'Local and inter-district cabs to Ralang Monastery, Buddha Park, Pelling, and Gangtok.',
    },
    {
        id: 'poi-transport-pakyong',
        name: 'Pakyong Airport Taxi & Transport Hub',
        category: 'transport',
        type: 'Airport Transit',
        district: 'East Sikkim',
        address: 'Pakyong Airport Gate, East Sikkim 737106',
        lat: 27.2325,
        lng: 88.5880,
        phone: '+91 3592 257777',
        status: 'Flight Timings (8:00 AM – 4:00 PM)',
        description: 'Prepaid and metered cabs from Sikkim\'s greenfield airport to Gangtok (31 km) and Rumtek (28 km).',
    },

    // ── Tourist Help & Facilitation Centres ──
    {
        id: 'poi-help-mggangtok',
        name: 'Sikkim Tourism Facilitation Centre (TIC Gangtok)',
        category: 'tourist_help',
        type: 'Tourist Help Desk',
        district: 'East Sikkim',
        address: 'MG Marg, Tourism Bhawan, Gangtok 737101',
        lat: 27.3292,
        lng: 88.6138,
        phone: '+91 3592 209090 / Toll-Free: 1800-345-3256',
        status: 'Open Daily (9:00 AM – 7:00 PM)',
        description: 'Official Government of Sikkim tourist assistance office. Provides maps, monastery visitor permits, registered guide bookings, and emergency support.',
    },
    {
        id: 'poi-help-police',
        name: 'Sikkim Tourist Police Assistance Desk',
        category: 'tourist_help',
        type: 'Tourist Police Help',
        district: 'East Sikkim',
        address: 'Police HQ, MG Marg Promenade, Gangtok 737101',
        lat: 27.3305,
        lng: 88.6145,
        phone: '+91 3592 202022 / Emergency: 112',
        status: 'Open 24/7',
        description: 'Dedicated 24/7 tourist safety unit aiding lost visitors, document emergencies, mountain transit guidance, and incident reporting.',
    },
    {
        id: 'poi-help-pelling',
        name: 'West Sikkim Tourist Information Centre (Pelling)',
        category: 'tourist_help',
        type: 'Tourist Help Desk',
        district: 'West Sikkim',
        address: 'Helipad Road, Pelling, West Sikkim 737113',
        lat: 27.3150,
        lng: 88.2430,
        phone: '+91 3595 258222',
        status: 'Open Daily (9:30 AM – 5:30 PM)',
        description: 'Information desk for monastery trail trekking permits, local vehicle rates, and sacred site visitor codes.',
    },
    {
        id: 'poi-help-mangan',
        name: 'North Sikkim Permit & Tourist Assistance Office (Mangan)',
        category: 'tourist_help',
        type: 'Permit & Help Office',
        district: 'North Sikkim',
        address: 'District Administrative Complex, Mangan 737116',
        lat: 27.5060,
        lng: 88.5290,
        phone: '+91 3592 234123',
        status: 'Open (9:00 AM – 5:00 PM)',
        description: 'Mandatory Protected Area Permit (PAP) verification and route clearance hub for Phodong, Lachen, and Lachung.',
    },
    {
        id: 'poi-help-namchi',
        name: 'South Sikkim Tourist Facilitation Centre (Namchi)',
        category: 'tourist_help',
        type: 'Tourist Help Desk',
        district: 'South Sikkim',
        address: 'Near Char Dham Gate, Namchi 737126',
        lat: 27.1690,
        lng: 88.3610,
        phone: '+91 3595 250100',
        status: 'Open Daily (8:30 AM – 6:00 PM)',
        description: 'Heritage tourist reception counter for monastery route itineraries across Namchi, Ravangla, and Ralang.',
    },

    // ── Hospitals & Emergency Care ──
    {
        id: 'poi-hosp-stnm',
        name: 'STNM Multi-Speciality Hospital (State Referral)',
        category: 'hospital',
        type: 'Government Hospital',
        district: 'East Sikkim',
        address: 'Sochaygang, Sichey, Gangtok 737101',
        lat: 27.3180,
        lng: 88.5880,
        phone: '+91 3592 201075 / Emergency: 108',
        status: '24/7 Emergency & Trauma Centre',
        description: 'Sikkim\'s premier 1000-bed government referral hospital with full emergency trauma, ICU, and pharmacy services.',
    },
    {
        id: 'poi-hosp-crh',
        name: 'Central Referral Hospital (SMIMS / Manipal)',
        category: 'hospital',
        type: 'Super Speciality Hospital',
        district: 'East Sikkim',
        address: '5th Mile, Tadong, Gangtok 737102',
        lat: 27.3100,
        lng: 88.5980,
        phone: '+91 3592 270523 / Emergency: 03592-270524',
        status: '24/7 Emergency Services',
        description: 'Advanced super-speciality tertiary care medical college hospital with round-the-clock emergency casualty and ambulance fleet.',
    },
    {
        id: 'poi-hosp-geyzing',
        name: 'Geyzing District Hospital (West Sikkim)',
        category: 'hospital',
        type: 'District Hospital',
        district: 'West Sikkim',
        address: 'Hospital Hill, Geyzing 737111 (9 km from Pelling)',
        lat: 27.2880,
        lng: 88.2450,
        phone: '+91 3595 250666 / Emergency: 108',
        status: '24/7 Emergency',
        description: 'Chief emergency and medical facility servicing Pelling, Pemayangtse, Sanga Choeling, and Tashiding monasteries.',
    },
    {
        id: 'poi-hosp-namchi',
        name: 'Namchi District Hospital (South Sikkim)',
        category: 'hospital',
        type: 'District Hospital',
        district: 'South Sikkim',
        address: 'Hospital Road, Namchi 737126',
        lat: 27.1640,
        lng: 88.3520,
        phone: '+91 3595 250222 / Emergency: 108',
        status: '24/7 Emergency',
        description: 'District emergency health centre with casualty and oxygen facilities for South Sikkim travellers.',
    },
    {
        id: 'poi-hosp-mangan',
        name: 'Mangan District Hospital (North Sikkim)',
        category: 'hospital',
        type: 'District Hospital',
        district: 'North Sikkim',
        address: 'Mangan Bazaar, North Sikkim 737116',
        lat: 27.5080,
        lng: 88.5310,
        phone: '+91 3592 234108 / Emergency: 108',
        status: '24/7 Emergency & High Altitude Clinic',
        description: 'High-altitude emergency medical unit equipped with oxygen bars and acute mountain sickness (AMS) stabilization care.',
    },
    {
        id: 'poi-hosp-rumtek-phc',
        name: 'Rumtek Primary Health Centre (PHC)',
        category: 'hospital',
        type: 'Health Centre',
        district: 'East Sikkim',
        address: 'Rumtek Village, near Monastery Gate 737135',
        lat: 27.3040,
        lng: 88.5490,
        phone: '+91 3592 252110',
        status: 'Open 8:00 AM – 4:00 PM (Emergency on-call)',
        description: 'Local medical dispensary offering first-aid, altitude medicine, and emergency stabilization right next to Rumtek Monastery.',
    },

    // ── Hotels & Eco Lodgings ──
    {
        id: 'poi-hotel-elgin',
        name: 'The Elgin Nor-Khill (Heritage Luxury Hotel)',
        category: 'hotel',
        type: 'Heritage Hotel',
        district: 'East Sikkim',
        address: 'Paljor Stadium Road, Gangtok 737101',
        lat: 27.3310,
        lng: 88.6120,
        phone: '+91 3592 205637',
        status: 'Open 24/7 (Check-in 2:00 PM)',
        description: 'Historic royal guesthouse built in 1932 by the King of Sikkim, decorated with authentic thangkas and Sikkimese woodwork.',
    },
    {
        id: 'poi-hotel-mayfair',
        name: 'Mayfair Spa Resort & Casino',
        category: 'hotel',
        type: 'Luxury Resort',
        district: 'East Sikkim',
        address: 'Lower Samdur, Ranipool (near Rumtek turnoff) 737135',
        lat: 27.2910,
        lng: 88.5780,
        phone: '+91 3592 250555',
        status: 'Open 24/7',
        description: 'Sprawling 5-star mountain resort located strategically between Gangtok town and Rumtek Monastery.',
    },
    {
        id: 'poi-hotel-chumbi',
        name: 'The Chumbi Mountain Retreat & Spa (Pelling)',
        category: 'hotel',
        type: 'Heritage Resort',
        district: 'West Sikkim',
        address: 'Naku-Chumbong, Pelling 737113',
        lat: 27.3110,
        lng: 88.2460,
        phone: '+91 98000 44332',
        status: 'Open 24/7',
        description: 'Traditional Sikkimese stone architecture resort overlooking Mount Kanchenjunga, close to Pemayangtse Monastery.',
    },
    {
        id: 'poi-hotel-ravangla',
        name: 'Ravangla Eco Heritage Lodge',
        category: 'hotel',
        type: 'Eco Lodge',
        district: 'South Sikkim',
        address: 'Buddha Park Road, Ravangla 737139',
        lat: 27.3050,
        lng: 88.3610,
        phone: '+91 97331 22334',
        status: 'Open 24/7',
        description: 'Comfortable Himalayan timber cottages ideal for visitors touring Buddha Park and Ralang Monastery.',
    },
    {
        id: 'poi-hotel-summit',
        name: 'Summit Norling Resort & Spa (Ranka / Lingdum)',
        category: 'hotel',
        type: 'Resort',
        district: 'East Sikkim',
        address: 'Ranka Road, near Lingdum Monastery 737135',
        lat: 27.3220,
        lng: 88.5760,
        phone: '+91 3592 258899',
        status: 'Open 24/7',
        description: 'Peaceful waterfall-view resort located less than 1 km from Lingdum (Ranka) Monastery.',
    },

    // ── Major Cultural Landmarks ──
    {
        id: 'poi-lm-mgmarg',
        name: 'MG Marg Cultural Promenade',
        category: 'other',
        type: 'Cultural Landmark',
        district: 'East Sikkim',
        address: 'MG Marg, Gangtok 737101',
        lat: 27.3288,
        lng: 88.6133,
        phone: 'N/A',
        status: 'Open (Pedestrian only zone)',
        description: 'Heart of Gangtok town — clean cobblestone pedestrian hub featuring souvenir shops, Sikkimese cafes, and tourist help centres.',
    },
    {
        id: 'poi-lm-tibetology',
        name: 'Namgyal Institute of Tibetology',
        category: 'other',
        type: 'Museum & Research Centre',
        district: 'East Sikkim',
        address: 'Deorali, Gangtok 737102',
        lat: 27.3155,
        lng: 88.6045,
        phone: '+91 3592 281242',
        status: 'Open Mon-Sat (10:00 AM – 4:00 PM)',
        description: 'World-renowned Tibetan museum preserving rare 11th-century Buddhist manuscripts, statues, thangkas, and monastic art.',
    },
    {
        id: 'poi-lm-buddhapark',
        name: 'Buddha Park (Tathagata Tsal)',
        category: 'other',
        type: 'Sacred Landmark',
        district: 'South Sikkim',
        address: 'Ravangla, South Sikkim 737139',
        lat: 27.3090,
        lng: 88.3650,
        phone: '+91 3595 258333',
        status: 'Open Daily (8:00 AM – 6:00 PM)',
        description: 'Magnificent 130-foot consecrated statue of Sakyamuni Buddha surrounded by manicured prayer gardens and mountain panoramas.',
    },
    {
        id: 'poi-lm-skywalk',
        name: 'Pelling Glass Skywalk & Chenrezig Statue',
        category: 'other',
        type: 'Scenic Landmark',
        district: 'West Sikkim',
        address: 'Sangacholing Hilltop, Pelling 737113',
        lat: 27.3095,
        lng: 88.2270,
        phone: 'N/A',
        status: 'Open Daily (8:00 AM – 5:30 PM)',
        description: 'India\'s first high-altitude glass skywalk offering thrilling views of the Himalayas adjacent to Sanga Choeling Monastery.',
    },
];

// ============================================================================
// 5. HAVERSINE DISTANCE & APPROXIMATE TRAVEL TIME UTILITIES
// ============================================================================

/**
 * Calculate Great-Circle distance between two coordinates in Kilometers
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
    if (lat1 === undefined || lat1 === null || lon1 === undefined || lon1 === null || 
        lat2 === undefined || lat2 === null || lon2 === undefined || lon2 === null) {
        return null;
    }
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return parseFloat(d.toFixed(1));
}

/**
 * Estimate mountain terrain driving travel time based on km.
 * Mountain winding roads in Sikkim average ~20–30 km/h.
 */
export function getApproxTravelTime(distanceKm) {
    if (distanceKm === null || distanceKm === undefined) return null;
    if (distanceKm < 0.5) return 'Approx. 2–5 min walk';
    if (distanceKm < 1.5) return 'Approx. 5–10 min';
    // Average mountain driving time formula: distance * 2.6 mins + 3 mins buffer
    const mins = Math.max(8, Math.round(distanceKm * 2.6));
    if (mins < 60) {
        return `Approx. ${mins} min drive`;
    }
    const hrs = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return remainingMins > 0 ? `Approx. ${hrs}h ${remainingMins}m` : `Approx. ${hrs}h`;
}

// ============================================================================
// 6. CROWD EVALUATION & CLASSIFICATION
// ============================================================================

export function getCrowdStatus(occupancyPercent) {
    if (occupancyPercent <= 30) {
        return {
            level: 'low',
            badge: 'LOW CROWD',
            color: '#16A34A', // Green
            bg: 'rgba(22, 163, 74, 0.12)',
            border: 'rgba(22, 163, 74, 0.35)',
            iconName: 'Smile',
            label: 'Calm & Serene',
            recommendation: 'Ideal time for meditation, photography, and peaceful exploration.',
        };
    }
    if (occupancyPercent <= 70) {
        return {
            level: 'moderate',
            badge: 'MODERATE CROWD',
            color: '#D97706', // Yellow/Amber
            bg: 'rgba(217, 119, 6, 0.12)',
            border: 'rgba(217, 119, 6, 0.35)',
            iconName: 'Users',
            label: 'Moderate Visitors',
            recommendation: 'Comfortable visiting conditions with steady tourist flow.',
        };
    }
    if (occupancyPercent <= 90) {
        return {
            level: 'high',
            badge: 'HIGH CROWD',
            color: '#DC2626', // Red
            bg: 'rgba(220, 38, 38, 0.12)',
            border: 'rgba(220, 38, 38, 0.35)',
            iconName: 'AlertTriangle',
            label: 'High Visitor Density',
            recommendation: 'Currently crowded. Consider visiting during a later time slot.',
        };
    }
    return {
        level: 'full',
        badge: 'NEAR FULL / PEAK',
        color: '#991B1B', // Dark Maroon
        bg: 'rgba(153, 27, 27, 0.16)',
        border: 'rgba(153, 27, 27, 0.45)',
        iconName: 'Flame',
        label: 'Peak Capacity',
        recommendation: 'Site is near capacity. We strongly recommend visiting a nearby alternative.',
    };
}

/**
 * Get dynamic crowd state for a monastery at a specific time slot
 */
export function getMonasteryCrowdAtSlot(monastery, slotId = CURRENT_DEFAULT_SLOT) {
    const occupancyPercent = monastery.timeSlots?.[slotId] ?? 50;
    const currentVisitors = Math.round((monastery.capacity * occupancyPercent) / 100);
    const status = getCrowdStatus(occupancyPercent);

    return {
        slotId,
        slotInfo: TIME_SLOTS.find(s => s.id === slotId) || TIME_SLOTS[2],
        occupancyPercent,
        capacity: monastery.capacity,
        currentVisitors,
        ...status,
    };
}

/**
 * Identify the best (least crowded) time slot for a monastery
 */
export function getBestTimeSlot(monastery) {
    if (!monastery.timeSlots) return null;
    let lowestSlotId = 'slot-1';
    let lowestOccupancy = 100;

    Object.entries(monastery.timeSlots).forEach(([slotId, occupancy]) => {
        if (occupancy < lowestOccupancy) {
            lowestOccupancy = occupancy;
            lowestSlotId = slotId;
        }
    });

    const slotObj = TIME_SLOTS.find(s => s.id === lowestSlotId);
    return {
        slotId: lowestSlotId,
        label: slotObj ? slotObj.label : '4:00 PM – 6:00 PM',
        shortLabel: slotObj ? slotObj.shortLabel : '4–6 PM',
        occupancyPercent: lowestOccupancy,
        reason: 'Expected lowest visitor density of the day.',
    };
}

/**
 * Automatic alternative recommendation when a monastery is crowded (>70%)
 */
export function getAlternativeMonastery(targetMonastery, allMonasteries = MONASTERIES_DATA, slotId = CURRENT_DEFAULT_SLOT) {
    if (!targetMonastery) return null;

    // Direct specified alternative if valid and less crowded
    if (targetMonastery.alternativeMonasteryId) {
        const directAlt = allMonasteries.find(m => m.id === targetMonastery.alternativeMonasteryId);
        if (directAlt) {
            const altCrowd = getMonasteryCrowdAtSlot(directAlt, slotId);
            if (altCrowd.occupancyPercent <= 65) {
                const dist = calculateDistance(targetMonastery.lat, targetMonastery.lng, directAlt.lat, directAlt.lng);
                return {
                    monastery: directAlt,
                    crowd: altCrowd,
                    distanceKm: dist,
                    travelTime: getApproxTravelTime(dist),
                    reason: `Nearby in ${directAlt.district} with only ${altCrowd.occupancyPercent}% crowd vs ${targetMonastery.name}'s peak traffic.`,
                };
            }
        }
    }

    // Otherwise, find the lowest crowded monastery in same/neighboring district
    const candidates = allMonasteries
        .filter(m => m.id !== targetMonastery.id)
        .map(m => {
            const crowd = getMonasteryCrowdAtSlot(m, slotId);
            const dist = calculateDistance(targetMonastery.lat, targetMonastery.lng, m.lat, m.lng);
            return { monastery: m, crowd, distanceKm: dist };
        })
        .filter(c => c.crowd.occupancyPercent <= 60)
        .sort((a, b) => a.distanceKm - b.distanceKm);

    if (candidates.length > 0) {
        const best = candidates[0];
        return {
            monastery: best.monastery,
            crowd: best.crowd,
            distanceKm: best.distanceKm,
            travelTime: getApproxTravelTime(best.distanceKm),
            reason: `Nearby alternative (${best.distanceKm} km away) with serene atmosphere and ${best.crowd.occupancyPercent}% occupancy.`,
        };
    }

    return null;
}

// ============================================================================
// 7. MULTI-FACTOR RECOMMENDATION SCORING ENGINE
// ============================================================================

/**
 * Transparent scoring system:
 * - Distance: 30%
 * - Crowd Availability: 30%
 * - Opening status / Hours: 15%
 * - Rating: 10%
 * - User intent / Search match: 10%
 * - Virtual Tour / Facilities: 5%
 */
export function calculateRecommendationScore(monastery, userCoords = null, slotId = CURRENT_DEFAULT_SLOT, query = '') {
    const crowdInfo = getMonasteryCrowdAtSlot(monastery, slotId);

    // 1. Crowd score (100 = 0% crowd, 0 = 100% crowd)
    const crowdScore = Math.max(0, 100 - crowdInfo.occupancyPercent);

    // 2. Distance score (closer = higher)
    let distanceScore = 75; // neutral fallback
    let distanceKm = null;
    if (userCoords && userCoords.lat && userCoords.lng) {
        distanceKm = calculateDistance(userCoords.lat, userCoords.lng, monastery.lat, monastery.lng);
        if (distanceKm <= 5) distanceScore = 100;
        else if (distanceKm <= 15) distanceScore = 85;
        else if (distanceKm <= 35) distanceScore = 65;
        else if (distanceKm <= 60) distanceScore = 45;
        else distanceScore = 25;
    }

    // 3. Rating score (4.8 / 5 -> 96)
    const ratingScore = (monastery.rating / 5) * 100;

    // 4. Open status score
    const openStatusScore = 95;

    // 5. Query / features match
    let queryScore = 80;
    const q = query.toLowerCase();
    if (q.includes('less crowd') || q.includes('quiet') || q.includes('peaceful') || q.includes('serene')) {
        queryScore = crowdInfo.occupancyPercent < 40 ? 100 : 40;
    }
    if (q.includes('virtual tour') || q.includes('360') || q.includes('vr')) {
        queryScore = monastery.virtualTourAvailable ? 100 : 30;
    }
    if (q.includes('historic') || q.includes('ancient') || q.includes('oldest')) {
        queryScore = (monastery.tags.includes('Heritage') || monastery.tags.includes('Oldest') || monastery.tags.includes('Historical')) ? 100 : 60;
    }
    if (q.includes('gangtok') && monastery.district.includes('East')) queryScore = 100;
    if (q.includes('pelling') && monastery.district.includes('West')) queryScore = 100;
    if (q.includes('namchi') && monastery.district.includes('South')) queryScore = 100;
    if (q.includes('ravangla') && monastery.district.includes('South')) queryScore = 100;

    // 6. Bonus for 360 tour
    const facilityBonus = monastery.virtualTourAvailable ? 100 : 60;

    // Weighted computation
    const totalScore = Math.round(
        distanceScore * 0.30 +
        crowdScore * 0.30 +
        openStatusScore * 0.15 +
        ratingScore * 0.10 +
        queryScore * 0.10 +
        facilityBonus * 0.05
    );

    // Dynamic reason generation
    let reasons = [];
    if (distanceKm !== null && distanceKm <= 10) reasons.push('Close to your location');
    if (crowdInfo.occupancyPercent <= 40) reasons.push('Currently peaceful with low crowd');
    else if (crowdInfo.occupancyPercent <= 65) reasons.push('Manageable moderate visitor traffic');
    else reasons.push('Popular site currently seeing high visitor traffic');
    if (monastery.rating >= 4.7) reasons.push('High rating (4.7+ ★)');
    if (monastery.virtualTourAvailable) reasons.push('360° Virtual Tour available');

    return {
        score: Math.min(99, Math.max(40, totalScore)),
        reasonsText: reasons.slice(0, 2).join(' and '),
        distanceKm,
        travelTime: getApproxTravelTime(distanceKm),
        crowdInfo,
    };
}

// ============================================================================
// 8. NATURAL LANGUAGE SMART SEARCH QUERY PARSER
// ============================================================================

export function parseSmartSearchQuery(query = '', userCoords = null, categoryFilter = 'all', slotId = CURRENT_DEFAULT_SLOT) {
    const cleanQ = query.trim().toLowerCase();
    const isNearbyQuery = cleanQ.includes('near me') || cleanQ.includes('nearest') || cleanQ.includes('near my location') || cleanQ.includes('nearby') || cleanQ.includes('close');

    // Intent detection
    const isTransportQuery = cleanQ.includes('bus') || cleanQ.includes('taxi') || cleanQ.includes('train') || cleanQ.includes('railway') || cleanQ.includes('airport') || cleanQ.includes('cab') || cleanQ.includes('jeep') || cleanQ.includes('transport') || cleanQ.includes('station') || cleanQ.includes('stand');
    const isHospitalQuery = cleanQ.includes('hospital') || cleanQ.includes('doctor') || cleanQ.includes('medical') || cleanQ.includes('clinic') || cleanQ.includes('emergency') || cleanQ.includes('health') || cleanQ.includes('ambulance') || cleanQ.includes('phc');
    const isHelpQuery = cleanQ.includes('tourist help') || cleanQ.includes('information') || cleanQ.includes('permit') || cleanQ.includes('police') || cleanQ.includes('lost') || cleanQ.includes('assistance') || cleanQ.includes('help');
    const isHotelQuery = cleanQ.includes('hotel') || cleanQ.includes('resort') || cleanQ.includes('stay') || cleanQ.includes('lodge') || cleanQ.includes('accommodation');
    const isDirectionsQuery = cleanQ.includes('how to reach') || cleanQ.includes('direction') || cleanQ.includes('route to') || cleanQ.includes('way to');

    // Collect all candidate POIs
    let matchedPois = SIKKIM_POIS.map(poi => {
        let distanceKm = null;
        if (userCoords && userCoords.lat && userCoords.lng) {
            distanceKm = calculateDistance(userCoords.lat, userCoords.lng, poi.lat, poi.lng);
        }
        return {
            ...poi,
            itemType: 'poi',
            distanceKm,
            travelTime: getApproxTravelTime(distanceKm),
        };
    });

    // Collect all candidate Monasteries
    let matchedMonasteries = MONASTERIES_DATA.map(mon => {
        const ranking = calculateRecommendationScore(mon, userCoords, slotId, cleanQ);
        return {
            ...mon,
            itemType: 'monastery',
            category: 'monasteries',
            recommendationScore: ranking.score,
            recommendationReason: ranking.reasonsText,
            distanceKm: ranking.distanceKm,
            travelTime: ranking.travelTime,
            crowdInfo: ranking.crowdInfo,
            bestSlot: getBestTimeSlot(mon),
            alternative: ranking.crowdInfo.occupancyPercent >= 70 ? getAlternativeMonastery(mon, MONASTERIES_DATA, slotId) : null,
        };
    });

    // If a specific category filter is chosen in UI or implied by intent
    let activeFilter = categoryFilter;
    if (activeFilter === 'all') {
        if (isTransportQuery) activeFilter = 'transport';
        else if (isHospitalQuery) activeFilter = 'hospitals';
        else if (isHelpQuery) activeFilter = 'tourist_help';
        else if (isHotelQuery) activeFilter = 'hotels';
    }

    if (activeFilter === 'monasteries') {
        matchedPois = [];
    } else if (activeFilter === 'transport') {
        matchedPois = matchedPois.filter(p => p.category === 'transport');
        matchedMonasteries = [];
    } else if (activeFilter === 'tourist_help') {
        matchedPois = matchedPois.filter(p => p.category === 'tourist_help');
        matchedMonasteries = [];
    } else if (activeFilter === 'hospitals') {
        matchedPois = matchedPois.filter(p => p.category === 'hospital');
        matchedMonasteries = [];
    } else if (activeFilter === 'hotels') {
        matchedPois = matchedPois.filter(p => p.category === 'hotel');
        matchedMonasteries = [];
    } else if (activeFilter === 'other') {
        matchedPois = matchedPois.filter(p => p.category === 'other');
        matchedMonasteries = [];
    }

    // Query text match filtering if search box is non-empty
    if (cleanQ && !isNearbyQuery && cleanQ !== 'lost' && cleanQ !== 'help' && !isTransportQuery && !isHospitalQuery && !isHelpQuery && !isHotelQuery) {
        // Filter POIs
        matchedPois = matchedPois.filter(poi => {
            return (
                poi.name.toLowerCase().includes(cleanQ) ||
                poi.type.toLowerCase().includes(cleanQ) ||
                poi.district.toLowerCase().includes(cleanQ) ||
                poi.description.toLowerCase().includes(cleanQ)
            );
        });

        // Filter Monasteries
        matchedMonasteries = matchedMonasteries.filter(mon => {
            return (
                mon.name.toLowerCase().includes(cleanQ) ||
                mon.district.toLowerCase().includes(cleanQ) ||
                mon.tags.some(t => t.toLowerCase().includes(cleanQ)) ||
                mon.shortDescription.toLowerCase().includes(cleanQ) ||
                (cleanQ.includes('less crowd') && mon.crowdInfo.occupancyPercent <= 50) ||
                (cleanQ.includes('virtual') && mon.virtualTourAvailable) ||
                (isDirectionsQuery && mon.name.toLowerCase().includes(cleanQ.replace('how to reach', '').replace('directions to', '').trim()))
            );
        });
    }

    // Merge and sort
    let allResults = [...matchedMonasteries, ...matchedPois];

    if (isNearbyQuery || userCoords) {
        // Sort primarily by distance if user coords are present
        allResults.sort((a, b) => {
            if (a.distanceKm === null) return 1;
            if (b.distanceKm === null) return -1;
            return a.distanceKm - b.distanceKm;
        });
    } else {
        // Sort monasteries by recommendation score, POIs after
        allResults.sort((a, b) => {
            if (a.itemType === 'monastery' && b.itemType === 'monastery') {
                return (b.recommendationScore || 0) - (a.recommendationScore || 0);
            }
            if (a.itemType === 'monastery') return -1;
            if (b.itemType === 'monastery') return 1;
            return 0;
        });
    }

    return {
        query: cleanQ,
        activeFilter,
        isNearbyQuery,
        isDirectionsQuery,
        results: allResults,
        monasteryCount: matchedMonasteries.length,
        poiCount: matchedPois.length,
    };
}
