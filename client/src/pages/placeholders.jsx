// Auto-generated placeholder pages for all major sections
// Full implementations done in Parts 2–5

import React from 'react';
import './pages.css';

const Placeholder = ({ emoji, title, subtitle, tag }) => (
    <div className="page-placeholder animate-fade-in">
        <span className="page-placeholder-emoji">{emoji}</span>
        <h1 className="page-placeholder-title">{title}</h1>
        <p className="page-placeholder-subtitle">{subtitle}</p>
        <span className="page-placeholder-tag">🚧 {tag}</span>
    </div>
);

export const Explore = () => <Placeholder emoji="🏯" title="Explore Monasteries" subtitle="Browse Sikkim's monastery catalogue with filters, categories and ratings." tag="Part 2 – Monastery catalogue" />;
export const Map = () => <Placeholder emoji="🗺️" title="Interactive Map" subtitle="Pin-based map view of all monasteries across Sikkim's four districts." tag="Part 3 – Map integration" />;
export const Crowd = () => <Placeholder emoji="🔥" title="Crowd Heatmap" subtitle="Real-time visitor density overlaid on the map to help plan your visit." tag="Part 4 – Crowd analytics" />;
export const MonasteryDetail = () => <Placeholder emoji="📿" title="Monastery Details" subtitle="Detailed page with photos, history, scores, facilities and nearby attractions." tag="Part 2 – Detail view" />;
export const VirtualTour = () => <Placeholder emoji="🎭" title="Virtual Tour" subtitle="Immersive 360° virtual walkthroughs of monasteries from anywhere." tag="Part 4 – VR/tour" />;
export const SmartSearch = () => <Placeholder emoji="🔍" title="Smart Search" subtitle="AI-powered search to match your interests with the ideal monastery experiences." tag="Part 5 – AI search" />;
export const Recommendations = () => <Placeholder emoji="⭐" title="Recommendations" subtitle="Personalised monastery suggestions based on your preferences and visit history." tag="Part 5 – Recommendation engine" />;
export const TravelGuide = () => <Placeholder emoji="📖" title="Smart Travel Guide" subtitle="Route planning, best times to visit, and cultural etiquette guides." tag="Part 3 – Travel tools" />;
export const Calendar = () => <Placeholder emoji="📅" title="Cultural Calendar" subtitle="Festival dates, sacred events, and special ceremonies across all monasteries." tag="Part 3 – Calendar" />;
export const Events = () => <Placeholder emoji="🎉" title="Events" subtitle="Upcoming events, workshops, and cultural programs at Sikkimese monasteries." tag="Part 3 – Events" />;
export const Services = () => <Placeholder emoji="🛎️" title="Services" subtitle="Transportation, accommodation, guided tours, and other visitor services." tag="Part 3 – Services" />;
export const Bookings = () => <Placeholder emoji="📋" title="Booking" subtitle="Book guided tours, services, and experiences at monasteries." tag="Part 3 – Booking engine" />;
export const MyBookings = () => <Placeholder emoji="🗓️" title="My Bookings" subtitle="View and manage all your upcoming and past monastery bookings." tag="Part 3 – My bookings" />;
export const Reviews = () => <Placeholder emoji="💬" title="Reviews" subtitle="Read and write authentic reviews shared by fellow monastery visitors." tag="Part 4 – Review system" />;
export const Archives = () => <Placeholder emoji="🏛️" title="Digital Archives" subtitle="Curated historical documents, manuscripts, and cultural artefacts." tag="Part 5 – Archives" />;
export const AudioGuide = () => <Placeholder emoji="🎧" title="Audio Guide" subtitle="Narrated audio tours in multiple languages for each monastery." tag="Part 4 – Audio" />;
export const Offline = () => <Placeholder emoji="📶" title="Offline Content" subtitle="Download monastery data for use without internet in remote areas." tag="Part 5 – Offline mode" />;
export const Contribute = () => <Placeholder emoji="🤝" title="Contribute to Heritage" subtitle="Upload photos, share stories, and help digitise Sikkimese cultural heritage." tag="Part 5 – Community" />;
export const AdminDashboard = () => <Placeholder emoji="⚙️" title="Admin Dashboard" subtitle="Manage monasteries, users, events, and platform analytics." tag="Part 4 – Admin panel" />;
export const NotFound = () => <Placeholder emoji="🌫️" title="Page Not Found" subtitle="The page you're looking for doesn't exist." tag="404" />;
