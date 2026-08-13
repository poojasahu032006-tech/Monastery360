import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Input, Button } from '../../components/UI/index';
import toast from 'react-hot-toast';
import '../pages.css';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const [form, setForm] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    };

    const validate = () => {
        const errs = {};
        if (!form.email) errs.email = 'Email is required';
        if (!form.password) errs.password = 'Password is required';
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }

        setLoading(true);
        try {
            await login(form.email, form.password);
            toast.success('Welcome back!');
            navigate(from, { replace: true });
        } catch (err) {
            const msg = err.response?.data?.message || 'Login failed. Please try again.';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🏯</div>
                    <h1 className="auth-title">Welcome Back</h1>
                    <p className="auth-subtitle">Sign in to your Monastery360 account</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit} noValidate>
                    <Input
                        id="login-email"
                        label="Email Address"
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={handleChange}
                        error={errors.email}
                        autoComplete="email"
                    />
                    <Input
                        id="login-password"
                        label="Password"
                        type="password"
                        name="password"
                        placeholder="Your password"
                        value={form.password}
                        onChange={handleChange}
                        error={errors.password}
                        autoComplete="current-password"
                    />
                    <Button
                        id="login-submit-btn"
                        type="submit"
                        variant="primary"
                        size="md"
                        fullWidth
                        loading={loading}
                    >
                        Sign In
                    </Button>
                </form>

                <p className="auth-footer">
                    Don't have an account?{' '}
                    <Link to="/register" className="auth-link">Create one</Link>
                </p>
            </div>
        </div>
    );
}
