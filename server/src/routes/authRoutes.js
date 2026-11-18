const express = require('express');
const router = express.Router();
const { register, login, verify2FA, forgotPassword, resetPassword, updateProfile, requestDeletion, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/verify-2fa', verify2FA);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.put('/profile', protect, updateProfile);
router.post('/deletion-request', protect, requestDeletion);
router.get('/me', protect, getMe);

module.exports = router;