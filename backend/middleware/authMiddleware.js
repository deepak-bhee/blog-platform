import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Middleware to protect routes — verifies Bearer JWT token.
 * Attaches the authenticated user to req.user.
 */
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user to request (exclude password)
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists',
      });
    }

    next();
  } catch (error) {
    const message =
      error.name === 'TokenExpiredError'
        ? 'Token expired, please login again'
        : 'Not authorized, invalid token';

    return res.status(401).json({ success: false, message });
  }
};
