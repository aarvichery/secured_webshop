const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/AdminController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/dashboard', auth, admin, controller.getUsers);
router.get('/users', auth, admin, controller.getUsers);

module.exports = router;
