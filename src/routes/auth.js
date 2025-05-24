const express = require('express');
const { register, login, logout, getMe } = require('../features/auth/authController');
const { protect } = require('../features/auth/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);

module.exports = router;
