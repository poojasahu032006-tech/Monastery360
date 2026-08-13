import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/UI/Loading';

export default function ProtectedRoute({ children, requiredRole }) {
    const { isAuthenticated, loading, user } = useAuth();
    const location = useLocation();

    if (loading) return <Loading fullScreen />;

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requiredRole && user?.role !== requiredRole) {
        return <Navigate to="/" replace />;
    }

    return children;
}
