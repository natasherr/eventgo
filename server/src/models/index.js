const sequelize = require('../config/db');

const User = require('./User');
const Category = require('./Category');
const Event = require('./Event');
const TicketType = require('./TicketType');
const Order = require('./Order');
const Payment = require('./Payment');
const Ticket = require('./Ticket');
const AuthToken = require('./AuthToken');
const AuditLog = require('./AuditLog');

// --- Relationships ---

// Events
Category.hasMany(Event, { foreignKey: 'category_id' });
Event.belongsTo(Category, { foreignKey: 'category_id' });

User.hasMany(Event, { foreignKey: 'created_by' });
Event.belongsTo(User, { foreignKey: 'created_by' });

Event.hasMany(TicketType, { foreignKey: 'event_id' });
TicketType.belongsTo(Event, { foreignKey: 'event_id' });

// Orders
User.hasMany(Order, { foreignKey: 'user_id' });
Order.belongsTo(User, { foreignKey: 'user_id' });

TicketType.hasMany(Order, { foreignKey: 'ticket_type_id' });
Order.belongsTo(TicketType, { foreignKey: 'ticket_type_id' });

// Payments & Tickets
Order.hasMany(Payment, { foreignKey: 'order_id' });
Payment.belongsTo(Order, { foreignKey: 'order_id' });

Order.hasMany(Ticket, { foreignKey: 'order_id' });
Ticket.belongsTo(Order, { foreignKey: 'order_id' });

// Auth & Audit
User.hasMany(AuthToken, { foreignKey: 'user_id' });
AuthToken.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(AuditLog, { foreignKey: 'user_id' });
AuditLog.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
  sequelize,
  User,
  Category,
  Event,
  TicketType,
  Order,
  Payment,
  Ticket,
  AuthToken,
  AuditLog
};