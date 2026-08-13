// Auto-generated placeholder pages for fallback sections
import React from 'react';
import {
    Landmark, Map, Flame, Compass, Search, Star, BookOpen,
    CalendarDays, PartyPopper, ConciergeBell, ClipboardList, Calendar as CalendarIcon,
    MessageSquare, Headphones, WifiOff, Handshake, Settings, AlertCircle, Sparkles
} from 'lucide-react';
import './pages.css';

const Placeholder = ({ icon: Icon, title, subtitle, tag }) => (
    <div className="page-placeholder animate-fade-in">
        <div className="page-placeholder-icon" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
            <Icon size={48} style={{ color: 'var(--color-primary)' }} />
        </div>
        <h1 className="page-placeholder-title">{title}</h1>
        <p className="page-placeholder-subtitle">{subtitle}</p>
        <span className="page-placeholder-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={12} /> {tag}
        </span>
    </div>
);

export const Explore = () => <Placeholder icon={Landmark} title="Explore Monasteries" subtitle="Browse Sikkim's monastery catalogue with filters, categories and ratings." tag="Monastery catalogue" />;
export const MapPage = () => <Placeholder icon={Map} title="Interactive Map" subtitle="Pin-based map view of all monasteries across Sikkim's four districts." tag="Map integration" />;
export const Crowd = () => <Placeholder icon={Flame} title="Crowd Heatmap" subtitle="Real-time visitor density overlaid on the map to help plan your visit." tag="Crowd analytics" />;
export const MonasteryDetail = () => <Placeholder icon={Landmark} title="Monastery Details" subtitle="Detailed page with photos, history, scores, facilities and nearby attractions." tag="Detail view" />;
export const VirtualTour = () => <Placeholder icon={Compass} title="Virtual Tour" subtitle="Immersive 360° virtual walkthroughs of monasteries from anywhere." tag="VR/tour" />;
export const SmartSearch = () => <Placeholder icon={Search} title="Smart Search" subtitle="AI-powered search to match your interests with the ideal monastery experiences." tag="AI search" />;
export const Recommendations = () => <Placeholder icon={Star} title="Recommendations" subtitle="Personalised monastery suggestions based on your preferences and visit history." tag="Recommendation engine" />;
export const TravelGuide = () => <Placeholder icon={BookOpen} title="Smart Travel Guide" subtitle="Route planning, best times to visit, and cultural etiquette guides." tag="Travel tools" />;
export const Calendar = () => <Placeholder icon={CalendarDays} title="Cultural Calendar" subtitle="Festival dates, sacred events, and special ceremonies across all monasteries." tag="Calendar" />;
export const Events = () => <Placeholder icon={PartyPopper} title="Events" subtitle="Upcoming events, workshops, and cultural programs at Sikkimese monasteries." tag="Events" />;
export const Services = () => <Placeholder icon={ConciergeBell} title="Services" subtitle="Transportation, accommodation, guided tours, and other visitor services." tag="Services" />;
export const Bookings = () => <Placeholder icon={ClipboardList} title="Booking" subtitle="Book guided tours, services, and experiences at monasteries." tag="Booking engine" />;
export const MyBookings = () => <Placeholder icon={CalendarIcon} title="My Bookings" subtitle="View and manage all your upcoming and past monastery bookings." tag="My bookings" />;
export const Reviews = () => <Placeholder icon={MessageSquare} title="Reviews" subtitle="Read and write authentic reviews shared by fellow monastery visitors." tag="Review system" />;
export const Archives = () => <Placeholder icon={Landmark} title="Digital Archives" subtitle="Curated historical documents, manuscripts, and cultural artefacts." tag="Archives" />;
export const AudioGuide = () => <Placeholder icon={Headphones} title="Audio Guide" subtitle="Narrated audio tours in multiple languages for each monastery." tag="Audio" />;
export const Offline = () => <Placeholder icon={WifiOff} title="Offline Content" subtitle="Download monastery data for use without internet in remote areas." tag="Offline mode" />;
export const Contribute = () => <Placeholder icon={Handshake} title="Contribute to Heritage" subtitle="Upload photos, share stories, and help digitise Sikkimese cultural heritage." tag="Community" />;
export const AdminDashboard = () => <Placeholder icon={Settings} title="Admin Dashboard" subtitle="Manage monasteries, users, events, and platform analytics." tag="Admin panel" />;
export const NotFound = () => <Placeholder icon={AlertCircle} title="Page Not Found" subtitle="The page you're looking for doesn't exist." tag="404" />;
