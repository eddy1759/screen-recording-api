const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 5,
    message: 'Too many requests from this IP, please try again in an hour!',
});

module.exports = limiter;