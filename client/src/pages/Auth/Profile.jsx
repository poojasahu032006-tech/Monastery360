import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import { Button, Badge } from '../../components/UI/index';
import Loading from '../../components/UI/Loading';
import toast from 'react-hot-toast';
import '../pages.css';

const PREF_LABELS = {
    historical: 'Historical', spiritual: 'Spiritual', architecture: 'Architecture',
    photography: 'Photography', peaceful: 'Peaceful', festivals: 'Festivals',
    familyFriendly: 'Family Friendly', adventure: 'Adventure',
};

export default function Profile() {
    const { user: authUser, token, logout, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [profileUser, setProfileUser] = useState(authUser);
    const [fetching, setFetching] = useState(false);
    const [error, setError] = useState(null);

    const loadProfileData = useCallback(async () => {
        if (!token) return;
        setFetching(true);
        setError(null);
        try {
            const res = await authService.getMe(token);
            if (res && res.user) {
                setProfileUser(res.user);
            } else if (authUser) {
                setProfileUser(authUser);
            } else {
                setError('Unable to load profile');
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
            if (authUser) {
                setProfileUser(authUser);
            } else {
                setError(err.response?.data?.message || 'Unable to load profile');
            }
        } finally {
            setFetching(false);
        }
    }, [token, authUser]);

    useEffect(() => {
        if (authUser) {
            setProfileUser(authUser);
        } else if (token) {
            loadProfileData();
        }
    }, [authUser, token, loadProfileData]);

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/login');
    };

    // 1. Loading state
    if (authLoading || (fetching && !profileUser)) {
        return (
            <div className="page-placeholder" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Loading />
                <p style={{ color: 'var(--text-muted)', marginTop: '1rem', fontSize: '0.9375rem' }}>Loading profile...</p>
            </div>
        );
    }

    // 2. Unauthenticated state redirect
    if (!token && !authUser) {
        return <Navigate to="/login" replace />;
    }

    // 3. Loading failed state
    if (error && !profileUser) {
        return (
            <div className="page-placeholder" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div className="card" style={{ textAlign: 'center', padding: '2.5rem', border: '1px solid rgba(232,69,69,0.3)', background: 'rgba(232,69,69,0.05)', maxWidth: '450px', width: '100%' }}>
                    <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Unable to load profile</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>{error}</p>
                    <Button variant="primary" size="sm" onClick={loadProfileData}>
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    const currentUser = profileUser || authUser;

    const activePrefs = currentUser?.preferences
        ? Object.entries(currentUser.preferences).filter(([, v]) => v).map(([k]) => PREF_LABELS[k] ?? k)
        : [];

    return (
        <div className="page-placeholder">
            <div style={{ width: '100%', maxWidth: '520px', textAlign: 'left' }}>
                {/* Avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem' }}>
                    <div style={{
                        width: 72, height: 72, borderRadius: '50%',
                        background: 'linear-gradient(135deg,var(--color-primary-light),var(--color-primary))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-inverse)',
                    }}>
                        {currentUser?.name?.[0]?.toUpperCase() ?? 'U'}
                    </div>
                    <div>
                        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--text-primary)' }}>
                            {currentUser?.name}
                        </h1>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{currentUser?.email}</p>
                    </div>
                    <Badge variant="gold" style={{ marginLeft: 'auto' }}>{currentUser?.role ?? 'USER'}</Badge>
                </div>

                {/* Info card */}
                <div className="card" style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>
                        Account Details
                    </h2>
                    <dl style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        {[
                            ['Full Name', currentUser?.name ?? '–'],
                            ['Email Address', currentUser?.email ?? '–'],
                            ['Phone Number', currentUser?.phone || 'Not provided'],
                            ['Role / Account Type', currentUser?.role ?? 'USER'],
                            ['Member Since', currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : '–'],
                            ['Account Status', currentUser?.isActive !== false ? 'Active' : 'Inactive'],
                        ].map(([label, value]) => (
                            <div key={label}>
                                <dt style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: 2 }}>{label}</dt>
                                <dd style={{ fontSize: '0.9375rem', color: 'var(--text-primary)', fontWeight: 500 }}>{value}</dd>
                            </div>
                        ))}
                    </dl>
                </div>

                {/* Preferences */}
                {activePrefs.length > 0 && (
                    <div className="card" style={{ marginBottom: '1.5rem' }}>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>
                            Interests & Preferences
                        </h2>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {activePrefs.map((p) => <Badge key={p} variant="gold">{p}</Badge>)}
                        </div>
                    </div>
                )}

                {/* Actions Card */}
                <div className="card" style={{ border: '1px solid rgba(232,69,69,0.2)', background: 'rgba(232,69,69,0.05)', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '0.9375rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Account Actions</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        Sign out of your Monastery360 account on this device.
                    </p>
                    <Button id="profile-logout-btn" variant="danger" size="sm" onClick={handleLogout}>
                        Sign Out
                    </Button>
                </div>
            </div>
        </div>
    );
}
