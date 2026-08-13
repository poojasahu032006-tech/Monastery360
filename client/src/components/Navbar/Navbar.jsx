import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, User, LogOut, ChevronDown, Calendar } from 'lucide-react';
import NotificationBell from '../NotificationBell/NotificationBell';
import toast from 'react-hot-toast';
import './Navbar.css';

const NAV_LINKS = [
    { label: 'Home', to: '/' },
    { label: 'Explore', to: '/explore' },
    { label: 'Map', to: '/map' },
    { label: 'Events', to: '/events' },
    { label: 'Calendar', to: '/calendar' },
    { label: 'Services', to: '/services' },
    { label: 'Archives', to: '/archives' },
];

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        setProfileOpen(false);
        toast.success('Logged out successfully');
        navigate('/login');
    };

    return (
        <nav className="navbar" role="navigation" aria-label="Main navigation">
            <div className="navbar-inner container">
                {/* Logo */}
                <Link to="/" className="navbar-logo" aria-label="Monastery360 Home">
                    <span className="navbar-logo-icon">🏯</span>
                    <span className="navbar-logo-text">Monastery<span className="gradient-text">360</span></span>
                </Link>

                {/* Desktop Links */}
                <ul className="navbar-links" aria-label="Site navigation">
                    {NAV_LINKS.map((link) => (
                        <li key={link.to}>
                            <NavLink
                                to={link.to}
                                className={({ isActive }) => `navbar-link ${isActive ? 'navbar-link--active' : ''}`}
                            >
                                {link.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>

                {/* Auth section */}
                <div className="navbar-auth">
                    {isAuthenticated ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <NotificationBell />
                            <div className="navbar-profile" ref={dropdownRef}>
                                <button
                                    id="profile-menu-btn"
                                    className="navbar-profile-btn"
                                    onClick={() => setProfileOpen((prev) => !prev)}
                                    aria-expanded={profileOpen}
                                    aria-haspopup="menu"
                                    aria-label="User menu"
                                >
                                    <span className="navbar-avatar">{user?.name?.[0]?.toUpperCase() ?? 'U'}</span>
                                    <span className="navbar-username">{user?.name?.split(' ')[0]}</span>
                                    <ChevronDown size={14} className={`profile-chevron ${profileOpen ? 'open' : ''}`} />
                                </button>
                                {profileOpen && (
                                    <div className="navbar-dropdown" role="menu" aria-labelledby="profile-menu-btn">
                                        <Link to="/profile" className="dropdown-item" role="menuitem" onClick={() => setProfileOpen(false)}>
                                            <User size={14} /> Profile
                                        </Link>
                                        <Link to="/bookings" className="dropdown-item" role="menuitem" onClick={() => setProfileOpen(false)}>
                                            <Calendar size={14} /> My Bookings
                                        </Link>
                                        {user?.role === 'ADMIN' && (
                                            <Link to="/admin" className="dropdown-item" role="menuitem" onClick={() => setProfileOpen(false)}>
                                                Admin Dashboard
                                            </Link>
                                        )}
                                        <button className="dropdown-item dropdown-item--danger" role="menuitem" onClick={handleLogout}>
                                            <LogOut size={14} /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="navbar-cta">
                            <Link to="/login" className="btn-ghost-sm">Login</Link>
                            <Link to="/register" className="btn-primary-sm" id="nav-register-btn">Register</Link>
                        </div>
                    )}
                </div>

                {/* Mobile controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
                    {isAuthenticated && (
                        <div className="mobile-bell-wrapper">
                            <NotificationBell />
                        </div>
                    )}
                    <button
                        id="mobile-menu-btn"
                        className="navbar-hamburger"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-expanded={mobileOpen}
                        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                    >
                        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="navbar-mobile" role="dialog" aria-modal="true" aria-label="Mobile navigation">
                    <ul className="navbar-mobile-links">
                        {NAV_LINKS.map((link) => (
                            <li key={link.to}>
                                <NavLink
                                    to={link.to}
                                    className={({ isActive }) => `mobile-link ${isActive ? 'mobile-link--active' : ''}`}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {link.label}
                                </NavLink>
                            </li>
                        ))}
                        {isAuthenticated ? (
                            <>
                                <li><Link to="/profile" className="mobile-link" onClick={() => setMobileOpen(false)}>Profile</Link></li>
                                <li><Link to="/bookings" className="mobile-link" onClick={() => setMobileOpen(false)}>My Bookings</Link></li>
                                <li><button className="mobile-link mobile-link--danger" onClick={() => { handleLogout(); setMobileOpen(false); }}>Logout</button></li>
                            </>
                        ) : (
                            <>
                                <li><Link to="/login" className="mobile-link" onClick={() => setMobileOpen(false)}>Login</Link></li>
                                <li><Link to="/register" className="mobile-link mobile-link--primary" onClick={() => setMobileOpen(false)}>Register</Link></li>
                            </>
                        )}
                    </ul>
                </div>
            )}
        </nav>
    );
}

