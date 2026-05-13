const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 tentatives max
    message: { error: "Trop de tentatives, réessayez dans 15 minutes." }
});

module.exports = loginLimiter;