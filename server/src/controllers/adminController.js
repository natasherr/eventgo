/**
 * adminController.js
 * Handles all admin-only API endpoints: dashboard stats, sales reports,
 * orders, audit logs, and user management.
 */

const {
  Order,
  Payment,
  Ticket,
  Event,
  User,
  TicketType,
  AuditLog
} = require('../models');

const { fn, col } = require('sequelize');
const { logAction } = require('../utils/auditLogger');

// @desc    Get dashboard stats and recent sales
// @route   GET /api/admin/dashboard
// @access  Admin
exports.getDashboardStats = async (req, res) => {
  try {
    // Sum only payments that completed successfully via M-Pesa
    const revenueData = await Payment.sum('amount', {
      where: { status: 'success' }
    });

    const totalRevenue = revenueData || 0;
    const totalTickets = await Ticket.count();
    const totalEvents  = await Event.count();

    // Fetch the 5 most recent paid orders for the dashboard feed
    const recentSales = await Order.findAll({
      where: { status: 'paid' },
      limit: 5,
      order: [['created_at', 'DESC']],
      include: [
        {
          model: Payment,
          attributes: ['amount', 'mpesa_receipt']
        }
      ]
    });

    res.status(200).json({
      stats: { totalRevenue, totalTickets, totalEvents },
      recentSales
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
};

// @desc    Get revenue and ticket totals grouped by event (for Reports page)
// @route   GET /api/admin/sales-by-event
// @access  Admin
exports.getSalesByEvent = async (req, res) => {
  try {
    // Join orders → ticket_types → events, aggregate per event
    const sales = await Order.findAll({
      where: { status: 'paid' },
      include: [
        {
          model: TicketType,
          attributes: [],
          include: [
            {
              model: Event,
              attributes: ['title']
            }
          ]
        }
      ],
      attributes: [
        [col('TicketType.Event.title'), 'eventName'],
        [fn('SUM', col('Order.total_amount')), 'totalRevenue'],
        [fn('SUM', col('Order.quantity')),     'ticketsSold']
      ],
      group: [
        'TicketType.Event.event_id',
        'TicketType.Event.title'
      ],
      raw: true
    });

    res.status(200).json(sales);

  } catch (error) {
    console.error('Sales report error:', error);
    res.status(500).json({ message: 'Error generating report' });
  }
};

// @desc    Get all orders with user, ticket type, event, and payment details
// @route   GET /api/admin/orders
// @access  Admin
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: User,
          attributes: ['user_id', 'full_name', 'email']
        },
        {
          model: TicketType,
          attributes: ['ticket_type_id', 'name', 'price'],
          include: [
            {
              model: Event,
              attributes: ['event_id', 'title']
            }
          ]
        },
        {
          model: Payment,
          attributes: ['payment_id', 'amount', 'status', 'mpesa_receipt', 'paid_at']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error('Admin orders error:', error);
    res.status(500).json({ message: 'Unable to fetch orders.' });
  }
};

// @desc    Get recent security audit logs (most recent 100)
// @route   GET /api/admin/audit-logs
// @access  Admin
exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.findAll({
      include: [
        {
          model: User,
          attributes: ['user_id', 'full_name', 'email']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: 100
    });

    res.status(200).json(logs);
  } catch (error) {
    console.error('Audit logs error:', error);
    res.status(500).json({ message: 'Unable to fetch security activity.' });
  }
};

// @desc    Get all registered users
// @route   GET /api/admin/users
// @access  Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      // Exclude sensitive fields like password_hash
      attributes: ['user_id', 'full_name', 'email', 'phone_number', 'role', 'is_active', 'deletion_requested', 'created_at', 'last_login'],
      order: [['created_at', 'DESC']]
    });
    res.status(200).json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Unable to fetch users.' });
  }
};

// @desc    Update a user's role, active status, or deletion request flag
// @route   PUT /api/admin/users/:id
// @access  Admin
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { role, is_active, deletion_requested } = req.body;

    // Only super_admin can promote to super_admin or supervisor
    if ((role === 'super_admin' || role === 'supervisor') && req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Only a super admin can assign elevated roles.' });
    }

    // Apply only the fields that were actually sent in the request body
    if (role !== undefined)               user.role               = role;
    if (is_active !== undefined)          user.is_active          = is_active;
    if (deletion_requested !== undefined) user.deletion_requested = deletion_requested;
    await user.save();

    await logAction(
      req.user.user_id,
      'USER_UPDATED',
      'User',
      user.user_id,
      `Role set to ${user.role}, active: ${user.is_active}`,
      req.ip
    );

    res.status(200).json({
      user_id:            user.user_id,
      full_name:          user.full_name,
      email:              user.email,
      role:               user.role,
      is_active:          user.is_active,
      deletion_requested: user.deletion_requested
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Unable to update user.' });
  }
};
