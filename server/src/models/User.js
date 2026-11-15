const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  user_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  full_name: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
  phone_number: { type: DataTypes.STRING(15), allowNull: false },
  password_hash: { type: DataTypes.STRING(255), allowNull: false },
  role: { type: DataTypes.ENUM('user', 'admin', 'supervisor', 'super_admin'), defaultValue: 'user' },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  deletion_requested: { type: DataTypes.BOOLEAN, defaultValue: false },
  last_login: { type: DataTypes.DATE }
}, { tableName: 'users', timestamps: true, createdAt: 'created_at', updatedAt: false });

module.exports = User;