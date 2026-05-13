const express    = require('express');
const router     = express.Router();
const loginLimiter = require("../middleware/limiter")
const controller = require('../controllers/AuthController');

router.post('/login', loginLimiter,   controller.login);
router.post('/register', controller.register);
router.post('/logout', controller.logout);

module.exports = router, loginLimiter;
