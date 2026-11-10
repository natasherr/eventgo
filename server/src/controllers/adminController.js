const {
Order,
Payment,
Ticket,
Event,
User,
TicketType
} = require('../models');

const { fn, col } = require('sequelize');

// @desc Get dashboard stats and recent sales
// @route GET /api/admin/dashboard
// @access Admin
exports.getDashboardStats = async (req, res) => {
try {
const revenueData = await Payment.sum('amount', {
where: { status: 'success' }
});

```
const totalRevenue = revenueData || 0;
const totalTickets = await Ticket.count();
const totalEvents = await Event.count();

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
  stats: {
    totalRevenue,
    totalTickets,
    totalEvents
  },
  recentSales
});
```

} catch (error) {
console.error('Dashboard stats error:', error);
res.status(500).json({
message: 'Error fetching dashboard stats'
});
}
};

// @desc Get sales grouped by event
// @route GET /api/admin/sales-by-event
// @access Admin
exports.getSalesByEvent = async (req, res) => {
try {
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
[fn('SUM', col('Order.quantity')), 'ticketsSold']
],
group: [
'TicketType.Event.event_id',
'TicketType.Event.title'
],
raw: true
});

```
res.status(200).json(sales);
```

} catch (error) {
console.error('Sales report error:', error);
res.status(500).json({
message: 'Error generating report'
});
}
};

// @desc Get all orders for the admin dashboard
// @route GET /api/admin/orders
// @access Admin
exports.getAllOrders = async (req, res) => {
  try {
    console.log('Fetching admin orders...');

    const orders = await Order.findAll({
      order: [['created_at', 'DESC']]
    });

    console.log(`Fetched ${orders.length} orders`);

    res.status(200).json(orders);
  } catch (error) {
    console.error('Admin orders error:', error);

    res.status(500).json({
      message: 'Unable to fetch orders.',
      error: error.message
    });
  }
};