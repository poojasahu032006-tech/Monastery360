import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../UI/Logo';
import './Footer.css';

const FOOTER_LINKS = {
    Explore: [
        { label: 'Monasteries', to: '/explore' },
        { label: 'Interactive Map', to: '/map' },
        { label: 'Crowd Heatmap', to: '/crowd' },
        { label: 'Virtual Tour', to: '/virtual-tour' },
        { label: 'Smart Search', to: '/search' },
    ],
    Plan: [
        { label: 'Travel Guide', to: '/travel-guide' },
        { label: 'Cultural Calendar', to: '/calendar' },
        { label: 'Events', to: '/events' },
        { label: 'Services', to: '/services' },
        { label: 'Bookings', to: '/bookings' },
    ],
    Engage: [
        { label: 'Reviews', to: '/reviews' },
        { label: 'Digital Archives', to: '/archives' },
        { label: 'Audio Guide', to: '/audio' },
        { label: 'Offline Content', to: '/offline' },
        { label: 'Contribute', to: '/contribute' },
    ],
};

export default function Footer() {
    return (
        <footer className="footer" role="contentinfo">
            <div className="footer-inner container">
                <div className="footer-brand">
                    <div style={{ marginBottom: '1rem' }}>
                        <Logo size="md" />
                    </div>
                    <p className="footer-tagline">
                        Digitize, Explore and Preserve<br />
                        Sikkim's Monastery Heritage
                    </p>
                    <p className="footer-badge">Smart Heritage Initiative</p>
                </div>

                {Object.entries(FOOTER_LINKS).map(([section, links]) => (
                    <div className="footer-section" key={section}>
                        <h3 className="footer-section-title">{section}</h3>
                        <ul className="footer-list">
                            {links.map((link) => (
                                <li key={link.to}>
                                    <Link to={link.to} className="footer-link">{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="footer-bottom">
                <div className="container footer-bottom-inner">
                    <p className="footer-copy">© {new Date().getFullYear()} Monastery360. Built for SIH.</p>
                    <div className="footer-bottom-links">
                        <Link to="/privacy" className="footer-link-sm">Privacy</Link>
                        <Link to="/terms" className="footer-link-sm">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
