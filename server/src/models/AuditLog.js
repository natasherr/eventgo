const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const AuditLog = sequelize.define('AuditLog', {
  log_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER }, // Nullable for system actions
  action: { type: DataTypes.STRING(50), allowNull: false },
  entity_type: { type: DataTypes.STRING(50) },
  entity_id: { type: DataTypes.INTEGER },
  description: { type: DataTypes.TEXT },
  ip_address: { type: DataTypes.STRING(45) }
}, { tableName: 'audit_logs', timestamps: true, createdAt: 'created_at', updatedAt: false });

module.exports = AuditLog;