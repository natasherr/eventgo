const express = require('express');
const router = express.Router();
const { getDashboardStats, getSalesByEvent } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, adminOnly, getDashboardStats);
router.get('/sales-by-event', protect, adminOnly, getSalesByEvent);

module.exports = router;