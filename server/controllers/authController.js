const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const User = require('../models/User');
const validate = require('../middleware/validate');

// ─── Helper ──────────────────────────────────────────────────────────────────

const signToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

const sendTokenResponse = (user, statusCode, res) => {
    const token = signToken(user._id);
    res.status(statusCode).json({
        success: true,
        token,
        user,
    });
};

// ─── Validation chains ───────────────────────────────────────────────────────

const registerValidation = [
    body('name').trim().notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be 2–50 characters'),
    body('email').isEmail().withMessage('Invalid email').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    validate,
];

const loginValidation = [
    body('email').isEmail().withMessage('Invalid email').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
    validate,
];

// ─── Controllers ─────────────────────────────────────────────────────────────

/**
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
    try {
        const { name, email, password, phone, preferences } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'Email already registered.' });
        }

        const user = await User.create({ name, email, password, phone, preferences });
        sendTokenResponse(user, 201, res);
    } catch (error) {
        next(error);
    }
};

/**
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        if (!user.isActive) {
            return res.status(403).json({ success: false, message: 'Account has been deactivated.' });
        }

        sendTokenResponse(user, 200, res);
    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/auth/me
 * @access  Protected
 */
const getMe = async (req, res, next) => {
    try {
        res.status(200).json({ success: true, user: req.user });
    } catch (error) {
        next(error);
    }
};

module.exports = { register, registerValidation, login, loginValidation, getMe };
