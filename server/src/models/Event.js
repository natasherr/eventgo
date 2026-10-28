const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Event = sequelize.define('Event', {
  event_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  category_id: { type: DataTypes.INTEGER, allowNull: false },
  created_by: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING(150), allowNull: false },
  description: { type: DataTypes.TEXT },
  venue: { type: DataTypes.STRING(150), allowNull: false },
  event_date: { type: DataTypes.DATE, allowNull: false },
  banner_image: { type: DataTypes.STRING(255) },
  status: { type: DataTypes.ENUM('draft', 'published', 'cancelled', 'completed'), defaultValue: 'draft' }
}, { tableName: 'events', timestamps: true, createdAt: 'created_at', updatedAt: false });

module.exports = Event;