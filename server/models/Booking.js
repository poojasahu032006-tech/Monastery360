const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User reference is required'],
        },
        event: {
            type: String,
            required: [true, 'Event ID is required'],
        },
        eventName: {
            type: String,
            required: [true, 'Event name is required'],
            trim: true,
        },
        eventDate: {
            type: String,
            required: [true, 'Event date is required'],
            trim: true,
        },
        location: {
            type: String,
            required: [true, 'Event location is required'],
            trim: true,
        },
        attendees: {
            type: Number,
            required: [true, 'Number of attendees is required'],
            min: [1, 'Must have at least 1 attendee'],
            default: 1,
        },
        phone: {
            type: String,
            trim: true,
            default: '',
        },
        message: {
            type: String,
            trim: true,
            default: '',
        },
        bookingId: {
            type: String,
            required: [true, 'Booking ID is required'],
            unique: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ['confirmed', 'cancelled'],
            default: 'confirmed',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Booking', bookingSchema);
