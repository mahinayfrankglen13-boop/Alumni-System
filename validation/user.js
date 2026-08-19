const Joi = require('../utils/joiSanitize');
const mongoose = require('mongoose');

const registerSchema = Joi.object({
    email: Joi.string()
        .email()
        .escapeHTML()
        .required(),

    password: Joi.string()
        .min(8)
        .required(),

    fullName: Joi.string()
        .escapeHTML()
        .trim()
        .required(),

    alumniId: Joi.number()
        .required(),

    course: Joi.string()
        .escapeHTML()
        .custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) {
                return helpers.error('any.invalid');
            }

            return value;
        })
        .required(),

    graduationYear: Joi.number()
        .required()
});

const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .escapeHTML()
        .required(),

    password: Joi.string()
        .required()
});

const profileSchema = Joi.object({
    fullName: Joi.string().escapeHTML().trim().required(),
    email: Joi.string().email().escapeHTML().required(),
    graduationYear: Joi.number().required(),
    bio: Joi.string().escapeHTML().trim().allow(''),
    profileVisibility: Joi.string().escapeHTML().valid('public', 'private').optional()
}).unknown(true);

module.exports = {
    registerSchema,
    loginSchema,
    profileSchema
};