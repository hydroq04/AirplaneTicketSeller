const express = require('express');
const { register, login, logout, getMe } = require('../auth/authController');
const { protect } = require('../auth/authMiddleWare');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);

module.exports = router;