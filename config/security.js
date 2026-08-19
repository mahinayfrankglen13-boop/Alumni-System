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
        defaultSrc: [],
        connectSrc: ["'self'", ...connectSrcUrls],
        scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
        styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
        workerSrc: ["'self'", "blob:"],
        objectSrc: [],
        imgSrc: imgSrcUrls,
        fontSrc: ["'self'", ...fontSrcUrls],
    },
});

module.exports = helmetConfig;
