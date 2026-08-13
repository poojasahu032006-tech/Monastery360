const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');

/**
 * @route   GET /api/notifications
 * @desc    Get user notifications
 * @access  Private
 */
router.get('/', protect, async (req, res, next) => {
    try {
        const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: notifications.length,
            data: notifications,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database error while retrieving notifications.' });
    }
});

/**
 * @route   PATCH /api/notifications/read-all
 * @desc    Mark all user notifications as read
 * @access  Private
 */
router.patch('/read-all', protect, async (req, res, next) => {
    try {
        await Notification.updateMany({ user: req.user.id, read: false }, { read: true });
        res.status(200).json({
            success: true,
            message: 'All notifications marked as read.',
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update notifications.' });
    }
});

/**
 * @route   PATCH /api/notifications/:id/read
 * @desc    Mark single notification as read
 * @access  Private
 */
router.patch('/:id/read', protect, async (req, res, next) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found.' });
        }

        // Verify ownership
        if (notification.user.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'You are not authorized to view this notification.' });
        }

        notification.read = true;
        await notification.save();

        res.status(200).json({
            success: true,
            data: notification,
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ success: false, message: 'Notification not found.' });
        }
        res.status(500).json({ success: false, message: 'Failed to update notification.' });
    }
});

module.exports = router;
