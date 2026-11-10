const express = require('express');
const router = express.Router();

const {
  getDashboardStats,
  getSalesByEvent,
  getAllOrders,
  getAuditLogs
} = require('../controllers/adminController');

const {
  protect,
  adminOnly
} = require('../middleware/authMiddleware');

router.get('/dashboard', protect, adminOnly, getDashboardStats);

router.get('/sales-by-event', protect, adminOnly, getSalesByEvent);

router.get('/orders', protect, adminOnly, getAllOrders);

router.get('/audit-logs', protect, adminOnly, getAuditLogs);

module.exports = router;