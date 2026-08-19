const ExpressError = require('../utils/ExpressError');
const { registerSchema, loginSchema, profileSchema } = require('../validation/user');
const { cloudinary } = require('../cloudinary');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    next();
};

module.exports.validateRegister = (req, res, next) => {
    const { error } = registerSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports.validateLogin = (req, res, next) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports.validateProfile = async (req, res, next) => {
    const { error } = profileSchema.validate(req.body);
    if (error) {
        if (req.file && req.file.filename && req.file.filename !== 'defaul-prof_ryln3w') {
            await cloudinary.uploader.destroy(req.file.filename);
        }
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    throw new ExpressError('Forbidden', 403);
};