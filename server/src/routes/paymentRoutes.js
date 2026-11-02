const express = require('express');
const router = express.Router();
const { initiatePayment, handleCallback } = require('../controllers/paymentController');

router.post('/stkpush', initiatePayment);
router.post('/callback', handleCallback);

module.exports = router;