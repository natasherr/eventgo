const express = require('express');
const router = express.Router();
const { 
  getEvents, 
  getEventById, 
  createEvent, 
  getAdminEvents, 
  createTicketType 
} = require('../controllers/eventController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Admin route MUST be above /:id
router.get('/admin/list', protect, adminOnly, getAdminEvents);

router.get('/', getEvents);
router.get('/:id', getEventById);
router.post('/', protect, adminOnly, createEvent);
router.post('/:id/ticket-types', protect, adminOnly, createTicketType);

module.exports = router;