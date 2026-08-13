import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Loading from './components/UI/Loading';

// Pages
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Profile from './pages/Auth/Profile';
import Explore from './pages/Explore/Explore';
import Map from './pages/Map/Map';
import Events from './pages/Events/Events';
import Calendar from './pages/Calendar/Calendar';
import Services from './pages/Services/Services';
import Archives from './pages/Archives/Archives';

import MonasteryDetail from './pages/Explore/MonasteryDetail';
import MyBookings from './pages/Bookings/MyBookings';
import SmartSearch from './pages/SmartSearch/SmartSearch';
import CrowdHeatmap from './pages/Crowd/CrowdHeatmap';
import {
    VirtualTour,
    Recommendations, TravelGuide,
    Bookings, Reviews,
    AudioGuide, Offline, Contribute, AdminDashboard,
    NotFound,
} from './pages/placeholders';

export default function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <MainLayout>
                <Suspense fallback={<Loading fullScreen />}>
                    <Routes>
                        {/* Public */}
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Exploration */}
                        <Route path="/explore" element={<Explore />} />
                        <Route path="/explore/:id" element={<MonasteryDetail />} />
                        <Route path="/map" element={<Map />} />
                        <Route path="/crowd" element={<CrowdHeatmap />} />
                        <Route path="/virtual-tour" element={<VirtualTour />} />
                        <Route path="/search" element={<SmartSearch />} />
                        <Route path="/travel-guide" element={<TravelGuide />} />

                        {/* Events & Calendar */}
                        <Route path="/calendar" element={<Calendar />} />
                        <Route path="/events" element={<Events />} />

                        {/* Services */}
                        <Route path="/services" element={<Services />} />
                        <Route path="/audio" element={<AudioGuide />} />
                        <Route path="/archives" element={<Archives />} />
                        <Route path="/offline" element={<Offline />} />

                        {/* Protected – logged in */}
                        <Route path="/bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
                        <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
                        <Route path="/reviews" element={<ProtectedRoute><Reviews /></ProtectedRoute>} />
                        <Route path="/recommendations" element={<ProtectedRoute><Recommendations /></ProtectedRoute>} />
                        <Route path="/contribute" element={<ProtectedRoute><Contribute /></ProtectedRoute>} />
                        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

                        {/* Admin only */}
                        <Route path="/admin" element={<ProtectedRoute requiredRole="ADMIN"><AdminDashboard /></ProtectedRoute>} />

                        {/* 404 */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Suspense>
            </MainLayout>
        </AuthProvider>
    </ThemeProvider>
    );
}
