import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('m360_token'));
    const [loading, setLoading] = useState(true);

    const logout = useCallback(() => {
        localStorage.removeItem('m360_token');
        sessionStorage.removeItem('m360_token');
        setToken(null);
        setUser(null);
    }, []);

    // Verify token and load current user on mount / token change
    useEffect(() => {
        const loadUser = async () => {
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }
            try {
                const res = await authService.getMe(token);
                if (res && res.user) {
                    setUser(res.user);
                } else {
                    logout();
                }
            } catch (err) {
                console.error('Auth verification failed:', err);
                logout();
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, [token, logout]);

    const refreshUser = async () => {
        if (!token) return null;
        try {
            const res = await authService.getMe(token);
            if (res && res.user) {
                setUser(res.user);
                return res.user;
            }
        } catch (err) {
            console.error('Failed to refresh user profile:', err);
        }
        return null;
    };

    const login = async (email, password) => {
        const res = await authService.login({ email, password });
        localStorage.setItem('m360_token', res.token);
        setToken(res.token);
        setUser(res.user);
        return res;
    };

    const register = async (name, email, password, preferences = {}) => {
        const res = await authService.register({ name, email, password, preferences });
        localStorage.setItem('m360_token', res.token);
        setToken(res.token);
        setUser(res.user);
        return res;
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, register, refreshUser, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};

export default AuthContext;
