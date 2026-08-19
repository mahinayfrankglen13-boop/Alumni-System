const rateLimit = require('express-rate-limit');

// Global Rate Limiter: Max 50 requests per 15 minutes per IP
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP address. Please try again after 15 minutes.'
});

// Login Limiter: Max 3 failed/login attempts per 15 minutes per IP
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 3,
    standardHeaders: true,
    legacyHeaders: false,
    handler: async (req, res) => {
        const Course = require('../models/course');
        const courses = await Course.find({});
        return res.status(429).render('users/login', {
            courses,
            errorMsg: 'Too many login attempts from this IP. Please try again after 15 minutes.',
            successMsg: null
        });
    }
});

// Verification Code Request Limiter: Max 3 requests per 15 minutes per IP
const forgotPasswordCodeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 3,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        return res.status(429).json({
            success: false,
            message: 'Too many verification code requests. Please wait 15 minutes before trying again.'
        });
    }
});

// Verification / Password Reset Attempt Limiter: Max 3 attempts per 15 minutes per IP
const forgotPasswordResetLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 3,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        return res.status(429).json({
            success: false,
            message: 'Too many reset attempts. Please wait 15 minutes before trying again.'
        });
    }
});

module.exports = {
    globalLimiter,
    loginLimiter,
    forgotPasswordCodeLimiter,
    forgotPasswordResetLimiter
};
