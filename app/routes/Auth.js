const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/AuthController');
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { error: "Trop de tentatives, réessayez dans 15 minutes." },
    standardHeaders: true,
    legacyHeaders: false,
});

router.post('/login', loginLimiter,   controller.login);
router.post('/register', controller.register);

module.exports = router;
