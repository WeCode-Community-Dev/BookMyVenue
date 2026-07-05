import jwt from 'jsonwebtoken';

/**
 * Middleware to authenticate requests using JWT tokens.
 * Extracts the token from the Authorization header (expected format: Bearer <TOKEN>).
 * Validates the token and attaches the decoded payload (user info) to the request object.
 */
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Authentication token missing' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user; // user payload contains { id, email, role }
    next();
  });
};

/**
 * Middleware factory to restrict route access based on user roles.
 * Ensures the authenticated user possesses the required role before proceeding.
 * @param {string} role - The required user role (e.g., 'admin', 'venue_owner', 'user')
 */
export const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: `Access denied. Requires ${role} role.` });
    }
    next();
  };
};

