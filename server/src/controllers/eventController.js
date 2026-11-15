/**
 * eventController.js
 * Handles public and admin event endpoints: browsing, detail view,
 * event creation/editing/deletion, and ticket type management.
 * Public routes return only 'published' events; admin routes return all statuses.
 */


const { Op } = require('sequelize');
const { Event, Category, TicketType, User } = require('../models');

// @desc    Get all published events (with search & filter)
// @route   GET /api/events
exports.getEvents = async (req, res) => {
  try {
    const { search, category } = req.query;
    let whereClause = { status: 'published' };

    if (search) {
      whereClause.title = { [Op.like]: `%${search}%` };
    }

    const events = await Event.findAll({
      where: whereClause,
      include: [
        { model: Category, where: category ? { name: category } : {} },
        { model: TicketType, attributes: ['ticket_type_id', 'name', 'price', 'quantity_total'] }
      ],
      order: [['event_date', 'ASC']]
    });

    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching events' });
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: [
        { model: Category, attributes: ['name'] },
        { model: TicketType },
        { model: User, attributes: ['full_name'] } // The creator
      ]
    });

    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create an event (Admin only)
// @route   POST /api/events
exports.createEvent = async (req, res) => {
  try {
    const { category_id, title, description, venue, event_date, banner_image } = req.body;
    
    const event = await Event.create({
      category_id,
      title,
      description,
      venue,
      event_date,
      banner_image: banner_image || null,
      created_by: req.user.user_id, // From the auth middleware
      status: 'published'
    });

    res.status(201).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating event' });
  }
};

// ==========================================
// NEW ADMIN FUNCTIONS BELOW
// ==========================================

// @desc    Get all events for admin (includes drafts/cancelled)
// @route   GET /api/events/admin/list
exports.getAdminEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      include: [
        { model: Category, attributes: ['name'] },
        { model: TicketType }
      ],
      order: [['created_at', 'DESC']] // Newest events first
    });
    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching admin events' });
  }
};

// @desc    Create a ticket type for an event
// @route   POST /api/events/:id/ticket-types
exports.createTicketType = async (req, res) => {
  try {
    const { name, price, quantity_total } = req.body;
    const event_id = req.params.id;

    // Check if event exists
    const event = await Event.findByPk(event_id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const ticketType = await TicketType.create({
      event_id,
      name,
      price,
      quantity_total
    });

    res.status(201).json(ticketType);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating ticket type' });
  }
};

// @desc    Update an event (Admin only)
// @route   PUT /api/events/:id
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const { category_id, title, description, venue, event_date, banner_image, status } = req.body;

    await event.update({
      category_id: category_id ?? event.category_id,
      title: title ?? event.title,
      description: description ?? event.description,
      venue: venue ?? event.venue,
      event_date: event_date ?? event.event_date,
      banner_image: banner_image ?? event.banner_image,
      status: status ?? event.status,
    });

    res.status(200).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating event' });
  }
};

// @desc    Delete an event (Admin only)
// @route   DELETE /api/events/:id
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    await event.destroy();
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error(error);
    // Foreign key constraint: event has ticket types, orders or payments linked
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(409).json({
        message: 'Cannot delete this event because it has ticket types, orders or payments linked to it. Cancel the event instead.'
      });
    }
    res.status(500).json({ message: 'Server error deleting event' });
  }
};