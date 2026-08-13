const mongoose = require('mongoose');

const monasterySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Monastery name is required'],
            trim: true,
        },
        district: {
            type: String,
            required: [true, 'District is required'],
            trim: true,
            enum: ['East Sikkim', 'West Sikkim', 'North Sikkim', 'South Sikkim', 'Pakyong', 'Soreng'],
            default: 'East Sikkim',
        },
        address: {
            type: String,
            trim: true,
            default: '',
        },
        location: {
            district: { type: String },
            address: { type: String },
            state: { type: String, default: 'Sikkim' },
        },
        latitude: {
            type: Number,
            default: null,
        },
        longitude: {
            type: Number,
            default: null,
        },
        coordinates: {
            latitude: { type: Number },
            longitude: { type: Number },
        },
        shortDescription: {
            type: String,
            trim: true,
            default: '',
        },
        description: {
            type: String,
            trim: true,
            default: '',
        },
        history: {
            type: String,
            trim: true,
            default: '',
        },
        establishedYear: {
            type: String,
            trim: true,
            default: '',
        },
        architecture: {
            type: String,
            trim: true,
            default: '',
        },
        significance: {
            type: String,
            trim: true,
            default: '',
        },
        openingHours: {
            type: String,
            trim: true,
            default: '6:00 AM - 6:00 PM',
        },
        visitingInformation: {
            type: String,
            trim: true,
            default: 'Visitors are requested to remove footwear inside prayer halls and maintain quiet decorum.',
        },
        bestTimeToVisit: {
            type: String,
            trim: true,
            default: 'March to June, September to December',
        },
        images: [
            {
                url: { type: String },
                caption: { type: String, default: '' },
                isPrimary: { type: Boolean, default: false },
            },
        ],
        rating: {
            type: Number,
            default: 4.5,
            min: 0,
            max: 5,
        },
        reviewCount: {
            type: Number,
            default: 0,
        },
        popularity: {
            type: Number,
            default: 80,
        },
        tags: {
            type: [String],
            default: [],
        },
        categories: {
            type: [String],
            default: [],
        },
        facilities: {
            parking: { type: Boolean, default: true },
            restrooms: { type: Boolean, default: true },
            guidedTours: { type: Boolean, default: false },
            giftShop: { type: Boolean, default: false },
            accessibility: { type: Boolean, default: false },
            audioGuide: { type: Boolean, default: false },
            offlineContent: { type: Boolean, default: false },
        },
        virtualTourAvailable: {
            type: Boolean,
            default: false,
        },
        bookingAvailable: {
            type: Boolean,
            default: false,
        },
        isPublished: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

monasterySchema.index({ name: 'text', district: 'text', tags: 'text', description: 'text' });

module.exports = mongoose.model('Monastery', monasterySchema);
