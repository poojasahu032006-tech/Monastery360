import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Input, Button } from '../../components/UI/index';
import { LogoIcon } from '../../components/UI/Logo';
import toast from 'react-hot-toast';
import '../pages.css';

const PREFERENCE_OPTIONS = [
    { key: 'historical', label: 'Historical' },
    { key: 'spiritual', label: 'Spiritual' },
    { key: 'architecture', label: 'Architecture' },
    { key: 'photography', label: 'Photography' },
    { key: 'peaceful', label: 'Peaceful' },
    { key: 'festivals', label: 'Festivals' },
    { key: 'familyFriendly', label: 'Family Friendly' },
    { key: 'adventure', label: 'Adventure' },
];

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [prefs, setPrefs] = useState({});
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    };

    const togglePref = (key) => setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));

    const validate = () => {
        const errs = {};
        if (!form.name.trim()) errs.name = 'Name is required';
        if (!form.email) errs.email = 'Email is required';
        if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
        if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }

        setLoading(true);
        try {
            await register(form.name, form.email, form.password, prefs);
            toast.success('Account created! Welcome to Monastery360');
            navigate('/');
        } catch (err) {
            const msg = err.response?.data?.message || 'Registration failed.';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card" style={{ maxWidth: 500 }}>
                <div className="auth-header">
                    <div style={{ marginBottom: '0.75rem' }}>
                        <LogoIcon size={52} />
                    </div>
                    <h1 className="auth-title">Join Monastery360</h1>
                    <p className="auth-subtitle">Create your account to explore Sikkim's heritage</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit} noValidate>
                    <Input id="reg-name" label="Full Name" type="text" name="name" placeholder="Your full name" value={form.name} onChange={handleChange} error={errors.name} autoComplete="name" />
                    <Input id="reg-email" label="Email Address" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} error={errors.email} autoComplete="email" />
                    <Input id="reg-password" label="Password" type="password" name="password" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} error={errors.password} />
                    <Input id="reg-confirm" label="Confirm Password" type="password" name="confirmPassword" placeholder="Repeat your password" value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />

                    {/* Preferences */}
                    <div>
                        <p className="input-label" style={{ marginBottom: '0.75rem' }}>Your Interests (optional)</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {PREFERENCE_OPTIONS.map(({ key, label }) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => togglePref(key)}
                                    style={{
                                        padding: '6px 14px',
                                        borderRadius: 'var(--radius-full)',
                                        fontSize: '0.8125rem',
                                        fontWeight: 500,
                                        border: `1px solid ${prefs[key] ? 'var(--color-primary)' : 'var(--border-subtle)'}`,
                                        background: prefs[key] ? 'rgba(201,135,58,0.15)' : 'var(--bg-elevated)',
                                        color: prefs[key] ? 'var(--color-primary)' : 'var(--text-secondary)',
                                        cursor: 'pointer',
                                        transition: 'all var(--transition-fast)',
                                    }}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Button id="register-submit-btn" type="submit" variant="primary" size="md" fullWidth loading={loading}>
                        Create Account
                    </Button>
                </form>

                <p className="auth-footer">
                    Already have an account?{' '}
                    <Link to="/login" className="auth-link">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
