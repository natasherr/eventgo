const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Payment = sequelize.define('Payment', {
  payment_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  order_id: { type: DataTypes.INTEGER, allowNull: false },
  phone_number: { type: DataTypes.STRING(15), allowNull: false },
  amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  checkout_request_id: { type: DataTypes.STRING(100), unique: true },
  mpesa_receipt: { type: DataTypes.STRING(20) },
  status: { type: DataTypes.ENUM('pending', 'success', 'failed'), defaultValue: 'pending' },
  paid_at: { type: DataTypes.DATE }
}, { tableName: 'payments', timestamps: true, createdAt: 'initiated_at', updatedAt: false });

module.exports = Payment;