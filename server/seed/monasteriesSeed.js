require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Monastery = require('../models/Monastery');

const seedMonasteries = [
    {
        name: 'Rumtek Monastery',
        district: 'East Sikkim',
        address: 'Rumtek, 24 km from Gangtok, East Sikkim 737135',
        latitude: 27.3065,
        longitude: 88.5447,
        shortDescription: 'Seat of H.H. the Gyalwang Karmapa in exile, celebrated for its Golden Stupa and magnificent Tibetan architecture.',
        description: 'Rumtek Monastery, also called the Dharma Chakra Centre, is one of the largest and most significant monasteries in Sikkim. Built in the 1960s by the 16th Karmapa as his main seat in exile, it is a focal point for the Karma Kagyu lineage. The complex features a main shrine hall adorned with intricate murals, silk thangkas, and a 13-foot golden stupa containing the sacred relics of the 16th Karmapa.',
        history: 'Originally established in the mid-1750s under the 12th Karmapa Changchub Dorje, the monastery fell into ruin over centuries. In 1959, H.H. 16th Karmapa relocated from Tibet to Sikkim and chose Rumtek to rebuild his principal seat. Construction was completed in 1966 with generous support from the Chogyal of Sikkim.',
        establishedYear: '1750s / 1966',
        architecture: 'Traditional Tibetan monastic architecture modeled after Tsurphu Monastery in Tibet. Features carved wooden beams, hand-painted frescoes, golden roof finials, and a central assembly hall (Lhakhang).',
        significance: 'Main international seat of the Karma Kagyu lineage outside Tibet, housing invaluable Buddhist scriptures and sacred relics.',
        openingHours: '6:00 AM - 6:00 PM',
        visitingInformation: 'Visitors require valid photo ID at security checkpoints. Shoes must be removed before entering the main shrine hall.',
        bestTimeToVisit: 'March to June, September to November. The Tibetan New Year (Losar) and Tsechu dance festivals are major highlights.',
        images: [
            { url:'/images/rumtek.jpg'}
        ],
        rating: 4.8,
        reviewCount: 342,
        popularity: 98,
        tags: ['Kagyu', 'Heritage', 'Spiritual', 'Architecture', 'Popular'],
        categories: ['Kagyu', 'Heritage', 'Active'],
        facilities: {
            parking: true,
            restrooms: true,
            guidedTours: true,
            giftShop: true,
            accessibility: false,
            audioGuide: true,
            offlineContent: true
        },
        virtualTourAvailable: true,
        bookingAvailable: true,
        isPublished: true
    },
    {
        name: 'Pemayangtse Monastery',
        district: 'West Sikkim',
        address: 'Pelling, West Sikkim 737113',
        latitude: 27.3060,
        longitude: 88.2520,
        shortDescription: 'One of the oldest and premier Nyingma monasteries in Sikkim, famous for the wooden Sangay Lhadhat structure.',
        description: 'Pemayangtse Monastery, meaning "Perfect Sublime Lotus", stands at an elevation of 2,085 meters overlooking the majestic Kanchenjunga range. Designed exclusively for Ta-sang (pure monks) of Nyingma lineage, it preserves rare antique statues, ancient scrolls, and exquisite traditional paintings.',
        history: 'Planned by Lhatsun Namkha Jigme in the 17th century, the monastery was constructed by the 3rd Chogyal of Sikkim, Chador Namgyal, around 1705.',
        establishedYear: '1705',
        architecture: 'Three-storied traditional structure housing ancient thangkas. The top floor holds the famous 7-tiered wooden sculpture of Zangdok Palri (heaven of Guru Rinpoche), hand-carved by Dungzin Rinpoche.',
        significance: 'Head monastery of the Nyingma order in Sikkim; historically responsible for crowning the Chogyals (Kings) of Sikkim.',
        openingHours: '7:00 AM - 5:00 PM',
        visitingInformation: 'A modest entry fee is charged at the gate. Photography inside the main altar is restricted.',
        bestTimeToVisit: 'March to May and October to December. The Cham dance festival is held on the 28th and 29th day of the 12th Tibetan month.',
        images: [
            { url:'/images/pemayangtse.jpg' }
        ],
        rating: 4.7,
        reviewCount: 215,
        popularity: 92,
        tags: ['Nyingma', 'Heritage', 'Historical', 'Peaceful'],
        categories: ['Nyingma', 'Heritage'],
        facilities: {
            parking: true,
            restrooms: true,
            guidedTours: true,
            giftShop: false,
            accessibility: false,
            audioGuide: true,
            offlineContent: true
        },
        virtualTourAvailable: true,
        bookingAvailable: false,
        isPublished: true
    },
    {
        name: 'Enchey Monastery',
        district: 'East Sikkim',
        address: 'Gangtok-Nathula Road, Gangtok, East Sikkim 737101',
        latitude: 27.3385,
        longitude: 88.6186,
        shortDescription: 'Perched on a ridge above Gangtok, blessed by Lama Drupthob Karpo and renowned for its tranquil pine surroundings.',
        description: 'Enchey Monastery, meaning "Solitary Temple", is situated 3 km from Gangtok town center. Surrounded by tall pine trees and vibrant prayer flags, it belongs to the Nyingma order and provides sweeping views of Mt. Kanchenjunga.',
        history: 'Lama Drupthob Karpo, a tantric master known for flying, established a small hermitage here in the mid-1800s. The current monastery structure was erected in 1909 during the reign of Sidkeong Tulku.',
        establishedYear: '1909',
        architecture: 'Built in the pagoda style with a golden cupola, painted walls depicting Buddhist deities, and wheel of law symbols on the roof facade.',
        significance: 'Believed to be protected by the guardian deities Khangchendzonga and Yabdean.',
        openingHours: '6:00 AM - 6:00 PM',
        visitingInformation: 'Easily accessible via taxi from Gangtok main market. Very peaceful early morning environment.',
        bestTimeToVisit: 'October to May. The annual Cham dance occurs in January.',
        images: [
            { url:'/images/enchey.jpg' }
        ],
        rating: 4.6,
        reviewCount: 188,
        popularity: 88,
        tags: ['Nyingma', 'Spiritual', 'Peaceful', 'Gangtok'],
        categories: ['Nyingma', 'Active'],
        facilities: {
            parking: true,
            restrooms: true,
            guidedTours: false,
            giftShop: false,
            accessibility: true,
            audioGuide: false,
            offlineContent: false
        },
        virtualTourAvailable: false,
        bookingAvailable: false,
        isPublished: true
    },
    {
        name: 'Tashiding Monastery',
        district: 'West Sikkim',
        address: 'Tashiding, near Yuksom, West Sikkim 737111',
        latitude: 27.3082,
        longitude: 88.2980,
        shortDescription: 'Holy hill monastery famous for the sacred Bumchu festival and the sin-cleansing Thongwa Rangdol chorten.',
        description: 'Tashiding Monastery sits atop a heart-shaped hill between the Rathong and Rangeet rivers. It is considered one of the holiest places in Sikkim; local belief holds that even a glance at the sacred chorten washes away all sins.',
        history: 'Founded in 1641 by Ngadak Sempa Chempo, one of the three wise lamas who consecrated the first King of Sikkim at Yuksom.',
        establishedYear: '1641',
        architecture: 'Traditional stone masonry shrine surrounded by hundreds of carved mani stone slabs and ancient whitewashed stupas.',
        significance: 'Host of the world-famous Bumchu festival where the level of holy water in a sacred vase predicts the fortune of Sikkim for the coming year.',
        openingHours: '6:00 AM - 5:00 PM',
        visitingInformation: 'Requires a steep walk up stone steps from the road head. Dress respectfully.',
        bestTimeToVisit: 'February to March for the Bumchu Festival.',
        images: [
            { url: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1000&q=80', caption: 'Tashiding Hilltop Prayer Flags', isPrimary: true }
        ],
        rating: 4.9,
        reviewCount: 156,
        popularity: 89,
        tags: ['Nyingma', 'Spiritual', 'Festivals', 'Heritage'],
        categories: ['Nyingma', 'Heritage'],
        facilities: {
            parking: true,
            restrooms: true,
            guidedTours: true,
            giftShop: false,
            accessibility: false,
            audioGuide: true,
            offlineContent: false
        },
        virtualTourAvailable: true,
        bookingAvailable: false,
        isPublished: true
    },
    {
        name: 'Phodong Monastery',
        district: 'North Sikkim',
        address: 'Phodong, 38 km from Gangtok, North Sikkim 737116',
        latitude: 27.4201,
        longitude: 88.5833,
        shortDescription: 'Historic Karma Kagyu monastery celebrated for its vibrant mural paintings and annual masked dances.',
        description: 'Phodong Monastery is one of the six major monasteries of Sikkim. Located in North Sikkim, it holds rich collections of ancient murals, scriptures, and traditional thangkas maintained by over 260 resident monks.',
        history: 'Built in 1740 by the 4th Chogyal Gyurmed Namgyal, belonging to the Karma Kagyu lineage.',
        establishedYear: '1740',
        architecture: 'Rebuilt in the 20th century while retaining original wall fresco styles and ornate wooden pillars.',
        significance: 'Key cultural landmark in North Sikkim for the Karma Kagyu tradition.',
        openingHours: '7:00 AM - 5:00 PM',
        visitingInformation: 'Located on the Gangtok-Mangan highway. Easily accessible by road.',
        bestTimeToVisit: 'December for the annual Chaam dance festival.',
        images: [
            { url:'/images/phodong.jpg'}
        ],
        rating: 4.5,
        reviewCount: 98,
        popularity: 80,
        tags: ['Kagyu', 'Historical', 'Festivals'],
        categories: ['Kagyu', 'Heritage'],
        facilities: {
            parking: true,
            restrooms: true,
            guidedTours: false,
            giftShop: false,
            accessibility: false,
            audioGuide: false,
            offlineContent: false
        },
        virtualTourAvailable: false,
        bookingAvailable: false,
        isPublished: true
    },
    {
        name: 'Dubdi Monastery',
        district: 'West Sikkim',
        address: 'Yuksom, West Sikkim 737113',
        latitude: 27.3789,
        longitude: 88.2435,
        shortDescription: 'The oldest monastery in Sikkim, nestled in dense pine woods above the historic capital of Yuksom.',
        description: 'Dubdi Monastery, also known as "The Hermit\'s Cell", is recognized as the oldest surviving monastery in Sikkim. Reached via a scenic 45-minute nature trail through rhododendron and pine forests, it offers serene reflection.',
        history: 'Established in 1701 by Lhatsun Namkha Jigme during the reign of the first Chogyal, Phuntsog Namgyal.',
        establishedYear: '1701',
        architecture: 'Two-story stone structure with painted wooden trim, housing statues of three founding lamas and rare manuscript collections.',
        significance: 'Historic founding monastery of Sikkim, declared a Monument of National Importance by ASI.',
        openingHours: '7:00 AM - 4:00 PM',
        visitingInformation: 'Requires a uphill trek of about 2 km from Yuksom village.',
        bestTimeToVisit: 'March to May and October to November.',
        images: [
            { url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80', caption: 'Dubdi Monastic Path', isPrimary: true }
        ],
        rating: 4.7,
        reviewCount: 112,
        popularity: 85,
        tags: ['Nyingma', 'Heritage', 'Historical', 'Adventure', 'Peaceful'],
        categories: ['Nyingma', 'Heritage'],
        facilities: {
            parking: false,
            restrooms: true,
            guidedTours: false,
            giftShop: false,
            accessibility: false,
            audioGuide: true,
            offlineContent: true
        },
        virtualTourAvailable: false,
        bookingAvailable: false,
        isPublished: true
    },
    {
        name: 'Ralang Monastery',
        district: 'South Sikkim',
        address: 'Ralang, 13 km from Ravangla, South Sikkim 737139',
        latitude: 27.3111,
        longitude: 88.3512,
        shortDescription: 'Major Karma Kagyu monastery featuring both the historic site and the monumental Palchen Choeling Monastic Institute.',
        description: 'Ralang Monastery consists of two complexes: the original 18th-century monastery and the magnificent new Palchen Choeling Monastic Centre completed in 1995. It is famous for hosting the vibrant Pang Lhabsol and Kagyed Cham festivals.',
        history: 'Built to commemorate the successful pilgrimage of the 9th Karmapa, who threw grains of rice from Tibet which landed at Ralang.',
        establishedYear: '1768 / 1995',
        architecture: 'Expansive Tibetan monastic design featuring a grand courtyard for Cham dances and golden Buddha statues.',
        significance: 'One of the most active teaching centers for Karma Kagyu Buddhism in South Asia.',
        openingHours: '6:00 AM - 6:00 PM',
        visitingInformation: 'Located 13 km from Ravangla tourist hub. Taxis readily available.',
        bestTimeToVisit: 'August-September for Pang Lhabsol festival.',
        images: [
            { url:'/images/ralang.jpg' }
        ],
        rating: 4.8,
        reviewCount: 164,
        popularity: 87,
        tags: ['Kagyu', 'Architecture', 'Festivals', 'Peaceful'],
        categories: ['Kagyu', 'Active'],
        facilities: {
            parking: true,
            restrooms: true,
            guidedTours: true,
            giftShop: true,
            accessibility: true,
            audioGuide: false,
            offlineContent: false
        },
        virtualTourAvailable: true,
        bookingAvailable: true,
        isPublished: true
    },
    {
        name: 'Lingdum Monastery (Ranka)',
        district: 'East Sikkim',
        address: 'Ranka, 16 km from Gangtok, East Sikkim 737135',
        latitude: 27.3180,
        longitude: 88.5800,
        shortDescription: 'Modern architectural marvel of the Zurmang Kagyu tradition surrounded by lush forested hills.',
        description: 'Lingdum Monastery, also known as Ranka Monastery, is renowned for its cinematic beauty and grand courtyard. Featured in several films, it is an active monastery housing young novice monks pursuing Buddhist studies.',
        history: 'Completed in 1999 under the guidance of the 12th Zurmang Gharwang Rinpoche.',
        establishedYear: '1999',
        architecture: 'Contemporary Tibetan architecture showcasing exquisite wall paintings, carved parasols, and a towering statue of Lord Buddha.',
        significance: 'Headquarters of the Zurmang Kagyu lineage in India.',
        openingHours: '6:00 AM - 6:00 PM',
        visitingInformation: 'Spacious courtyard ideal for peaceful walking and photography.',
        bestTimeToVisit: 'Year-round. Early evening prayers offer deeply moving chanting.',
        images: [
  {
    url:'/images/lingdum.jpg'
  }
],
        rating: 4.8,
        reviewCount: 290,
        popularity: 94,
        tags: ['Kagyu', 'Architecture', 'Photography', 'Peaceful'],
        categories: ['Kagyu', 'Active'],
        facilities: {
            parking: true,
            restrooms: true,
            guidedTours: true,
            giftShop: true,
            accessibility: true,
            audioGuide: true,
            offlineContent: false
        },
        virtualTourAvailable: true,
        bookingAvailable: true,
        isPublished: true
    },
    {
        name: 'Lachen Monastery',
        district: 'North Sikkim',
        address: 'Lachen Village, North Sikkim 737120',
        latitude: 27.7167,
        longitude: 88.5500,
        shortDescription: 'High-altitude monastery serving as the spiritual heart of Lachen valley and gateway to Gurudongmar Lake.',
        description: 'Lachen Monastery (Ngodub Choling) stands quietly above Lachen village against snowy Himalayan peaks. It offers a authentic glimpse into high-altitude Tibetan Buddhist mountain life.',
        history: 'Established in 1858 by the Nyingma order to serve the migratory Lachenpa community.',
        establishedYear: '1858',
        architecture: 'Rustic wooden and stone structure decorated with prayer flags, mani wheels, and alpine wood carvings.',
        significance: 'Spiritual center for the Lachen valley community.',
        openingHours: '7:00 AM - 5:00 PM',
        visitingInformation: 'Inner Line Permit (ILP) required to visit North Sikkim.',
        bestTimeToVisit: 'April to June and October to November.',
        images: [
            { url: '/images/lachen.jpg'}
        ],
        rating: 4.6,
        reviewCount: 82,
        popularity: 81,
        tags: ['Nyingma', 'Adventure', 'Peaceful', 'Heritage'],
        categories: ['Nyingma', 'Heritage'],
        facilities: {
            parking: true,
            restrooms: true,
            guidedTours: false,
            giftShop: false,
            accessibility: false,
            audioGuide: false,
            offlineContent: true
        },
        virtualTourAvailable: false,
        bookingAvailable: false,
        isPublished: true
    },
    {
        name: 'Sanga Choeling Monastery',
        district: 'West Sikkim',
        address: 'Pelling Ridge, West Sikkim 737113',
        latitude: 27.2980,
        longitude: 88.2390,
        shortDescription: 'The "Island of Guiding Light", reached via a mountain ridge walk above Pelling.',
        description: 'Sanga Choeling Monastery is one of the oldest monasteries in Sikkim, constructed in 1697. Situated atop a hill opposite Pemayangtse, it is accessible via a pleasant 45-minute walk through forested trails.',
        history: 'Founded by Lhatsun Namkha Jigme in 1697.',
        establishedYear: '1697',
        architecture: 'Traditional stone construction with sacred clay statues dating back to the 17th century.',
        significance: 'Third oldest monastery in Sikkim, holding historic spiritual importance.',
        openingHours: '8:00 AM - 4:00 PM',
        visitingInformation: 'Uphill forest trail walk required from Pelling helipad area.',
        bestTimeToVisit: 'March to May and October to December.',
        images: [
            { url:'/images/sangaChoeling.jpg' }
        ],
        rating: 4.7,
        reviewCount: 94,
        popularity: 83,
        tags: ['Nyingma', 'Heritage', 'Peaceful', 'Adventure'],
        categories: ['Nyingma', 'Heritage'],
        facilities: {
            parking: false,
            restrooms: true,
            guidedTours: false,
            giftShop: false,
            accessibility: false,
            audioGuide: true,
            offlineContent: false
        },
        virtualTourAvailable: false,
        bookingAvailable: false,
        isPublished: true
    }
];

const seedDB = async () => {
    try {
        await connectDB();
        console.log('Seeding monastery dataset...');
        await Monastery.deleteMany({});
        const created = await Monastery.insertMany(seedMonasteries);
        console.log(`✅ Successfully seeded ${created.length} monasteries into MongoDB Atlas.`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
};

seedDB();
