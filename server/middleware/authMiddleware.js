import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Middleware to protect routes and verify student JWT authentication.
 * Checks HTTP-only cookie first, falls back to Authorization header.
 */
export const protect = async (req, res, next) => {
  let token;

  // 1. Check HTTP-only cookie
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // 2. Fallback to Authorization: Bearer <token> header
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied: No authentication token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (excluding passwordHash)
    const user = await User.findById(decoded.id).select('-passwordHash');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication failed: User no longer exists'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.name === 'TokenExpiredError'
        ? 'Session expired: Please log in again'
        : 'Invalid token: Authentication verification failed'
    });
  }
};
