const helmet = require('helmet');

const scriptSrcUrls = [
    "https://unpkg.com"
];

const styleSrcUrls = [
    "https://fonts.googleapis.com"
];

const connectSrcUrls = [];

const fontSrcUrls = [
    "https://fonts.gstatic.com"
];

const imgSrcUrls = [
    "'self'",
    "blob:",
    "data:",
    "https://res.cloudinary.com/"
];

const helmetConfig = helmet.contentSecurityPolicy({
    directives: {
        defaultSrc:     ["'self'"],
        baseUri:        ["'self'"],
        formAction:     ["'self'"],
        connectSrc:     ["'self'", ...connectSrcUrls],
        scriptSrc:      ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
        styleSrc:       ["'self'", "'unsafe-inline'", ...styleSrcUrls],
        workerSrc:      ["'self'", "blob:"],
        objectSrc:      ["'none'"],
        imgSrc:         imgSrcUrls,
        fontSrc:        ["'self'", ...fontSrcUrls],
        frameAncestors: ["'none'"],
    },
});

module.exports = helmetConfig;
