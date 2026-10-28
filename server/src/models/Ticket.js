const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Ticket = sequelize.define('Ticket', {
  ticket_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  order_id: { type: DataTypes.INTEGER, allowNull: false },
  reference_code: { type: DataTypes.STRING(20), allowNull: false, unique: true },
  qr_code: { type: DataTypes.TEXT },
  status: { type: DataTypes.ENUM('valid', 'used', 'cancelled'), defaultValue: 'valid' },
  checked_in_at: { type: DataTypes.DATE }
}, { tableName: 'tickets', timestamps: false });

module.exports = Ticket;