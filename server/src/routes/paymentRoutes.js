const express = require('express');
const router = express.Router();
const { initiatePayment, handleCallback } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware'); 

// Safaricom hits the callback, so it must be public
router.post('/callback', handleCallback); 

// Users must be logged in to initiate a payment (Notice the 'protect' here!)
router.post('/stkpush', protect, initiatePayment); 

module.exports = router;