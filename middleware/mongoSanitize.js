const mongoSanitize = require('express-mongo-sanitize');

// Prevent NoSQL Injection attacks by sanitizing keys starting with '$' or '.'
const sanitizeMongo = (req, res, next) => {
    if (req.body) mongoSanitize.sanitize(req.body, { replaceWith: '_' });
    if (req.params) mongoSanitize.sanitize(req.params, { replaceWith: '_' });
    next();
};

module.exports = sanitizeMongo;
