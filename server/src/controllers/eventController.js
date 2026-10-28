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
    const { category_id, title, description, venue, event_date } = req.body;
    
    const event = await Event.create({
      category_id,
      title,
      description,
      venue,
      event_date,
      created_by: req.user.user_id, // From the auth middleware
      status: 'published'
    });

    res.status(201).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating event' });
  }
};