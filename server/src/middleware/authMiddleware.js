const jwt = require('jsonwebtoken');

// Roles with elevated privileges (can access admin-protected routes)
const ADMIN_ROLES = ['admin', 'supervisor', 'super_admin'];

// Protect routes (Requires Login)
exports.protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (Format: "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Attach user info to the request object
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Admin, Supervisor, or Super Admin access
exports.adminOnly = (req, res, next) => {
  if (req.user && ADMIN_ROLES.includes(req.user.role)) {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
};

// Super Admin only — highest privilege level
exports.superAdminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'super_admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied. Super admin only.' });
  }
};