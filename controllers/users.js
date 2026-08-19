const passport = require('passport');
const User = require('../models/user');
const Course = require('../models/course');
const Job = require('../models/job');
const Announcement = require('../models/announcement');
const { sendResetCodeEmail } = require('../utils/mailer');

module.exports.renderHome = async (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/alumni/dashboard');
    }

    const courses = await Course.find({}).limit(6);
    const alumniCount = await User.countDocuments({ role: 'alumni', status: 'approved' });
    const jobsCount = await Job.countDocuments({ status: 'approved' });
    const announcementsCount = await Announcement.countDocuments({});

    res.render('users/home', {
        courses,
        stats: {
            alumni: alumniCount || 120,
            jobs: jobsCount || 45,
            announcements: announcementsCount || 18
        }
    });
};

module.exports.renderLogin = async (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/alumni/dashboard');
    }
    const courses = await Course.find({});
    res.render('users/login', { courses, errorMsg: null, successMsg: null });
};

module.exports.register = async (req, res, next) => {
    try {
        const { email, password, fullName, alumniId, course, graduationYear } = req.body;

        const user = new User({
            email,
            fullName,
            alumniId,
            course,
            graduationYear,
            status: 'pending'
        });

        await User.register(user, password);

        const courses = await Course.find({});
        res.render('users/login', {
            courses,
            errorMsg: null,
            successMsg: 'Registration successful! Your account is pending administrator approval. You can log in once an administrator approves your account.'
        });
    } catch (e) {
        const courses = await Course.find({});
        res.render('users/login', { courses, errorMsg: e.message, successMsg: null });
    }
};

module.exports.login = (req, res, next) => {
    if (req.body.email) {
        req.body.email = req.body.email.toLowerCase().trim();
    }
    passport.authenticate('local', async (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            const courses = await Course.find({});
            return res.render('users/login', {
                courses,
                errorMsg: 'Incorrect email or password. Please try again.',
                successMsg: null
            });
        }

        // Prevent pending accounts from logging in
        if (user.role !== 'admin' && user.status === 'pending') {
            const courses = await Course.find({});
            return res.render('users/login', {
                courses,
                errorMsg: 'Your account registration is still pending administrator approval. Please wait for approval before logging in.',
                successMsg: null
            });
        }

        // Prevent rejected accounts from logging in
        if (user.role !== 'admin' && user.status === 'rejected') {
            const courses = await Course.find({});
            return res.render('users/login', {
                courses,
                errorMsg: 'Your account registration request was rejected by an administrator.',
                successMsg: null
            });
        }

        req.login(user, err => {
            if (err) return next(err);
            req.session.save(() => {
                res.redirect('/alumni/dashboard');
            });
        });
    })(req, res, next);
};

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) return next(err);
        res.redirect('/login');
    });
};

module.exports.sendResetCode = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ success: false, message: 'Email address is required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
        return res.status(400).json({ success: false, message: 'No account registered with this email address.' });
    }

    // Generate random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetPasswordCode = code;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // Expiration in 15 mins
    await user.save();

    try {
        await sendResetCodeEmail(user.email, code);
        return res.json({ success: true, message: 'Verification code sent to your email.' });
    } catch (err) {
        // Detailed error logged to server console only (for admin/developer debugging)
        console.error('Email send error:', err);

        // Secure, generic user-facing message to prevent information disclosure
        return res.status(500).json({
            success: false,
            message: 'Unable to send verification code at this time. Please try again later or contact support.'
        });
    }
};

module.exports.verifyResetCode = async (req, res) => {
    const { email, code } = req.body;
    if (!email || !code) {
        return res.status(400).json({ success: false, message: 'Email and verification code are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanCode = code.trim();

    const user = await User.findOne({
        email: cleanEmail,
        resetPasswordCode: cleanCode,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid or expired verification code.' });
    }

    return res.json({ success: true, message: 'Verification code verified successfully.' });
};

module.exports.resetPassword = async (req, res) => {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    if (newPassword.length < 8) {
        return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanCode = code.trim();

    const user = await User.findOne({
        email: cleanEmail,
        resetPasswordCode: cleanCode,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(400).json({ success: false, message: 'Session expired or invalid code. Please request a new code.' });
    }

    // Set new password using passport-local-mongoose method
    await user.setPassword(newPassword);

    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.json({ success: true, message: 'Password reset successfully! You can now log in.' });
};

