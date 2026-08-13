const express = require('express');
const router = express.Router();
const { protect, authorise } = require('../middleware/auth');

// Stub – admin routes protected in later phases
router.get('/', protect, authorise('ADMIN'), (req, res) =>
    res.json({ success: true, message: 'Admin API – coming soon' })
);

module.exports = router;
