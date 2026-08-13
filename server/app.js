require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const errorHandler = require('./middleware/errorHandler');

// ─── Route imports ───────────────────────────────────────────────────────────
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const monasteryRoutes = require('./routes/monasteries');
const eventRoutes = require('./routes/events');
const serviceRoutes = require('./routes/services');
const bookingRoutes = require('./routes/bookings');
const notificationRoutes = require('./routes/notifications');
const reviewRoutes = require('./routes/reviews');
const archiveRoutes = require('./routes/archives');
const recommendationRoutes = require('./routes/recommendations');
const crowdRoutes = require('./routes/crowd');
const adminRoutes = require('./routes/admin');

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
}

// ─── Health check ─────────────────────────────────────────────────────────────

app.get('/api/health', (req, res) =>
    res.json({ success: true, message: 'MONASTERY360 API is running 🏯' })
);

// ─── Routes ───────────────────────────────────────────────────────────────────

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/monasteries', monasteryRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/archives', archiveRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/crowd', crowdRoutes);
app.use('/api/admin', adminRoutes);

// ─── 404 handler ─────────────────────────────────────────────────────────────

app.use((req, res) =>
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` })
);

// ─── Centralised error handler (must be last) ────────────────────────────────

app.use(errorHandler);

module.exports = app;
