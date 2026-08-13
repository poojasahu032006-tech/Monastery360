const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');

// Helper to check if event date is in the past relative to today (Aug 12, 2026)
function isPastEvent(eventDateStr) {
    const d = eventDateStr.toLowerCase();
    let targetDate;
    if (d.includes('feb 12')) targetDate = new Date('2026-02-15T23:59:59'); // End date of Losar
    else if (d.includes('march 3')) targetDate = new Date('2026-03-03T23:59:59');
    else if (d.includes('sept 15')) targetDate = new Date('2026-09-15T23:59:59');
    else if (d.includes('dec 18')) targetDate = new Date('2026-12-19T23:59:59');
    else if (d.includes('nov 1')) targetDate = new Date('2026-11-01T23:59:59');
    else targetDate = new Date('2026-01-01T00:00:00');

    const today = new Date(); // In 2026 according to system time
    return targetDate < today;
}

// Generate unique booking ID: BKN-XXXXXX
function generateBookingId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `BKN-${result}`;
}

/**
 * @route   GET /api/bookings
 * @desc    Get logged-in user's bookings
 * @access  Private
 */
router.get('/', protect, async (req, res, next) => {
    try {
        const bookings = await Booking.find({ user: req.user.id });
        
        // Sort bookings by event date descending (newest/most future first)
        const getEventTime = (eventDateStr) => {
            const d = eventDateStr.toLowerCase();
            if (d.includes('feb 12')) return new Date('2026-02-12T00:00:00').getTime();
            if (d.includes('march 3')) return new Date('2026-03-03T00:00:00').getTime();
            if (d.includes('sept 15')) return new Date('2026-09-15T00:00:00').getTime();
            if (d.includes('nov 1')) return new Date('2026-11-01T00:00:00').getTime();
            if (d.includes('dec 18')) return new Date('2026-12-18T00:00:00').getTime();
            return 0;
        };

        bookings.sort((a, b) => getEventTime(b.eventDate) - getEventTime(a.eventDate));

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database connection failed. Unable to fetch bookings.' });
    }
});

/**
 * @route   GET /api/bookings/:id
 * @desc    Get single booking details
 * @access  Private
 */
router.get('/:id', protect, async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found.' });
        }

        // Verify ownership (unless admin)
        if (booking.user.toString() !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ success: false, message: 'You are not authorized to view this booking.' });
        }

        res.status(200).json({
            success: true,
            data: booking,
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ success: false, message: 'Booking not found.' });
        }
        res.status(500).json({ success: false, message: 'Database error while retrieving booking details.' });
    }
});

/**
 * @route   POST /api/bookings
 * @desc    Create a new event booking
 * @access  Private
 */
router.post('/', protect, async (req, res, next) => {
    try {
        const { event, eventName, eventDate, location, attendees, phone, message } = req.body;

        // Validation
        if (!event || !eventName || !eventDate || !location) {
            return res.status(400).json({ success: false, message: 'Please provide all required event details.' });
        }

        // Validate attendee count
        const attendeeNum = Number(attendees);
        if (isNaN(attendeeNum) || attendeeNum < 1) {
            return res.status(400).json({ success: false, message: 'Attendee count must be at least 1.' });
        }

        // Validate event ID (valid event IDs are 1 to 5)
        const validIds = ['1', '2', '3', '4', '5'];
        if (!validIds.includes(String(event))) {
            return res.status(400).json({ success: false, message: 'The event you are trying to book does not exist.' });
        }

        // Check for past event booking
        if (isPastEvent(eventDate)) {
            return res.status(400).json({ success: false, message: `The event '${eventName}' has already concluded and is no longer open for bookings.` });
        }

        // Check for duplicate booking
        const existingBooking = await Booking.findOne({
            user: req.user.id,
            event: String(event),
            status: 'confirmed',
        });

        if (existingBooking) {
            return res.status(400).json({ success: false, message: 'You have already booked this event. Duplicate bookings are not allowed.' });
        }

        // Create booking
        const booking = await Booking.create({
            user: req.user.id,
            event: String(event),
            eventName,
            eventDate,
            location,
            attendees: attendeeNum,
            phone: phone || '',
            message: message || '',
            bookingId: generateBookingId(),
            status: 'confirmed',
        });

        // Trigger Notification
        await Notification.create({
            user: req.user.id,
            title: 'Booking Confirmed 🎉',
            message: `Your booking (ID: ${booking.bookingId}) for '${eventName}' has been successfully confirmed for ${eventDate}.`,
            type: 'booking_success',
            relatedEvent: String(event),
            read: false,
        });

        res.status(201).json({
            success: true,
            data: booking,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database error. Booking could not be saved at this time.' });
    }
});

/**
 * @route   PATCH /api/bookings/:id/cancel
 * @desc    Cancel an event booking
 * @access  Private
 */
router.patch('/:id/cancel', protect, async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found.' });
        }

        // Verify ownership (unless admin)
        if (booking.user.toString() !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ success: false, message: 'You are not authorized to cancel this booking.' });
        }

        // Check if already cancelled
        if (booking.status === 'cancelled') {
            return res.status(400).json({ success: false, message: 'This booking has already been cancelled.' });
        }

        // Update status
        booking.status = 'cancelled';
        await booking.save();

        // Trigger notification
        await Notification.create({
            user: req.user.id,
            title: 'Booking Cancelled 🚫',
            message: `Your booking (ID: ${booking.bookingId}) for '${booking.eventName}' has been cancelled.`,
            type: 'booking_cancelled',
            relatedEvent: booking.event,
            read: false,
        });

        res.status(200).json({
            success: true,
            data: booking,
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ success: false, message: 'Booking not found.' });
        }
        res.status(500).json({ success: false, message: 'Database error. Cancellation failed.' });
    }
});

module.exports = router;
