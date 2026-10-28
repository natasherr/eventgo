const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TicketType = sequelize.define('TicketType', {
  ticket_type_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  event_id: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING(50), allowNull: false },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  quantity_total: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'ticket_types', timestamps: false });

module.exports = TicketType;