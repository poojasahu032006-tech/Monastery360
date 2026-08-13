const express = require('express');
const router = express.Router();
const { getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.get('/profile', protect, getMe);
router.get('/me', protect, getMe);

// Stub – full implementation in later phases
router.get('/', (req, res) => res.json({ success: true, message: 'Users API – coming soon' }));

module.exports = router;
