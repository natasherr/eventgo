const { AuditLog } = require('../models');

/**
 * Logs an action to the audit_logs table
 * @param {number} userId - The ID of the user performing the action
 * @param {string} action - e.g., 'LOGIN', 'CREATE_EVENT', 'PAYMENT_SUCCESS'
 * @param {string} entityType - e.g., 'User', 'Event', 'Payment'
 * @param {number} entityId - The ID of the affected record
 * @param {string} description - A human-readable description
 * @param {string} ipAddress - The IP address of the request
 */
const logAction = async (userId, action, entityType = null, entityId = null, description = null, ipAddress = null) => {
  try {
    await AuditLog.create({
      user_id: userId,
      action: action,
      entity_type: entityType,
      entity_id: entityId,
      description: description,
      ip_address: ipAddress
    });
    // We console.log this so you can see it working in the terminal during testing
    console.log(`📝 [AUDIT LOG] ${action} by User ID: ${userId}`);
  } catch (error) {
    // We log the error but DON'T crash the app if logging fails
    console.error('❌ Failed to write audit log:', error.message);
  }
};

module.exports = { logAction };