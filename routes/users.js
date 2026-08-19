const express = require('express');
const router = express.Router();
const users = require('../controllers/users');
const catchAsync = require('../utils/catchAsync');
const { validateRegister, validateLogin } = require('../middleware/user');
const {
    loginLimiter,
    forgotPasswordCodeLimiter,
    forgotPasswordResetLimiter
} = require('../middleware/rateLimiter');

router.route('/')
    .get(catchAsync(users.renderHome));

router.route('/login')
    .get(catchAsync(users.renderLogin))
    .post(loginLimiter, validateLogin, users.login);

router.route('/register')
    .post(validateRegister, catchAsync(users.register));

router.route('/logout')
    .post(users.logout);

router.post('/forgot-password/send-code', forgotPasswordCodeLimiter, catchAsync(users.sendResetCode));
router.post('/forgot-password/verify-code', forgotPasswordResetLimiter, catchAsync(users.verifyResetCode));
router.post('/forgot-password/reset', forgotPasswordResetLimiter, catchAsync(users.resetPassword));

module.exports = router;