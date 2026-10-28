const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const AuthToken = sequelize.define('AuthToken', {
  token_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  purpose: { type: DataTypes.ENUM('two_fa_otp', 'password_reset'), allowNull: false },
  token_hash: { type: DataTypes.STRING(255), allowNull: false },
  expires_at: { type: DataTypes.DATE, allowNull: false },
  used_at: { type: DataTypes.DATE }
}, { tableName: 'auth_tokens', timestamps: true, createdAt: 'created_at', updatedAt: false });

module.exports = AuthToken;